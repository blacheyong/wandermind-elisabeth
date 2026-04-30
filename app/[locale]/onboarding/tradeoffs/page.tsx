import { notFound } from "next/navigation"
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries"
import TradeoffsForm from "@/components/onboarding/tradeoffs-form"

type Params = Promise<{ locale: string }>

export default async function TradeoffsPage({ params }: { params: Params }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const d = await getDictionary(locale)
  const t = d.onboarding.tradeoffs

  const rows = [
    { key: "paceVsCoverage" as const, label: t.pace.label, left: t.pace.left, right: t.pace.right },
    { key: "iconicVsHidden" as const, label: t.discovery.label, left: t.discovery.left, right: t.discovery.right },
    { key: "walkVsEfficient" as const, label: t.movement.label, left: t.movement.left, right: t.movement.right },
    { key: "saveVsEase" as const, label: t.spending.label, left: t.spending.left, right: t.spending.right },
    { key: "planVsFlexible" as const, label: t.planning.label, left: t.planning.left, right: t.planning.right },
    { key: "centralVsBetterStay" as const, label: t.lodging.label, left: t.lodging.left, right: t.lodging.right },
    { key: "plannedFoodVsSpontaneous" as const, label: t.food.label, left: t.food.left, right: t.food.right },
  ]

  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-xl font-semibold text-text-header">{t.subheading}</h2>
      <TradeoffsForm
        rows={rows}
        adjustLater={t.adjustLater}
        continueLabel={d.actions.continue}
        backHref={`/${locale}/onboarding/review`}
        locale={locale}
      />
    </div>
  )
}
