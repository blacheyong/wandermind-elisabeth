import { notFound } from "next/navigation"
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries"
import TripContextForm from "@/components/onboarding/trip-context-form"

type Params = Promise<{ locale: string }>

export default async function TripContextPage({ params }: { params: Params }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const d = await getDictionary(locale)

  return (
    <TripContextForm
      t={d.onboarding.tripContext}
      continueLabel={d.actions.continue}
      locale={locale}
    />
  )
}
