import { notFound } from "next/navigation"
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n/dictionaries"
import DiffClient from "@/components/diff/diff-client"
import { TEST_PROFILES } from "@/lib/fixtures/test-profiles"

type Params = Promise<{ locale: string }>

export default async function DiffPage({ params }: { params: Params }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const d = await getDictionary(locale)

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-4 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          WanderMind — {d.diff.heading}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-text-header">
          {d.diff.heading}
        </h1>
        <p className="text-text-secondary">{d.diff.subheading}</p>
        <p className="text-sm text-text-muted leading-relaxed max-w-prose">
          {d.diff.pitch}
        </p>
      </div>

      <DiffClient
        locale={locale as Locale}
        profiles={TEST_PROFILES.map((p) => ({ id: p.id, label: p.label, profile: p.profile }))}
        labels={{
          profileA: d.diff.profileA,
          profileB: d.diff.profileB,
          destination: d.diff.destination,
          tripLength: d.diff.tripLength,
          generate: d.diff.generate,
          differences: d.diff.differences,
        }}
      />
    </main>
  )
}
