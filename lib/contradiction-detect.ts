import type { ProfileForPrompt } from "@/lib/schema"
import type { Locale } from "@/lib/i18n/dictionaries"

type ContradictionMessage = { fr: string; en: string }

const CONTRADICTIONS: Array<{
  detect: (p: ProfileForPrompt) => boolean
  message: ContradictionMessage
}> = [
  {
    detect: (p) =>
      p.paceCeiling.activitiesPerDay === 3 && p.paceCeiling.downtimeRequired,
    message: {
      fr: "3 activités/jour et temps libre requis s'opposent — l'un des deux sera ignoré.",
      en: "3 activities/day and required downtime conflict — one will be overridden.",
    },
  },
  {
    detect: (p) =>
      p.tradeoffs.iconicVsHidden >= 2 &&
      (p.interestTags ?? []).some(
        (t) =>
          (t.tag.includes("hidden") || t.tag.includes("off_beaten") || t.tag.includes("local")) &&
          t.weight <= -2
      ),
    message: {
      fr: "Préférence forte pour les lieux connus, mais vous évitez les tags locaux/hors des sentiers — contradiction de découverte.",
      en: "Strong preference for iconic picks, but you're avoiding local/hidden tags — discovery conflict.",
    },
  },
  {
    detect: (p) =>
      p.budget.dailyMaxCAD < 100 && p.tradeoffs.saveVsEase >= 2,
    message: {
      fr: "Budget sous 100 CAD/jour avec une préférence pour la facilité — les deux s'opposent dans la majorité des destinations.",
      en: "Budget under $100 CAD/day with a preference for convenience — these conflict in most destinations.",
    },
  },
  {
    detect: (p) =>
      p.tradeoffs.walkVsEfficient <= -2 &&
      p.paceCeiling.walkingTolerance === "low",
    message: {
      fr: "Vous souhaitez explorer à pied les quartiers, mais avec une tolérance à la marche faible — contradiction de mobilité.",
      en: "You want to walk neighborhoods, but your walking tolerance is low — mobility conflict.",
    },
  },
  {
    detect: (p) =>
      p.paceCeiling.morningStart === "leisurely" &&
      p.tradeoffs.paceVsCoverage >= 2,
    message: {
      fr: "Départs tardifs et rythme maximal — les deux réduisent la fenêtre de visite.",
      en: "Leisurely mornings and maximum coverage — these compress your visiting window.",
    },
  },
  {
    detect: (p) =>
      p.tradeoffs.plannedFoodVsSpontaneous >= 2 &&
      p.hardConstraints.dietary !== undefined &&
      (p.hardConstraints.dietary?.length ?? 0) > 0,
    message: {
      fr: "Découverte spontanée de la nourriture avec des contraintes alimentaires strictes — difficile à concilier sans vérification préalable.",
      en: "Spontaneous food discovery with strict dietary constraints — hard to reconcile without vetting venues first.",
    },
  },
]

export function detectContradictions(
  profile: ProfileForPrompt,
  locale: Locale
): string[] {
  return CONTRADICTIONS.filter((c) => c.detect(profile)).map(
    (c) => c.message[locale]
  )
}
