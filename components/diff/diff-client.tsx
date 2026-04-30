"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Itinerary, ProfileForPrompt } from "@/lib/schema"
import type { Locale } from "@/lib/i18n/dictionaries"

type ProfileOption = {
  id: string
  label: string
  profile: ProfileForPrompt
}

type Props = {
  locale: Locale
  profiles: ProfileOption[]
  labels: {
    profileA: string
    profileB: string
    destination: string
    tripLength: string
    generate: string
    differences: string
  }
}

type ColumnState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; itinerary: Itinerary }
  | { status: "error"; message: string }

async function generateItinerary(
  profile: ProfileForPrompt,
  locale: Locale
): Promise<Itinerary> {
  const res = await fetch("/api/generate-itinerary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, locale }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

type DiffStats = {
  activityCountA: number
  activityCountB: number
  avgStartTimeA: string
  avgStartTimeB: string
  foodPatternA: string[]
  foodPatternB: string[]
}

function computeDiff(a: Itinerary, b: Itinerary): DiffStats {
  const countActivities = (it: Itinerary) =>
    it.days.reduce((sum, d) => sum + d.activities.length, 0)

  function avgStartTime(it: Itinerary): string {
    const times = it.days
      .flatMap((d) => d.activities)
      .map((a) => a.time)
      .filter(Boolean)
      .map((t) => {
        const [h, m] = t.split(":").map(Number)
        return h * 60 + (m || 0)
      })
    if (!times.length) return "—"
    const avg = Math.round(times.reduce((s, t) => s + t, 0) / times.length)
    return `${String(Math.floor(avg / 60)).padStart(2, "0")}:${String(avg % 60).padStart(2, "0")}`
  }

  function foodActivities(it: Itinerary): string[] {
    return it.days
      .flatMap((d) => d.activities)
      .filter((a) => a.type === "food")
      .slice(0, 3)
      .map((a) => a.name)
  }

  return {
    activityCountA: countActivities(a),
    activityCountB: countActivities(b),
    avgStartTimeA: avgStartTime(a),
    avgStartTimeB: avgStartTime(b),
    foodPatternA: foodActivities(a),
    foodPatternB: foodActivities(b),
  }
}

function ItineraryColumn({
  state,
  profileLabel,
  profileSummary,
}: {
  state: ColumnState
  profileLabel: string
  profileSummary: string
}) {
  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {profileLabel}
        </p>
        <p className="text-sm text-text-muted leading-relaxed">{profileSummary}</p>
      </div>

      {state.status === "idle" && (
        <p className="text-sm text-text-muted">En attente de la génération.</p>
      )}
      {state.status === "loading" && (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="h-3 w-24 rounded bg-border" />
              <div className="h-4 w-3/4 rounded bg-border" />
              <div className="h-3 w-full rounded bg-border" />
            </div>
          ))}
        </div>
      )}
      {state.status === "error" && (
        <p className="text-sm text-state-error">Erreur : {state.message}</p>
      )}
      {state.status === "done" && (
        <div className="flex flex-col gap-6">
          {state.itinerary.days.map((day) => (
            <div key={day.dayNumber} className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Jour {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                </p>
                <p className="text-sm font-medium text-text-primary">{day.theme}</p>
              </div>
              <div className="flex flex-col gap-2">
                {day.activities.map((act, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-xs text-text-muted font-mono tabular-nums w-10 shrink-0 pt-0.5">
                      {act.time}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm text-text-primary">{act.name}</p>
                      <p className="text-xs text-text-muted leading-relaxed">{act.reasoning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function profileSummaryText(p: ProfileForPrompt): string {
  const parts: string[] = []
  const adults = p.travellers.adults
  const kids = p.travellers.kids?.length ?? 0
  parts.push(`${adults} adulte${adults > 1 ? "s" : ""}${kids ? ` + ${kids} enfant${kids > 1 ? "s" : ""}` : ""}`)
  parts.push(`${p.budget.dailyMaxCAD} $/j`)
  if (p.hardConstraints.dietary?.length) parts.push(p.hardConstraints.dietary.join(", "))
  const t = p.tradeoffs
  if (t.paceVsCoverage <= -2) parts.push("rythme lent")
  if (t.paceVsCoverage >= 2) parts.push("rythme soutenu")
  if (t.iconicVsHidden <= -2) parts.push("hors des sentiers")
  if (t.iconicVsHidden >= 2) parts.push("incontournables")
  return parts.join(" · ")
}

// Pre-built comparison pairs from the fixture profiles
const PRESET_PAIRS = [
  {
    label: "Couple anniversaire vs famille multi-générationnelle, Lisbonne",
    a: "couple-anniversary-premium-hidden",
    b: "multi-gen-popular-mobility",
    destination: "Lisbonne",
    length: 5,
  },
  {
    label: "Parent solo vs aventurier solo, Lisbonne",
    a: "solo-parent-slow-culture",
    b: "solo-adventurer-budget",
    destination: "Lisbonne",
    length: 5,
  },
]

export default function DiffClient({ locale, profiles, labels }: Props) {
  const [selectedA, setSelectedA] = useState(profiles[1].id) // couple anniversary
  const [selectedB, setSelectedB] = useState(profiles[2].id) // multi-gen
  const [destination, setDestination] = useState("Lisbonne")
  const [tripLength, setTripLength] = useState(5)
  const [stateA, setStateA] = useState<ColumnState>({ status: "idle" })
  const [stateB, setStateB] = useState<ColumnState>({ status: "idle" })

  const profileA = profiles.find((p) => p.id === selectedA)!
  const profileB = profiles.find((p) => p.id === selectedB)!

  async function handleGenerate() {
    setStateA({ status: "loading" })
    setStateB({ status: "loading" })

    const patchProfile = (p: ProfileForPrompt): ProfileForPrompt => ({
      ...p,
      destination,
      dates: { season: "summer", lengthDays: tripLength },
    })

    const [resA, resB] = await Promise.allSettled([
      generateItinerary(patchProfile(profileA.profile), locale),
      generateItinerary(patchProfile(profileB.profile), locale),
    ])

    setStateA(
      resA.status === "fulfilled"
        ? { status: "done", itinerary: resA.value }
        : { status: "error", message: (resA.reason as Error).message }
    )
    setStateB(
      resB.status === "fulfilled"
        ? { status: "done", itinerary: resB.value }
        : { status: "error", message: (resB.reason as Error).message }
    )
  }

  function applyPreset(preset: (typeof PRESET_PAIRS)[0]) {
    setSelectedA(preset.a)
    setSelectedB(preset.b)
    setDestination(preset.destination)
    setTripLength(preset.length)
    setStateA({ status: "idle" })
    setStateB({ status: "idle" })
  }

  const bothDone = stateA.status === "done" && stateB.status === "done"
  const diff = bothDone ? computeDiff(stateA.itinerary, stateB.itinerary) : null

  return (
    <div className="flex flex-col gap-10">
      {/* Preset links */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          Comparaisons pré-configurées
        </p>
        <div className="flex flex-col gap-1">
          {PRESET_PAIRS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-sm text-accent-primary hover:underline text-left"
            >
              → {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {labels.profileA}
            </p>
            <select
              value={selectedA}
              onChange={(e) => setSelectedA(e.target.value)}
              className="h-11 rounded-md border border-input bg-transparent px-3 text-sm text-text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {labels.profileB}
            </p>
            <select
              value={selectedB}
              onChange={(e) => setSelectedB(e.target.value)}
              className="h-11 rounded-md border border-input bg-transparent px-3 text-sm text-text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {labels.destination}
            </p>
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ex. : Lisbonne"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {labels.tripLength}
            </p>
            <Input
              type="number"
              min={1}
              max={14}
              value={tripLength}
              onChange={(e) => setTripLength(Number(e.target.value))}
            />
          </div>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={
            !destination.trim() ||
            selectedA === selectedB ||
            stateA.status === "loading" ||
            stateB.status === "loading"
          }
        >
          {stateA.status === "loading" || stateB.status === "loading"
            ? "Génération en cours…"
            : labels.generate}
        </Button>
      </div>

      {/* Side-by-side columns */}
      {(stateA.status !== "idle" || stateB.status !== "idle") && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <ItineraryColumn
              state={stateA}
              profileLabel={profileA.label}
              profileSummary={profileSummaryText(profileA.profile)}
            />
            <div className="hidden md:block w-px bg-border-subtle self-stretch" />
            <ItineraryColumn
              state={stateB}
              profileLabel={profileB.label}
              profileSummary={profileSummaryText(profileB.profile)}
            />
          </div>

          {/* Diff analysis */}
          {diff && (
            <div className="flex flex-col gap-4 border border-border rounded-md p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                {labels.differences}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-text-muted">Activités totales</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-text-header">{diff.activityCountA}</span>
                    <span className="text-sm text-text-muted">vs</span>
                    <span className="text-2xl font-bold text-text-header">{diff.activityCountB}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-text-muted">Heure de début moyenne</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-text-header">{diff.avgStartTimeA}</span>
                    <span className="text-sm text-text-muted">vs</span>
                    <span className="text-2xl font-bold text-text-header">{diff.avgStartTimeB}</span>
                  </div>
                </div>
                {diff.foodPatternA.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-text-muted">Restauration — {profileA.label}</p>
                    <ul className="text-sm text-text-secondary space-y-0.5">
                      {diff.foodPatternA.map((name) => (
                        <li key={name}>— {name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {diff.foodPatternB.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-text-muted">Restauration — {profileB.label}</p>
                    <ul className="text-sm text-text-secondary space-y-0.5">
                      {diff.foodPatternB.map((name) => (
                        <li key={name}>— {name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
