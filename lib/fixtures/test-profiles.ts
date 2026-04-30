import { TravellerDefaults, TripContext, ProfileForPrompt } from "@/lib/schema"
import { compileProfileForPrompt } from "@/lib/profile-merge"

// All 4 profiles are for Lisbon, 5 days, August — same destination enables apples-to-apples /diff comparison.
// Profiles are designed with opposing axes to maximize visible differentiation.

const LISBON_AUGUST_DATES = { season: "august", lengthDays: 5 }

// --- Profile 1: Solo parent, slow culture ---
// Opposing axes vs Profile 2: low pace vs high pace, celiac vs no constraints,
// modern art focus vs hidden-gem food focus, leisurely mornings vs early starts

const soloParentDefaults: TravellerDefaults = {
  hardConstraints: {
    dietary: ["celiac"], // non-negotiable
    accessibility: [],
    languageComfort: ["français", "anglais"],
    avoid: ["nightlife", "loud bars", "late-night venues"],
  },
  paceCeiling: {
    activitiesPerDay: 2, // kid can't handle more
    walkingTolerance: "medium",
    downtimeRequired: true,
    morningStart: "leisurely", // kid rhythm
  },
  tradeoffs: {
    paceVsCoverage: -2, // fewer, deeper — opposing Profile 2 (+2)
    iconicVsHidden: -1, // slight lean hidden
    walkVsEfficient: 1, // prefer walking neighborhoods
    saveVsEase: -1, // save where possible on solo-parent budget
    planVsFlexible: 1, // structure helps with kid
    centralVsBetterStay: 2, // central matters with a child
    plannedFoodVsSpontaneous: -1, // pre-check gluten-free
  },
  interestTags: [
    { tag: "street_food", weight: 2 }, // gluten-free street food in Lisbon
    { tag: "modern_art", weight: 2 },
    { tag: "nightlife", weight: -2 },
    { tag: "fine_dining", weight: -1 },
  ],
  freeTextNuance: "Voyager avec un enfant de 10 ans — pas trop long entre les pauses, quelque chose à faire pour lui aussi.",
  noveltyAppetite: "balanced",
}

const soloParentTrip: TripContext = {
  travellers: { adults: 1, kids: [10] },
  destinationKnown: true,
  destination: "Lisbonne",
  dates: LISBON_AUGUST_DATES,
  reason: "leisure",
  budget: {
    dailyMaxCAD: 200,
    flexibility: "soft",
    saveOn: ["stay", "transport"],
    splurgeOn: ["experiences"],
  },
}

// --- Profile 2: Couple anniversary, premium, hidden gems ---
// Opposing Profile 1: high pace, premium budget, strong hidden-gem lean, early starts

const coupleAnniversaryDefaults: TravellerDefaults = {
  hardConstraints: {
    dietary: [],
    accessibility: [],
    languageComfort: ["français", "anglais", "portugais"],
    avoid: ["tourist traps", "chain restaurants", "crowded lunch spots"],
  },
  paceCeiling: {
    activitiesPerDay: 3,
    walkingTolerance: "high",
    downtimeRequired: false,
    morningStart: "early", // beat the crowds
  },
  tradeoffs: {
    paceVsCoverage: 2, // maximize coverage — opposing Profile 1 (-2)
    iconicVsHidden: -2, // strong hidden-gem lean — opposing Profile 3 (+2)
    walkVsEfficient: -2, // walk the neighborhoods
    saveVsEase: 2, // spend for quality and convenience
    planVsFlexible: -1, // slight spontaneity
    centralVsBetterStay: -2, // best hotel wins over location
    plannedFoodVsSpontaneous: -2, // specific restaurants with reservations
  },
  interestTags: [
    { tag: "fine_dining", weight: 2 },
    { tag: "wine_bars", weight: 2 },
    { tag: "street_food", weight: -1 },
    { tag: "tourist_attractions", weight: -2 },
  ],
  freeTextNuance: "Anniversaire — au moins un moment vraiment mémorable. On connaît déjà les incontournables.",
  noveltyAppetite: "off_beaten_path",
}

const coupleAnniversaryTrip: TripContext = {
  travellers: { adults: 2 },
  destinationKnown: true,
  destination: "Lisbonne",
  dates: LISBON_AUGUST_DATES,
  reason: "anniversary",
  budget: {
    dailyMaxCAD: 400,
    flexibility: "soft",
    splurgeOn: ["food", "experiences"],
    saveOn: [],
  },
}

// --- Profile 3: Multi-gen family, popular picks, mobility-aware ---
// Opposing Profile 2: iconic picks vs hidden, limited walking vs high walking,
// strict budget vs premium, large group logistics

