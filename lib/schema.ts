import { z } from "zod"

const TradeoffValue = z.union([
  z.literal(-2),
  z.literal(-1),
  z.literal(0),
  z.literal(1),
  z.literal(2),
])

export const Tradeoffs = z.object({
  paceVsCoverage: TradeoffValue,
  iconicVsHidden: TradeoffValue,
  walkVsEfficient: TradeoffValue,
  saveVsEase: TradeoffValue,
  planVsFlexible: TradeoffValue,
  centralVsBetterStay: TradeoffValue,
  plannedFoodVsSpontaneous: TradeoffValue,
})

export const HardConstraints = z.object({
  accessibility: z.array(z.string()).optional(),
  dietary: z.array(z.string()).optional(),
  languageComfort: z.array(z.string()),
  avoid: z.array(z.string()),
})

export const PaceCeiling = z.object({
  activitiesPerDay: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal("flexible"),
  ]),
  walkingTolerance: z.enum(["low", "medium", "high"]),
  downtimeRequired: z.boolean(),
  morningStart: z.enum(["early", "leisurely", "late"]),
})

export const WeightedTag = z.object({
  tag: z.string(),
  weight: z.union([z.literal(-2), z.literal(-1), z.literal(1), z.literal(2)]),
})

export const TravellerDefaults = z.object({
  hardConstraints: HardConstraints,
  paceCeiling: PaceCeiling,
  tradeoffs: Tradeoffs,
  interestTags: z.array(WeightedTag).optional(),
  freeTextNuance: z.string().optional(),
  noveltyAppetite: z.enum(["popular_picks", "balanced", "off_beaten_path"]),
})

export const TripContext = z.object({
  travellers: z.object({
    adults: z.number().int().min(1),
    kids: z.array(z.number().int()).optional(),
    pets: z.number().int().optional(),
  }),
  destinationKnown: z.boolean(),
  destination: z.string().optional(),
  preferenceRegion: z.string().optional(),
  dates: z.union([
    z.object({ start: z.string(), end: z.string() }),
    z.object({ season: z.string(), lengthDays: z.number().int() }),
  ]),
  reason: z.enum([
    "leisure",
    "anniversary",
    "family_visit",
    "work_plus",
    "first_time",
    "return",
    "celebration",
  ]),
  budget: z.object({
    dailyMaxCAD: z.number(),
    flexibility: z.enum(["strict", "soft"]),
    saveOn: z
      .array(z.enum(["food", "stay", "experiences", "transport"]))
      .optional(),
    splurgeOn: z
      .array(z.enum(["food", "stay", "experiences", "transport"]))
      .optional(),
  }),
  alreadyBooked: z.array(z.string()).optional(),
  mustSee: z.array(z.string()).optional(),
  overrides: TravellerDefaults.partial().optional(),
})

// Compiled profile sent to prompt builder — merges TravellerDefaults + TripContext
export const ProfileForPrompt = z.object({
  travellers: TripContext.shape.travellers,
  destination: z.string(),
  dates: TripContext.shape.dates,
  reason: TripContext.shape.reason,
  budget: TripContext.shape.budget,
  alreadyBooked: z.array(z.string()).optional(),
  mustSee: z.array(z.string()).optional(),
  hardConstraints: HardConstraints,
  paceCeiling: PaceCeiling,
  tradeoffs: Tradeoffs,
  interestTags: z.array(WeightedTag).optional(),
  freeTextNuance: z.string().optional(),
  noveltyAppetite: TravellerDefaults.shape.noveltyAppetite,
})

// Wizard in-progress state (partial, stored in localStorage)
export const TripDraft = z.object({
  tripName: z.string().optional(),
  tripContext: TripContext.partial().optional(),
  travellerDefaults: TravellerDefaults.partial().optional(),
  currentStep: z
    .enum(["trip-context", "tradeoffs", "constraints", "review"])
    .default("trip-context"),
  lastUpdated: z.string(),
})

// Itinerary output schemas
export const ItineraryActivity = z.object({
  time: z.string(),
  name: z.string(),
  type: z.string(),
  durationMinutes: z.number(),
  estimatedCostCAD: z.number().optional(),
  reasoning: z.string(), // user-facing "why this fits you" / "pourquoi cela vous correspond"
})

export const ItineraryDay = z.object({
  dayNumber: z.number(),
  theme: z.string(),
  activities: z.array(ItineraryActivity),
})

export const Itinerary = z.object({
  id: z.string(),
  destination: z.string(),
  tripLengthDays: z.number(),
  days: z.array(ItineraryDay),
  promptUsed: z.string().optional(), // stored for profile-to-prompt visibility feature
})

// Derived TypeScript types
export type TradeoffValue = z.infer<typeof TradeoffValue>
export type Tradeoffs = z.infer<typeof Tradeoffs>
export type HardConstraints = z.infer<typeof HardConstraints>
export type PaceCeiling = z.infer<typeof PaceCeiling>
export type WeightedTag = z.infer<typeof WeightedTag>
export type TravellerDefaults = z.infer<typeof TravellerDefaults>
export type TripContext = z.infer<typeof TripContext>
export type ProfileForPrompt = z.infer<typeof ProfileForPrompt>
export type TripDraft = z.infer<typeof TripDraft>
export type ItineraryActivity = z.infer<typeof ItineraryActivity>
export type ItineraryDay = z.infer<typeof ItineraryDay>
export type Itinerary = z.infer<typeof Itinerary>
