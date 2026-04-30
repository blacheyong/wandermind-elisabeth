"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTripDraft } from "@/lib/contexts/trip-draft-context"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import StepNav from "@/components/onboarding/step-nav"
import type { Dictionary } from "@/lib/i18n/locales/fr"
import type { PaceCeiling } from "@/lib/schema"

type T = Dictionary["onboarding"]["constraints"]

type Props = {
  t: T
  continueLabel: string
  backHref: string
  locale: string
}

function ChipToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center rounded-[16px] border px-5 text-base font-medium transition-colors ${
        active
          ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
          : "border-[var(--byco-grey-500)] text-text-secondary hover:border-accent-primary"
      }`}
    >
      {label}
    </button>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-bold uppercase tracking-wide text-text-header">
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-text-header">{children}</h2>
  )
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
}

export default function ConstraintsForm({ t, continueLabel, backHref, locale }: Props) {
  const { draft, setDraft } = useTripDraft()
  const router = useRouter()
  const saved = draft.travellerDefaults

  // Accessibility
  const [accessibility, setAccessibility] = useState<string[]>(
    saved?.hardConstraints?.accessibility ?? []
  )

  // Dietary
  const [dietary, setDietary] = useState<string[]>(
    saved?.hardConstraints?.dietary ?? []
  )
  const [dietaryOther, setDietaryOther] = useState("")

  // Languages
  const [languages, setLanguages] = useState<string[]>(
    saved?.hardConstraints?.languageComfort ?? ["français", "anglais"]
  )
  const [languageOther, setLanguageOther] = useState("")

  // Avoid
  const [avoidText, setAvoidText] = useState(
    saved?.hardConstraints?.avoid?.join(", ") ?? ""
  )

  // Pace ceiling
  const [activitiesPerDay, setActivitiesPerDay] = useState<PaceCeiling["activitiesPerDay"]>(
    saved?.paceCeiling?.activitiesPerDay ?? "flexible"
  )
  const [morningStart, setMorningStart] = useState<PaceCeiling["morningStart"]>(
    saved?.paceCeiling?.morningStart ?? "leisurely"
  )
  const [walkingTolerance, setWalkingTolerance] = useState<PaceCeiling["walkingTolerance"]>(
    saved?.paceCeiling?.walkingTolerance ?? "medium"
  )
  const [downtimeRequired, setDowntimeRequired] = useState(
    saved?.paceCeiling?.downtimeRequired ?? false
  )

  // Free text nuance
  const [nuance, setNuance] = useState(saved?.freeTextNuance ?? "")

  const isValid = activitiesPerDay !== undefined

  function handleContinue() {
    const avoidList = avoidText
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)

    const allDietary = [...dietary]
    if (dietaryOther.trim()) allDietary.push(dietaryOther.trim())

    const allLanguages = [...languages]
    if (languageOther.trim()) allLanguages.push(languageOther.trim())

    setDraft({
      travellerDefaults: {
        ...saved,
        hardConstraints: {
          accessibility,
          dietary: allDietary.length ? allDietary : undefined,
          languageComfort: allLanguages,
          avoid: avoidList,
        },
        paceCeiling: {
          activitiesPerDay,
          morningStart,
          walkingTolerance,
          downtimeRequired,
        },
        freeTextNuance: nuance || undefined,
        noveltyAppetite: saved?.noveltyAppetite ?? "balanced",
        tradeoffs: saved?.tradeoffs ?? {
          paceVsCoverage: 0,
          iconicVsHidden: 0,
          walkVsEfficient: 0,
          saveVsEase: 0,
          planVsFlexible: 0,
          centralVsBetterStay: 0,
          plannedFoodVsSpontaneous: 0,
        },
        interestTags: saved?.interestTags,
      },
    })
    router.push(`/${locale}/onboarding/review`)
  }

  return (
    <div className="flex flex-col gap-10">

      {/* Section 1 — Things to respect */}
      <div className="flex flex-col gap-6 byc-reveal">
        <SectionHeading>{t.respectHeading}</SectionHeading>

        <div className="flex flex-col gap-3">
          <FieldLabel>Accessibilité</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {Object.entries(t.accessibility).map(([key, label]) => (
              <ChipToggle
                key={key}
                label={label}
                active={accessibility.includes(key)}
                onClick={() => setAccessibility((a) => toggle(a, key))}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <FieldLabel>Régime alimentaire</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {Object.entries(t.dietary).map(([key, label]) => (
              key === "other" ? (
                <ChipToggle
                  key={key}
                  label={label}
                  active={dietary.includes("other")}
                  onClick={() => setDietary((d) => toggle(d, "other"))}
                />
              ) : (
                <ChipToggle
                  key={key}
                  label={label}
                  active={dietary.includes(key)}
                  onClick={() => setDietary((d) => toggle(d, key))}
                />
              )
            ))}
          </div>
          {dietary.includes("other") && (
            <Input
              placeholder={t.otherInput}
              value={dietaryOther}
              onChange={(e) => setDietaryOther(e.target.value)}
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <FieldLabel>Langues</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {Object.entries(t.languages).map(([key, label]) => (
              key === "other" ? (
                <ChipToggle
                  key={key}
                  label={label}
                  active={languages.includes("other")}
                  onClick={() => setLanguages((l) => toggle(l, "other"))}
                />
              ) : (
                <ChipToggle
                  key={key}
                  label={label}
                  active={languages.includes(key)}
                  onClick={() => setLanguages((l) => toggle(l, key))}
                />
              )
            ))}
          </div>
          {languages.includes("other") && (
            <Input
              placeholder={t.otherInput}
              value={languageOther}
              onChange={(e) => setLanguageOther(e.target.value)}
            />
          )}
        </div>
      </div>

      <hr className="border-border-subtle" />

      {/* Section 2 — Avoid */}
      <div className="flex flex-col gap-4 byc-reveal byc-reveal--delay-1">
        <SectionHeading>{t.avoidHeading}</SectionHeading>
        <Textarea
          placeholder={t.avoidPlaceholder}
          value={avoidText}
          onChange={(e) => setAvoidText(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {t.avoidSuggestions.map((suggestion) => {
            const active = avoidText.toLowerCase().includes(suggestion.toLowerCase())
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setAvoidText((prev) => {
                    if (active) return prev
                    return prev ? `${prev}, ${suggestion}` : suggestion
                  })
                }}
                className={`inline-flex h-11 items-center rounded-[16px] border px-5 text-base font-medium transition-colors ${
                  active
                    ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                    : "border-[var(--byco-grey-500)] text-text-secondary hover:border-accent-primary"
                }`}
              >
                {suggestion}
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-border-subtle" />

      {/* Section 3 — Daily density */}
      <div className="flex flex-col gap-6 byc-reveal byc-reveal--delay-2">
        <SectionHeading>{t.densityHeading}</SectionHeading>
        <p className="text-sm text-text-secondary">{t.densityQuestion}</p>

        <div className="flex flex-wrap gap-2">
          <ChipToggle label={t.density1} active={activitiesPerDay === 1} onClick={() => setActivitiesPerDay(1)} />
          <ChipToggle label={t.density2} active={activitiesPerDay === 2} onClick={() => setActivitiesPerDay(2)} />
          <ChipToggle label={t.density3} active={activitiesPerDay === 3} onClick={() => setActivitiesPerDay(3)} />
          <ChipToggle label={t.densityFlex} active={activitiesPerDay === "flexible"} onClick={() => setActivitiesPerDay("flexible")} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel>{t.morningLabel}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              <ChipToggle label={t.morningEarly} active={morningStart === "early"} onClick={() => setMorningStart("early")} />
              <ChipToggle label={t.morningLeisurely} active={morningStart === "leisurely"} onClick={() => setMorningStart("leisurely")} />
              <ChipToggle label={t.morningLate} active={morningStart === "late"} onClick={() => setMorningStart("late")} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>{t.walkingLabel}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              <ChipToggle label={t.walkingLow} active={walkingTolerance === "low"} onClick={() => setWalkingTolerance("low")} />
              <ChipToggle label={t.walkingMedium} active={walkingTolerance === "medium"} onClick={() => setWalkingTolerance("medium")} />
              <ChipToggle label={t.walkingHigh} active={walkingTolerance === "high"} onClick={() => setWalkingTolerance("high")} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={downtimeRequired}
              onCheckedChange={setDowntimeRequired}
            />
            <span className="text-sm text-text-primary">{t.downtimeLabel}</span>
          </div>
        </div>
      </div>

      <hr className="border-border-subtle" />

      {/* Section 4 — Optional nuance */}
      <div className="flex flex-col gap-3 byc-reveal byc-reveal--delay-3">
        <SectionHeading>{t.nuanceHeading}</SectionHeading>
        <Textarea
          placeholder={t.nuancePlaceholder}
          value={nuance}
          onChange={(e) => setNuance(e.target.value)}
        />
      </div>

      <StepNav
        backHref={backHref}
        continueLabel={continueLabel}
        continueDisabled={!isValid}
        onContinue={handleContinue}
      />
    </div>
  )
}
