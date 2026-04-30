"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Itinerary as ItinerarySchema } from "@/lib/schema"

const ITINERARY_PREFIX = "wandermind:itinerary:"

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  return () => window.removeEventListener("storage", onStoreChange)
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  food: "Restauration",
  museum: "Musée",
  outdoor: "Extérieur",
  transport: "Transport",
  neighborhood: "Quartier",
  experience: "Expérience",
  rest: "Pause",
}

export default function TripPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>()
  const [showPrompt, setShowPrompt] = useState(false)

  const rawItinerary = useSyncExternalStore(
    subscribeToStorage,
    () => window.localStorage.getItem(`${ITINERARY_PREFIX}${id}`),
    () => null
  )

  const itinerary = useMemo(() => {
    if (!rawItinerary) return null
    try {
      return ItinerarySchema.parse(JSON.parse(rawItinerary))
    } catch {
      return null
    }
  }, [rawItinerary])

  if (!itinerary) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 flex flex-col gap-6">
        <p className="text-text-muted text-sm">Itinéraire introuvable.</p>
        <Link href={`/${locale}/onboarding/trip-context`} className="text-accent-primary text-sm hover:underline">
          ← Recommencer
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          WanderMind — {itinerary.tripLengthDays} jours
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-text-header">
          {itinerary.destination}
        </h1>
        {itinerary.promptUsed && (
          <button
            onClick={() => setShowPrompt((v) => !v)}
            className="text-xs text-text-muted hover:text-text-secondary text-left"
          >
            {showPrompt ? "▲" : "▼"} Voir pourquoi ce voyage vous correspond
          </button>
        )}
      </div>

      {showPrompt && itinerary.promptUsed && (
        <div className="flex flex-col gap-3 border border-border rounded-md p-4 bg-surface-elevated">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Instructions transmises
          </p>
          <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
            {itinerary.promptUsed}
          </pre>
        </div>
      )}

      {itinerary.days.map((day) => (
        <div key={day.dayNumber} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Jour {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-text-header">
              {day.theme || "Journée libre"}
            </h2>
          </div>

          {day.activities.length === 0 ? (
            <p className="text-sm text-text-muted italic">Journée libre — aucune activité planifiée.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {day.activities.map((act, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <span className="text-xs text-text-muted font-mono tabular-nums w-10 shrink-0">
                      {act.time}
                    </span>
                    {i < day.activities.length - 1 && (
                      <div className="w-px flex-1 bg-border-subtle mt-2" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 pb-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-base font-medium text-text-primary">{act.name}</p>
                      <span className="text-xs text-text-muted">
                        {ACTIVITY_TYPE_LABELS[act.type] ?? act.type}
                      </span>
                      {act.durationMinutes && (
                        <span className="text-xs text-text-muted">{act.durationMinutes} min</span>
                      )}
                      {act.estimatedCostCAD !== undefined && (
                        <span className="text-xs text-text-muted">
                          {act.estimatedCostCAD === 0 ? "Gratuit" : `~${act.estimatedCostCAD} $`}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      <span className="text-xs font-medium uppercase tracking-wide text-text-muted mr-2">
                        Pourquoi ça vous correspond —
                      </span>
                      {act.reasoning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr className="border-border-subtle" />
        </div>
      ))}

      <div className="flex gap-4 pt-4">
        <Link
          href={`/${locale}/onboarding/review`}
          className="text-sm text-text-secondary hover:text-text-primary hover:underline"
        >
          ← Modifier mes réponses
        </Link>
        <Link
          href={`/${locale}/diff`}
          className="text-sm text-accent-primary hover:underline"
        >
          Comparer deux profils →
        </Link>
      </div>
    </main>
  )
}
