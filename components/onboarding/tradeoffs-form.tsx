"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTripDraft } from "@/lib/contexts/trip-draft-context"
import { Slider } from "@/components/ui/slider"
import StepNav from "@/components/onboarding/step-nav"
import type { Tradeoffs } from "@/lib/schema"

type TradeoffRow = {
  key: keyof Tradeoffs
  label: string
  left: string
  right: string
}

type Props = {
  rows: TradeoffRow[]
  adjustLater: string
  continueLabel: string
  backHref: string
  locale: string
}

const DEFAULT_TRADEOFFS: Tradeoffs = {
  paceVsCoverage: 0,
  iconicVsHidden: 0,
  walkVsEfficient: 0,
  saveVsEase: 0,
  planVsFlexible: 0,
  centralVsBetterStay: 0,
  plannedFoodVsSpontaneous: 0,
}

export default function TradeoffsForm({
  rows,
  adjustLater,
  continueLabel,
  backHref,
  locale,
}: Props) {
  const { draft, setDraft } = useTripDraft()
  const router = useRouter()

  const savedTradeoffs = draft.travellerDefaults?.tradeoffs

  const [values, setValues] = useState<Tradeoffs>(
    savedTradeoffs ?? DEFAULT_TRADEOFFS
  )

  // Validation: at least 3 sliders moved off 0
  const movedCount = Object.values(values).filter((v) => v !== 0).length
  const isValid = movedCount >= 3

  function handleChange(key: keyof Tradeoffs, raw: number[]) {
    const v = raw[0] as Tradeoffs[typeof key]
    const next = { ...values, [key]: v }
    setValues(next)
    setDraft({
      travellerDefaults: {
        ...draft.travellerDefaults,
        tradeoffs: next,
      },
    })
  }

  function handleContinue() {
    router.push(`/${locale}/onboarding/review`)
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-8 byc-reveal">
        {rows.map(({ key, label, left, right }) => {
          const value = values[key]
          const isActive = value !== 0

          return (
            <div key={key} className="flex flex-col gap-3">
              <p className="text-sm font-bold uppercase tracking-wide text-text-header">
                {label}
              </p>
              <div className="flex justify-between text-base text-text-secondary mb-1">
                <span>{left}</span>
                <span>{right}</span>
              </div>
              <Slider
                min={-2}
                max={2}
                step={1}
                value={[value]}
                onValueChange={(v) => handleChange(key, Array.isArray(v) ? v : [v])}
                className={isActive ? "opacity-100" : "opacity-60"}
              />
            </div>
          )
        })}
      </div>

      <p className="text-sm text-text-muted">{adjustLater}</p>

      <StepNav
        backHref={backHref}
        continueLabel={continueLabel}
        continueDisabled={!isValid}
        onContinue={handleContinue}
      />
    </div>
  )
}
