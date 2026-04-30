import type { ProfileForPrompt } from "@/lib/schema"
import type { Locale } from "@/lib/i18n/dictionaries"

export type ProfileSummaryCards = {
  whoWhere: string
  budgetReason: string
  nonNegotiables: string | null
  pace: string
  preferences: string | null
  nuance: string | null
}

const REASON_LABELS: Record<string, { fr: string; en: string }> = {
  leisure:      { fr: "Vacances", en: "Vacation" },
  anniversary:  { fr: "Anniversaire", en: "Anniversary" },
  family_visit: { fr: "Visite en famille", en: "Family visit" },
  work_plus:    { fr: "Travail + tourisme", en: "Work + leisure" },
  first_time:   { fr: "Première fois", en: "First time" },
  return:       { fr: "Retour", en: "Return visit" },
  celebration:  { fr: "Célébration", en: "Celebration" },
}

const TRADEOFF_DESCRIPTIONS: Array<{
  key: keyof ProfileForPrompt["tradeoffs"]
  fr: (v: number) => string | null
  en: (v: number) => string | null
}> = [
  {
    key: "paceVsCoverage",
    fr: (v) => v <= -2 ? "rythme très lent, profondeur" : v >= 2 ? "rythme soutenu, voir plus" : null,
    en: (v) => v <= -2 ? "very slow pace, depth" : v >= 2 ? "fast pace, see more" : null,
  },
  {
    key: "iconicVsHidden",
    fr: (v) => v <= -2 ? "incontournables seulement" : v >= 2 ? "hors des sentiers battus" : null,
    en: (v) => v <= -2 ? "iconic landmarks only" : v >= 2 ? "off the beaten path" : null,
  },
  {
    key: "walkVsEfficient",
    fr: (v) => v <= -2 ? "marcher dans les quartiers" : v >= 2 ? "minimiser les transferts" : null,
    en: (v) => v <= -2 ? "walk the neighbourhoods" : v >= 2 ? "minimise transit" : null,
  },
  {
    key: "saveVsEase",
    fr: (v) => v <= -2 ? "économiser partout" : v >= 2 ? "payer pour la facilité" : null,
    en: (v) => v <= -2 ? "save wherever possible" : v >= 2 ? "pay for convenience" : null,
  },
  {
    key: "planVsFlexible",
    fr: (v) => v >= 2 ? "garder des demi-journées libres" : null,
    en: (v) => v >= 2 ? "keep half-days open" : null,
  },
  {
    key: "plannedFoodVsSpontaneous",
    fr: (v) => v <= -2 ? "restaurants avec réservation" : v >= 2 ? "découverte spontanée" : null,
    en: (v) => v <= -2 ? "restaurants with reservations" : v >= 2 ? "spontaneous food discovery" : null,
  },
]

function describeTravellers(t: ProfileForPrompt["travellers"], locale: Locale): string {
  const parts: string[] = []
  if (locale === "fr") {
    parts.push(`${t.adults} adulte${t.adults > 1 ? "s" : ""}`)
    if (t.kids?.length) parts.push(`${t.kids.length} enfant${t.kids.length > 1 ? "s" : ""}`)
    if (t.pets) parts.push(`${t.pets} animal${t.pets > 1 ? "x" : ""}`)
  } else {
    parts.push(`${t.adults} adult${t.adults > 1 ? "s" : ""}`)
    if (t.kids?.length) parts.push(`${t.kids.length} kid${t.kids.length > 1 ? "s" : ""}`)
    if (t.pets) parts.push(`${t.pets} pet${t.pets > 1 ? "s" : ""}`)
  }
  return parts.join(", ")
}

function describeDates(dates: ProfileForPrompt["dates"], locale: Locale): string {
  if ("lengthDays" in dates) {
    return locale === "fr"
      ? `${dates.season} · ${dates.lengthDays} jours`
      : `${dates.season} · ${dates.lengthDays} days`
  }
  return `${dates.start} → ${dates.end}`
}

export function buildProfileSummary(
  profile: ProfileForPrompt,
  locale: Locale
): ProfileSummaryCards {
  const t = profile.tradeoffs

  // Who & where
  const whoWhere = [
    describeTravellers(profile.travellers, locale),
    profile.destination,
    describeDates(profile.dates, locale),
  ].join(" · ")

  // Budget & reason
  const reasonLabel = REASON_LABELS[profile.reason]?.[locale] ?? profile.reason
  const budgetFlex = locale === "fr"
    ? profile.budget.flexibility === "strict" ? "strict" : "souple"
    : profile.budget.flexibility
  const budgetReason = locale === "fr"
    ? `${profile.budget.dailyMaxCAD} $ CAD / jour · ${budgetFlex} · ${reasonLabel}`
    : `$${profile.budget.dailyMaxCAD} CAD / day · ${budgetFlex} · ${reasonLabel}`

  // Non-négociables
  const constraints: string[] = []
  if (profile.hardConstraints.dietary?.length) {
    constraints.push(...profile.hardConstraints.dietary)
  }
  if (profile.hardConstraints.accessibility?.length) {
    constraints.push(...profile.hardConstraints.accessibility)
  }
  if (profile.hardConstraints.avoid.length) {
    const avoidLabel = locale === "fr" ? "évite" : "avoids"
    constraints.push(`${avoidLabel} : ${profile.hardConstraints.avoid.slice(0, 3).join(", ")}`)
  }
  const nonNegotiables = constraints.length ? constraints.join(" · ") : null

  // Pace
  const densityLabel = locale === "fr"
    ? profile.paceCeiling.activitiesPerDay === "flexible"
      ? "densité flexible"
      : `${profile.paceCeiling.activitiesPerDay} activité${profile.paceCeiling.activitiesPerDay > 1 ? "s" : ""}/jour`
    : profile.paceCeiling.activitiesPerDay === "flexible"
      ? "flexible density"
      : `${profile.paceCeiling.activitiesPerDay} activit${profile.paceCeiling.activitiesPerDay > 1 ? "ies" : "y"}/day`

  const morningLabel = locale === "fr"
    ? { early: "départs matinaux", leisurely: "départs tranquilles", late: "départs tardifs" }[profile.paceCeiling.morningStart]
    : { early: "early starts", leisurely: "leisurely mornings", late: "late starts" }[profile.paceCeiling.morningStart]

  const downtimeLabel = profile.paceCeiling.downtimeRequired
    ? locale === "fr" ? "temps libre requis" : "downtime required"
    : null

  const pace = [densityLabel, morningLabel, downtimeLabel].filter(Boolean).join(" · ")

  // Strong trade-off preferences (±2 only)
  const strongPrefs = TRADEOFF_DESCRIPTIONS
    .map((d) => d[locale](t[d.key]))
    .filter(Boolean) as string[]
  const preferences = strongPrefs.length ? strongPrefs.join(" · ") : null

  return {
    whoWhere,
    budgetReason,
    nonNegotiables,
    pace,
    preferences,
    nuance: profile.freeTextNuance ?? null,
  }
}
