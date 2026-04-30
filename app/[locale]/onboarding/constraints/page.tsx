import { notFound } from "next/navigation"
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries"
import ConstraintsForm from "@/components/onboarding/constraints-form"

type Params = Promise<{ locale: string }>

export default async function ConstraintsPage({ params }: { params: Params }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const d = await getDictionary(locale)

  return (
    <ConstraintsForm
      t={d.onboarding.constraints}
      continueLabel={d.actions.continue}
      backHref={`/${locale}/onboarding/review`}
      locale={locale}
    />
  )
}
