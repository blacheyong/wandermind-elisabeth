import type { TravellerDefaults, TripContext, ProfileForPrompt } from "@/lib/schema"

export function compileProfileForPrompt(
  defaults: TravellerDefaults,
  trip: TripContext
): ProfileForPrompt {
  // Trip-level overrides win over defaults for this trip only
  const overrides = trip.overrides ?? {}

  const destination = trip.destinationKnown
    ? (trip.destination ?? "")
    : (trip.preferenceRegion ?? "")

  return {
    travellers: trip.travellers,
    destination,
    dates: trip.dates,
    reason: trip.reason,
    budget: trip.budget,
    alreadyBooked: trip.alreadyBooked,
    mustSee: trip.mustSee,
    hardConstraints: overrides.hardConstraints ?? defaults.hardConstraints,
    paceCeiling: overrides.paceCeiling ?? defaults.paceCeiling,
    tradeoffs: overrides.tradeoffs ?? defaults.tradeoffs,
    interestTags: overrides.interestTags ?? defaults.interestTags,
    freeTextNuance: overrides.freeTextNuance ?? defaults.freeTextNuance,
    noveltyAppetite: overrides.noveltyAppetite ?? defaults.noveltyAppetite,
  }
}
