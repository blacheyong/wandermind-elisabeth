import { notFound } from "next/navigation"
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries"
import { TripDraftProvider } from "@/lib/contexts/trip-draft-context"
import OnboardingHero from "@/components/onboarding/onboarding-hero"
import RevealObserver from "@/components/ui/reveal-observer"

type Params = Promise<{ locale: string }>

export default async function OnboardingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const d = await getDictionary(locale)
  const { step1, step2, step3, step4 } = d.onboarding.progress

  return (
    <TripDraftProvider>
      <RevealObserver />
      <div style={{ background: "#2D39F7" }}>
        <div className="mx-auto max-w-3xl px-8 pt-28 pb-14">
          <OnboardingHero stepLabels={[step1, step2, step3, step4]} />
        </div>
      </div>
      <main className="mx-auto max-w-3xl px-8 pt-14 pb-20 flex flex-col gap-12">
        {children}
      </main>
    </TripDraftProvider>
  )
}