const multiGenDefaults: TravellerDefaults = {
  hardConstraints: {
    dietary: ["allergie noix"],
    accessibility: ["marche limitée"], // senior in group
    languageComfort: ["français", "anglais"],
    avoid: ["steep hills", "long stairways", "fast-paced walking tours"],
  },
  paceCeiling: {
    activitiesPerDay: 1, // senior + 2 kids — one main thing per day
    walkingTolerance: "low",
    downtimeRequired: true,
    morningStart: "leisurely",
  },
  tradeoffs: {
    paceVsCoverage: -1, // slow — the senior sets the pace
    iconicVsHidden: 2, // popular picks — group consensus travels safe — opposing Profile 2 (-2)
    walkVsEfficient: 2, // minimize walking — opposing Profile 2 (-2)
    saveVsEase: -1, // strict budget
    planVsFlexible: 2, // structure needed for 5-person group
    centralVsBetterStay: 1, // central reduces transit stress
    plannedFoodVsSpontaneous: -1, // pre-vet for nut allergy
  },
  interestTags: [
    { tag: "museums", weight: 1 },
    { tag: "viewpoints", weight: 2 },
    { tag: "kid_friendly", weight: 2 },
    { tag: "fine_dining", weight: -1 },
    { tag: "nightlife", weight: -2 },
  ],
  freeTextNuance: "Grand-mère avec nous — rythme lent, sièges disponibles, ascenseurs si possible. Les enfants ont 7 et 9 ans.",
  noveltyAppetite: "popular_picks",
}

const multiGenTrip: TripContext = {
  travellers: { adults: 3, kids: [7, 9] }, // 2 adults + 1 senior counted as adult
  destinationKnown: true,
  destination: "Lisbonne",
  dates: LISBON_AUGUST_DATES,
  reason: "family_visit",
  budget: {
    dailyMaxCAD: 250,
    flexibility: "strict",
    saveOn: ["food", "transport"],
    splurgeOn: [],
  },
}

// --- Profile 4: Solo adventurer, budget, vegan, off-grid ---
// Opposing Profile 3: off beaten path vs popular, budget vs mid-range,
// high walking vs low walking, early + packed vs leisurely + one thing

const soloAdventurerDefaults: TravellerDefaults = {
  hardConstraints: {
    dietary: ["végétalien"],
    accessibility: [],
    languageComfort: ["anglais", "français"],
    avoid: ["tourist restaurants", "guided tours", "resort areas"],
  },
  paceCeiling: {
    activitiesPerDay: 3,
    walkingTolerance: "high",
    downtimeRequired: false,
    morningStart: "early",
  },
  tradeoffs: {
    paceVsCoverage: 2, // maximize — opposing Profile 3 (-1) and Profile 1 (-2)
    iconicVsHidden: -2, // strong off-beaten — opposing Profile 3 (+2)
    walkVsEfficient: -2, // walk everywhere — opposing Profile 3 (+2)
    saveVsEase: -2, // strict budget, do it yourself — opposing Profile 2 (+2)
    planVsFlexible: 2, // keep afternoons open for spontaneous finds
    centralVsBetterStay: -1, // hostel is fine
    plannedFoodVsSpontaneous: 2, // discover on the street, no reservations
  },
  interestTags: [
    { tag: "hiking", weight: 2 },
    { tag: "street_art", weight: 2 },
    { tag: "local_markets", weight: 2 },
    { tag: "fine_dining", weight: -2 },
    { tag: "tourist_attractions", weight: -1 },
  ],
  freeTextNuance: "Seul, flexible, vegan strict. Je préfère me perdre dans un quartier que suivre un plan. Budget serré.",
  noveltyAppetite: "off_beaten_path",
}

const soloAdventurerTrip: TripContext = {
  travellers: { adults: 1 },
  destinationKnown: true,
  destination: "Lisbonne",
  dates: LISBON_AUGUST_DATES,
  reason: "leisure",
  budget: {
    dailyMaxCAD: 120,
    flexibility: "strict",
    saveOn: ["food", "stay", "transport"],
    splurgeOn: [],
  },
}

// Compile into ProfileForPrompt and export for use in /diff and tests

export const soloParentProfile: ProfileForPrompt = compileProfileForPrompt(
  soloParentDefaults,
  soloParentTrip
)

export const coupleAnniversaryProfile: ProfileForPrompt = compileProfileForPrompt(
  coupleAnniversaryDefaults,
  coupleAnniversaryTrip
)

export const multiGenProfile: ProfileForPrompt = compileProfileForPrompt(
  multiGenDefaults,
  multiGenTrip
)

export const soloAdventurerProfile: ProfileForPrompt = compileProfileForPrompt(
  soloAdventurerDefaults,
  soloAdventurerTrip
)

export const TEST_PROFILES = [
  { id: "solo-parent-slow-culture", label: "Parent solo — culture lente", profile: soloParentProfile },
  { id: "couple-anniversary-premium-hidden", label: "Couple anniversaire — premium hors des sentiers", profile: coupleAnniversaryProfile },
  { id: "multi-gen-popular-mobility", label: "Famille multi-générationnelle — incontournables accessibles", profile: multiGenProfile },
  { id: "solo-adventurer-budget", label: "Aventurier solo — budget serré", profile: soloAdventurerProfile },
] as const
