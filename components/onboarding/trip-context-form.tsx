"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTripDraft } from "@/lib/contexts/trip-draft-context"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import StepNav from "@/components/onboarding/step-nav"
import type { TripContext } from "@/lib/schema"
import type { Dictionary } from "@/lib/i18n/locales/fr"

type T = Dictionary["onboarding"]["tripContext"]

function formatBudget(n: number, locale: string): string {
  return locale === "fr" ? `${n} $ CAD / jour` : `$${n} CAD / day`
}

function formatDays(n: number, locale: string): string {
  return locale === "fr"
    ? `${n} jour${n > 1 ? "s" : ""}`
    : `${n} day${n > 1 ? "s" : ""}`
}

type BudgetCat = "food" | "stay" | "experiences" | "transport"
type Reason = TripContext["reason"]
type Season = "spring" | "summer" | "autumn" | "winter"

type LocalDates =
  | { mode: "exact"; start: string; end: string }
  | { mode: "flex"; season: Season; lengthDays: number }

function toggleChip<T extends string>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
}

function ChipToggle({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
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

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 byc-reveal">{children}</div>
}

const REASONS: Reason[] = [
  "leisure",
  "anniversary",
  "family_visit",
  "work_plus",
  "first_time",
  "return",
  "celebration",
]

const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"]
const BUDGET_CATS: BudgetCat[] = ["food", "stay", "experiences", "transport"]


type Props = {
  t: T
  continueLabel: string
  backHref?: string
  locale: string
}

export default function TripContextForm({ t, continueLabel, backHref, locale }: Props) {
  const { draft, setDraft } = useTripDraft()
  const router = useRouter()

  const saved = draft.tripContext
  const [tripName, setTripName] = useState(draft.tripName ?? "")

  // Travellers state
  const [adults, setAdults] = useState(saved?.travellers?.adults ?? 1)
  const [kids, setKids] = useState<number[]>(saved?.travellers?.kids ?? [])
  const [pets, setPets] = useState(saved?.travellers?.pets ?? 0)

  // Destination
  const [destKnown, setDestKnown] = useState(saved?.destinationKnown ?? true)
  const [destination, setDestination] = useState(saved?.destination ?? "")
  const [region, setRegion] = useState(saved?.preferenceRegion ?? "")

  // Dates
  const [dates, setDates] = useState<LocalDates>(
    saved?.dates && "start" in saved.dates
      ? { mode: "exact", start: saved.dates.start, end: saved.dates.end }
      : saved?.dates && "season" in saved.dates
      ? { mode: "flex", season: saved.dates.season as Season, lengthDays: saved.dates.lengthDays }
      : { mode: "exact", start: "", end: "" }
  )

  // Budget
  const [dailyMax, setDailyMax] = useState(saved?.budget?.dailyMaxCAD ?? 200)
  const [flexibility, setFlexibility] = useState<"strict" | "soft">(saved?.budget?.flexibility ?? "soft")
  const [saveOn, setSaveOn] = useState<BudgetCat[]>((saved?.budget?.saveOn ?? []) as BudgetCat[])
  const [splurgeOn, setSplurgeOn] = useState<BudgetCat[]>((saved?.budget?.splurgeOn ?? []) as BudgetCat[])

  // Reason
  const [reason, setReason] = useState<Reason | null>(saved?.reason ?? null)

  // Optional extras
  const [alreadyBooked, setAlreadyBooked] = useState(saved?.alreadyBooked?.join("\n") ?? "")
  const [mustSee, setMustSee] = useState(saved?.mustSee?.join("\n") ?? "")

  const draftSaved = useCallback(() => {
    const tripContext: Partial<TripContext> = {
      travellers: { adults, kids: kids.length ? kids : undefined, pets: pets || undefined },
      destinationKnown: destKnown,
      destination: destKnown ? destination : undefined,
      preferenceRegion: !destKnown ? region : undefined,
      dates: dates.mode === "exact"
        ? { start: dates.start, end: dates.end }
        : { season: dates.season, lengthDays: dates.lengthDays },
      budget: {
        dailyMaxCAD: dailyMax,
        flexibility,
        saveOn: saveOn.length ? saveOn : undefined,
        splurgeOn: splurgeOn.length ? splurgeOn : undefined,
      },
      reason: reason ?? "leisure",
      alreadyBooked: alreadyBooked ? alreadyBooked.split("\n").filter(Boolean) : undefined,
      mustSee: mustSee ? mustSee.split("\n").filter(Boolean) : undefined,
    }
    setDraft({
      tripName: tripName.trim() || undefined,
      tripContext,
      currentStep: "trip-context",
    })
  }, [adults, kids, pets, destKnown, destination, region, dates, dailyMax, flexibility, saveOn, splurgeOn, reason, alreadyBooked, mustSee, tripName, setDraft])

  useEffect(() => { draftSaved() }, [draftSaved])

  // Validation
  const datesValid = dates.mode === "exact"
    ? Boolean(dates.start && dates.end && dates.start <= dates.end)
    : Boolean(dates.season && dates.lengthDays >= 1)
  const destValid = destKnown ? destination.trim().length > 0 : region.trim().length > 0
  const isValid = tripName.trim().length > 0 && datesValid && destValid

  function handleContinue() {
    draftSaved()
    setDraft({ currentStep: "review" })
    router.push(`/${locale}/onboarding/review`)
  }

  function addKid() { setKids((k) => [...k, 10]) }
  function removeKid(i: number) { setKids((k) => k.filter((_, j) => j !== i)) }
  function updateKidAge(i: number, age: number) { setKids((k) => k.map((v, j) => j === i ? age : v)) }

  return (
    <div className="flex flex-col gap-12">

      <FieldGroup>
        <div className="flex flex-col gap-3">
          <FieldLabel>{t.nameLabel}</FieldLabel>
          <Input
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="h-auto pb-3 text-[clamp(36px,7vw,72px)] font-bold leading-[0.95] tracking-[-0.04em] text-text-header placeholder:text-text-muted"
          />
          <p className="max-w-xl text-xl leading-[1.35] text-text-secondary">
            {t.nameHelp}
          </p>
        </div>
      </FieldGroup>

      <hr className="border-border-subtle" />

      {/* Travellers */}
      <FieldGroup>
        <FieldLabel>{t.travellersLabel}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: adults }).map((_, i) => (
            <span key={`adult-${i}`} className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-accent-primary bg-accent-primary/10 px-5 text-base font-medium text-accent-primary">
              {i === 0 ? "Adulte" : "Partenaire"}
              {adults > 1 && (
                <button
                  type="button"
                  onClick={() => setAdults((n) => Math.max(1, n - 1))}
                  className="leading-none opacity-60 hover:opacity-100 transition-opacity"
                  aria-label={t.removeLabel}
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {kids.map((age, i) => (
            <span key={`kid-${i}`} className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-accent-primary bg-accent-primary/10 px-5 text-base font-medium text-accent-primary">
              {t.childAge} {age}
              <button
                type="button"
                onClick={() => removeKid(i)}
                className="leading-none opacity-60 hover:opacity-100 transition-opacity"
                aria-label={t.removeLabel}
              >
                ×
              </button>
            </span>
          ))}
          {pets > 0 && (
            <span className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-accent-primary bg-accent-primary/10 px-5 text-base font-medium text-accent-primary">
              Animal
              <button
                type="button"
                onClick={() => setPets(0)}
                className="leading-none opacity-60 hover:opacity-100 transition-opacity"
                aria-label={t.removeLabel}
              >
                ×
              </button>
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAdults((n) => n + 1)}
            className="inline-flex h-11 items-center rounded-[16px] border border-[var(--byco-grey-500)] px-5 text-base font-medium text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
          >
            {t.addAdult}
          </button>
          <button
            type="button"
            onClick={addKid}
            className="inline-flex h-11 items-center rounded-[16px] border border-[var(--byco-grey-500)] px-5 text-base font-medium text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
          >
            {t.addChild}
          </button>
          {pets === 0 && (
            <button
              type="button"
              onClick={() => setPets(1)}
              className="inline-flex h-11 items-center rounded-[16px] border border-[var(--byco-grey-500)] px-5 text-base font-medium text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              {t.addPet}
            </button>
          )}
        </div>
        {kids.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-1">
            {kids.map((age, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-xs text-text-secondary">{t.childAge} {i + 1} :</span>
                <Input
                  type="number"
                  min={0}
                  max={17}
                  value={age}
                  onChange={(e) => updateKidAge(i, Number(e.target.value))}
                  className="w-16 h-7 text-xs px-2"
                />
              </div>
            ))}
          </div>
        )}
      </FieldGroup>

      <hr className="border-border-subtle" />

      {/* Destination */}
      <FieldGroup>
        <FieldLabel>{t.destinationLabel}</FieldLabel>
        <div className="flex gap-2">
          <ChipToggle label={t.destinationKnown} active={destKnown} onClick={() => setDestKnown(true)} />
          <ChipToggle label={t.destinationSuggest} active={!destKnown} onClick={() => setDestKnown(false)} />
        </div>
        {destKnown ? (
          <Input
            placeholder="Ex. : Lisbonne"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        ) : (
          <Input
            placeholder="Ex. : Europe du Sud, Asie du Sud-Est…"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        )}
      </FieldGroup>

      <hr className="border-border-subtle" />

      {/* Dates */}
      <FieldGroup>
        <FieldLabel>{t.datesLabel}</FieldLabel>
        <div className="flex gap-2">
          <ChipToggle
            label={t.datesToggleExact}
            active={dates.mode === "exact"}
            onClick={() => setDates({ mode: "exact", start: "", end: "" })}
          />
          <ChipToggle
            label={t.datesToggleFlex}
            active={dates.mode === "flex"}
            onClick={() => setDates({ mode: "flex", season: "summer", lengthDays: 7 })}
          />
        </div>
        {dates.mode === "exact" ? (
          <div className="flex gap-3">
            <Input
              type="date"
              value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
              className="flex-1"
            />
            <Input
              type="date"
              value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
              className="flex-1"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <ChipToggle
                  key={s}
                  label={t.seasons[s]}
                  active={dates.season === s}
                  onClick={() => setDates({ ...dates, season: s })}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={30}
                value={dates.lengthDays}
                onChange={(e) => setDates({ ...dates, lengthDays: Number(e.target.value) })}
                className="w-20"
              />
              <span className="text-sm text-text-secondary">
                {formatDays(dates.lengthDays, locale)}
              </span>
            </div>
          </div>
        )}
      </FieldGroup>

      <hr className="border-border-subtle" />

      {/* Budget */}
      <FieldGroup>
        <FieldLabel>{t.budgetLabel}</FieldLabel>
        <div className="flex justify-between text-xs text-text-secondary">
          <span>50 $ CAD</span>
          <span className="font-medium text-text-primary">{formatBudget(dailyMax, locale)}</span>
          <span>1 000 $ CAD</span>
        </div>
        <Slider
          min={50}
          max={1000}
          step={50}
          value={[dailyMax]}
          onValueChange={(v) => setDailyMax(Array.isArray(v) ? v[0] : v)}
        />
        <div className="flex gap-2 mt-1">
          <ChipToggle
            label={t.budgetStrict}
            active={flexibility === "strict"}
            onClick={() => setFlexibility("strict")}
          />
          <ChipToggle
            label={t.budgetFlex}
            active={flexibility === "soft"}
            onClick={() => setFlexibility("soft")}
          />
        </div>
        <div className="flex flex-col gap-6 pt-2">
          <div className="flex flex-col gap-3">
            <FieldLabel>{t.budgetSaveOn}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {BUDGET_CATS.map((c) => (
                <ChipToggle
                  key={c}
                  label={t.budgetCategories[c]}
                  active={saveOn.includes(c)}
                  onClick={() => setSaveOn((arr) => toggleChip(arr, c))}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <FieldLabel>{t.budgetSplurgeOn}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {BUDGET_CATS.map((c) => (
                <ChipToggle
                  key={c}
                  label={t.budgetCategories[c]}
                  active={splurgeOn.includes(c)}
                  onClick={() => setSplurgeOn((arr) => toggleChip(arr, c))}
                />
              ))}
            </div>
          </div>
        </div>
      </FieldGroup>

      <hr className="border-border-subtle" />

      {/* Reason */}
      <FieldGroup>
        <FieldLabel>{t.reasonLabel}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <ChipToggle
              key={r}
              label={t.reasons[r]}
              active={reason === r}
              onClick={() => setReason(r)}
            />
          ))}
        </div>
      </FieldGroup>

      <hr className="border-border-subtle" />

      {/* Optional extras */}
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <FieldLabel>{t.alreadyBooked}</FieldLabel>
          <Textarea
            placeholder={t.bookedPlaceholder}
            value={alreadyBooked}
            onChange={(e) => setAlreadyBooked(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel>{t.mustSee}</FieldLabel>
          <Textarea
            placeholder={t.mustSeePlaceholder}
            value={mustSee}
            onChange={(e) => setMustSee(e.target.value)}
          />
        </FieldGroup>
      </div>

      <StepNav
        continueLabel={continueLabel}
        continueDisabled={!isValid}
        onContinue={handleContinue}
        backHref={backHref}
      />
    </div>
  )
}
