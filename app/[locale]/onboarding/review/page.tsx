import { notFound } from "next/navigation"
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n/dictionaries"
import ReviewScreen from "@/components/onboarding/review-screen"

type Params = Promise<{ locale: string }>

export default async function ReviewPage({ params }: { params: Params }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const d = await getDictionary(locale)
  const destination = "{destination}"
  const generateLabel = locale === "fr"
    ? `Générer mon itinéraire pour ${destination}`
    : `Generate my ${destination} itinerary`

  return (
    <ReviewScreen
      t={d.onboarding.review}
      tConstraints={d.onboarding.constraints}
      tTradeoffs={d.onboarding.tradeoffs}
      tTripContext={d.onboarding.tripContext}
      editLabel={d.actions.edit}
      editAnswersLabel={d.actions.editAnswers}
      locale={locale as Locale}
      generateLabel={generateLabel}
    />
  )
}
