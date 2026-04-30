import type { ProfileForPrompt } from "@/lib/schema"

function getTripLength(profile: ProfileForPrompt): number {
  if ("lengthDays" in profile.dates) return profile.dates.lengthDays
  const start = new Date(profile.dates.start)
  const end = new Date(profile.dates.end)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

function describeTravellers(t: ProfileForPrompt["travellers"]): string {
  const parts: string[] = [`${t.adults} adult${t.adults > 1 ? "s" : ""}`]
  if (t.kids?.length) {
    parts.push(`${t.kids.length} kid${t.kids.length > 1 ? "s" : ""} (ages ${t.kids.join(", ")})`)
  }
  if (t.pets) {
    parts.push(`${t.pets} pet${t.pets > 1 ? "s" : ""}`)
  }
  return parts.join(", ")
}

export function buildItineraryPrompt(profile: ProfileForPrompt, locale: "fr" | "en" = "fr"): string {
  const t = profile.tradeoffs

  const tradeoffInstructions = [
    t.iconicVsHidden <= -2 && "MUST exclude TripAdvisor top-10 attractions. Lead with local/lesser-known. Justify each pick.",
    t.iconicVsHidden >= 2 && "MUST include the canonical landmarks. Skip obscure picks unless filling a logistical gap.",
    t.walkVsEfficient <= -2 && "MUST sequence activities to allow neighborhood walking between them. Frame transit as a feature.",
    t.walkVsEfficient >= 2 && "MUST minimize transit time. Recommend taxis over transit. Cluster venues tightly.",
    t.saveVsEase >= 2 && "Prioritize convenience over price within budget. Recommend skip-the-line tickets and taxis.",
    t.saveVsEase <= -2 && "Lead with free or low-cost activities. Recommend public transit. Note bring-your-own options where applicable.",
    t.paceVsCoverage <= -2 && "MUST schedule fewer activities per day with more time at each. Each day MUST include at least 90 min of unstructured time.",
    t.paceVsCoverage >= 2 && "Maximize coverage. Schedule tightly with no gaps over 30 min.",
    t.planVsFlexible >= 2 && "Each day MUST keep at least one half-day open with only suggestions, not bookings.",
    t.plannedFoodVsSpontaneous <= -2 && "MUST recommend specific restaurants with reservations needed. Justify each.",
    t.plannedFoodVsSpontaneous >= 2 && "MUST suggest neighborhoods/streets for spontaneous food discovery, not specific restaurants.",
    t.centralVsBetterStay >= 2 && "Cluster all activities near the accommodation neighborhood. Walking distance strongly preferred.",
    t.centralVsBetterStay <= -2 && "Spread activities across the city. Transit time between venues is acceptable.",
  ].filter(Boolean) as string[]

  const hardConstraints = [
    profile.hardConstraints.dietary?.length &&
      `DIETARY (NON-NEGOTIABLE): ${profile.hardConstraints.dietary.join(", ")}. MUST exclude venues that cannot accommodate. Flag any uncertainty.`,
    profile.hardConstraints.accessibility?.length &&
      `ACCESSIBILITY (NON-NEGOTIABLE): ${profile.hardConstraints.accessibility.join(", ")}. MUST verify each venue is reachable.`,
    profile.hardConstraints.avoid.length &&
      `AVOID LIST (NON-NEGOTIABLE): ${profile.hardConstraints.avoid.join(", ")}. MUST NOT include any of these.`,
  ].filter(Boolean) as string[]

  const interestBlock = profile.interestTags?.length
    ? [
        profile.interestTags.filter((t) => t.weight === 2).map((t) => `- MUST include at least one activity involving: ${t.tag}`),
        profile.interestTags.filter((t) => t.weight === -2).map((t) => `- MUST NOT include activities involving: ${t.tag}`),
      ]
        .flat()
        .join("\n")
    : null

  const localeInstruction = locale === "fr"
    ? "Output all activity names, descriptions, and reasoning in FRENCH. Use Quebec French register — complete sentences, formal but not stiff."
    : "Output all activity names, descriptions, and reasoning in ENGLISH."

  return `${localeInstruction}

You are generating a ${getTripLength(profile)}-day itinerary for ${profile.destination}.

TRAVELLERS: ${describeTravellers(profile.travellers)}
TRIP REASON: ${profile.reason}${profile.reason === "anniversary" ? " — MUST include one clearly romantic anchor moment" : ""}${profile.reason === "family_visit" ? " — MUST include at least one kid-appropriate activity per day" : ""}
BUDGET: ${profile.budget.dailyMaxCAD} CAD/day (${profile.budget.flexibility})
${profile.budget.splurgeOn?.length ? `SPLURGE on: ${profile.budget.splurgeOn.join(", ")}` : ""}
${profile.budget.saveOn?.length ? `SAVE on: ${profile.budget.saveOn.join(", ")}` : ""}

HARD CONSTRAINTS:
${hardConstraints.length ? hardConstraints.join("\n") : "None stated."}

PACE CEILING (NON-NEGOTIABLE):
- Maximum ${profile.paceCeiling.activitiesPerDay} activities per day.
- Mornings: ${profile.paceCeiling.morningStart}${profile.paceCeiling.morningStart === "leisurely" ? " — MUST NOT schedule first activity before 10:00" : ""}${profile.paceCeiling.morningStart === "early" ? " — first activity by 8:00" : ""}
- Walking tolerance: ${profile.paceCeiling.walkingTolerance}
- Downtime: ${profile.paceCeiling.downtimeRequired ? "REQUIRED daily — each day must have at least one unscheduled block" : "optional"}

TRADE-OFF DIRECTIVES:
${tradeoffInstructions.length ? tradeoffInstructions.map((i) => `- ${i}`).join("\n") : "- No strong trade-off directives. Use balanced defaults."}

${interestBlock ? `INTEREST WEIGHTING:\n${interestBlock}` : ""}

${profile.alreadyBooked?.length ? `ALREADY BOOKED (do not reschedule): ${profile.alreadyBooked.join("; ")}` : ""}
${profile.mustSee?.length ? `MUST-SEE (include if logistically possible): ${profile.mustSee.join("; ")}` : ""}

${profile.freeTextNuance ? `USER HAS STATED VERBATIM: "${profile.freeTextNuance}". Honor this in pacing, tone, and selection decisions.` : ""}

OUTPUT: Use the submit_itinerary tool. Each activity MUST include a "reasoning" field that cites a specific profile field above (e.g., "matches your strong preference for hidden over iconic"). The reasoning is user-facing — it appears as 'Pourquoi ça vous correspond' / 'Why this fits you'. It must be specific, not generic.`.trim()
}
