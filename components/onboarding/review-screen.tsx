"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTripDraft } from "@/lib/contexts/trip-draft-context"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { compileProfileForPrompt } from "@/lib/profile-merge"
import { buildProfileSummary } from "@/lib/profile-summary"
import { detectContradictions } from "@/lib/contradiction-detect"
import { saveItinerary } from "@/lib/storage"
import type { Locale } from "@/lib/i18n/dictionaries"
import type { Dictionary } from "@/lib/i18n/locales/fr"
import type { TravellerDefaults, TripContext } from "@/lib/schema"
import { cn } from "@/lib/utils"

type T = Dictionary["onboarding"]["review"]

type Props = {
  t: T
  tConstraints: Dictionary["onboarding"]["constraints"]
  tTradeoffs: Dictionary["onboarding"]["tradeoffs"]
  tTripContext: Dictionary["onboarding"]["tripContext"]
  editLabel: string
  editAnswersLabel: string
  locale: Locale
  generateLabel: string
}

const DEFAULT_DEFAULTS: TravellerDefaults = {
  hardConstraints: { languageComfort: ["français"], avoid: [] },
  paceCeiling: { activitiesPerDay: "flexible", walkingTolerance: "medium", downtimeRequired: false, morningStart: "leisurely" },
  tradeoffs: { paceVsCoverage: 0, iconicVsHidden: 0, walkVsEfficient: 0, saveVsEase: 0, planVsFlexible: 0, centralVsBetterStay: 0, plannedFoodVsSpontaneous: 0 },
  noveltyAppetite: "balanced",
}

const DEFAULT_TRIP: TripContext = {
  travellers: { adults: 1 },
  destinationKnown: false,
  preferenceRegion: "À définir",
  dates: { season: "été", lengthDays: 5 },
  reason: "leisure",
  budget: { dailyMaxCAD: 200, flexibility: "soft" },
}

export default function ReviewScreen({ t, editLabel, editAnswersLabel, locale, generateLabel }: Props) {
  const { draft } = useTripDraft()
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const travellerDefaults = (draft.travellerDefaults as TravellerDefaults | undefined) ?? DEFAULT_DEFAULTS
  const tripContext = (draft.tripContext as TripContext | undefined) ?? DEFAULT_TRIP

  const profile = compileProfileForPrompt(travellerDefaults, tripContext)
  const summary = buildProfileSummary(profile, locale)
  const contradictions = detectContradictions(profile, locale)

  const destination = profile.destination || (locale === "fr" ? "À définir" : "TBD")

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, locale }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      const itinerary = await res.json()
      saveItinerary(itinerary)
      router.push(`/${locale}/trip/${itinerary.id}`)
    } catch (err) {
      setError((err as Error).message)
      setGenerating(false)
    }
  }

  const summaryRows: Array<{ key: keyof typeof t.sections; value: string | null }> = [
    { key: "whoWhere", value: summary.whoWhere },
    { key: "budgetReason", value: summary.budgetReason },
    { key: "nonNegotiables", value: summary.nonNegotiables },
    { key: "pace", value: summary.pace },
    { key: "preferences", value: summary.preferences },
    { key: "nuance", value: summary.nuance },
  ]

  return (
    <div className="flex flex-col gap-8">
      {contradictions.length > 0 && (
        <Card className="border-state-warning bg-surface-warning">
          <CardHeader>
            <CardTitle className="text-state-warning">{t.contradictionWarning}</CardTitle>
            <CardDescription>
              {contradictions.map((c, i) => (
                <span key={i} className="block">{c}</span>
              ))}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-col gap-4 byc-reveal">
        {summaryRows.map(({ key, value }) =>
          value ? (
            <Card key={key} className="w-full">
              <CardHeader>
                <CardTitle>{t.sections[key]}</CardTitle>
                <CardDescription>{value}</CardDescription>
                <CardAction>
                  <Link
                    href={`/${locale}/onboarding/${
                      key === "whoWhere" || key === "budgetReason" ? "trip-context"
                      : key === "preferences" ? "tradeoffs"
                      : key === "nonNegotiables" || key === "pace" || key === "nuance" ? "constraints"
                      : "trip-context"
                    }`}
                    className="text-sm text-text-action hover:underline"
                  >
                    {editLabel}
                  </Link>
                </CardAction>
              </CardHeader>
            </Card>
          ) : null
        )}
      </div>

      {error && (
        <p className="text-sm text-state-error">{error}</p>
      )}

      <div className="flex flex-col gap-3 pt-4 byc-reveal">
        <Button onClick={handleGenerate} disabled={generating} size="lg">
          {generating
            ? locale === "fr" ? `Conception de votre séjour à ${destination}…` : `Designing your trip to ${destination}…`
            : generateLabel.replace("{destination}", destination)}
        </Button>
        <Link
          href={`/${locale}/onboarding/trip-context`}
          className={cn(buttonVariants({ variant: "ghost" }), "justify-center")}
        >
          {editAnswersLabel}
        </Link>
      </div>
    </div>
  )
}
