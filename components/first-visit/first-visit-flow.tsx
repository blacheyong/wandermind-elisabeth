"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTripDraft } from "@/lib/contexts/trip-draft-context";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { Dictionary } from "@/lib/i18n/locales/fr";
import type { PaceCeiling, Tradeoffs } from "@/lib/schema";

type LangCopy = Dictionary["lang"];
type Pace = "quiet" | "balanced" | "full";
type Discovery = "known" | "mixed" | "hidden";
type Structure = "planned" | "fluid" | "open";

type Props = {
  locale: Locale;
  lang: LangCopy;
};

const copy = {
  fr: {
    nav: "WanderMind",
    account: "J'ai déjà un compte",
    steps: ["Pourquoi", "Préférences", "Limites", "Profil"],
    heroKicker: "Itinéraires de voyage personnalisés",
    heroTitle: "Un voyage devrait commencer par votre façon de voyager.",
    heroText:
      "WanderMind construit des itinéraires qui tiennent compte de votre rythme, de vos arbitrages et de ce que vous voulez éviter. Plus votre profil est juste, plus les suggestions deviennent utiles.",
    heroPrimary: "Configurer mon profil",
    heroSecondary: "Voir la logique",
    continue: "Continuer",
    back: "Retour",
    whyTitle: "Pourquoi le profil compte",
    whyText:
      "Deux personnes peuvent demander Lisbonne en cinq jours et avoir besoin de voyages très différents. Avant de proposer des lieux, WanderMind apprend comment choisir pour vous.",
    whyPoints: [
      "Votre rythme idéal",
      "Vos compromis quand tout ne rentre pas",
      "Les contraintes qui ne doivent jamais être ignorées",
    ],
    preferenceTitle: "Quand le voyage prend forme, qu'est-ce qui gagne ?",
    paceLabel: "Rythme",
    discoveryLabel: "Découverte",
    structureLabel: "Structure",
    pace: [
      ["quiet", "Peu, mais mieux", "Des journées lentes, choisies, respirables."],
      ["balanced", "Équilibre", "Un cadre clair avec de la place pour changer."],
      ["full", "Dense", "Voir davantage sans perdre le fil."],
    ],
    discovery: [
      ["known", "Iconique", "Les incontournables, bien ordonnés."],
      ["mixed", "Mélange", "Un classique, puis un détour plus personnel."],
      ["hidden", "Caché", "Moins évident, plus local, plus surprenant."],
    ],
    structure: [
      ["planned", "Planifié", "Réservations et journées structurées."],
      ["fluid", "Souple", "Une direction, pas un horaire rigide."],
      ["open", "Ouvert", "Des temps libres qui comptent vraiment."],
    ],
    limitsTitle: "Ce que WanderMind doit respecter",
    limitsText:
      "Ces réponses deviennent des garde-fous. Elles empêchent les suggestions jolies mais inutiles.",
    limits: [
      "Foules",
      "Longues marches",
      "Départs matinaux",
      "Musées",
      "Restaurants de chaîne",
      "Trop de transport",
      "Sorties tardives",
      "Visites guidées",
    ],
    loginTitle: "Créez votre profil avant le premier itinéraire.",
    loginText:
      "Votre profil de voyage sera sauvegardé avant les détails du prochain voyage. Ensuite, WanderMind pourra adapter chaque suggestion.",
    emailLabel: "Courriel",
    emailPlaceholder: "vous@exemple.com",
    loginPrimary: "Créer mon premier voyage",
    skip: "Continuer au voyage",
    summary: "Profil initial",
  },
  en: {
    nav: "WanderMind",
    account: "I already have an account",
    steps: ["Why", "Preferences", "Limits", "Profile"],
    heroKicker: "Personalized travel itineraries",
    heroTitle: "A trip should begin with the way you travel.",
    heroText:
      "WanderMind builds itineraries around your pace, tradeoffs, and what should be avoided. The more accurate your profile is, the more useful the suggestions become.",
    heroPrimary: "Configure my profile",
    heroSecondary: "See the logic",
    continue: "Continue",
    back: "Back",
    whyTitle: "Why the profile matters",
    whyText:
      "Two people can ask for five days in Lisbon and need entirely different trips. Before suggesting places, WanderMind learns how to choose for you.",
    whyPoints: [
      "Your ideal pace",
      "Your tradeoffs when everything cannot fit",
      "The constraints that should never be ignored",
    ],
    preferenceTitle: "When the trip takes shape, what wins?",
    paceLabel: "Pace",
    discoveryLabel: "Discovery",
    structureLabel: "Structure",
    pace: [
      ["quiet", "Fewer, better", "Slow, chosen, breathable days."],
      ["balanced", "Balanced", "A clear frame with room to change."],
      ["full", "Full", "See more without losing the thread."],
    ],
    discovery: [
      ["known", "Iconic", "The essentials, ordered well."],
      ["mixed", "Mixed", "One classic, then a more personal turn."],
      ["hidden", "Hidden", "Less obvious, more local, more surprising."],
    ],
    structure: [
      ["planned", "Planned", "Reservations and structured days."],
      ["fluid", "Flexible", "A direction, not a rigid schedule."],
      ["open", "Open", "Free time that actually matters."],
    ],
    limitsTitle: "What WanderMind should respect",
    limitsText:
      "These answers become guardrails. They prevent suggestions that look good but are useless to you.",
    limits: [
      "Crowds",
      "Long walks",
      "Early starts",
      "Museums",
      "Chain restaurants",
      "Too much transit",
      "Late nights",
      "Guided tours",
    ],
    loginTitle: "Create your profile before the first itinerary.",
    loginText:
      "Your traveller profile will be saved before the details of the next trip. Then WanderMind can adapt every suggestion.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    loginPrimary: "Create my first trip",
    skip: "Continue to the trip",
    summary: "Initial profile",
  },
} as const;

function tradeoffValue(value: -2 | -1 | 0 | 1 | 2) {
  return value;
}

function buildTradeoffs(pace: Pace, discovery: Discovery, structure: Structure): Tradeoffs {
  return {
    paceVsCoverage: pace === "quiet" ? tradeoffValue(-2) : pace === "full" ? tradeoffValue(2) : tradeoffValue(0),
    iconicVsHidden: discovery === "known" ? tradeoffValue(-2) : discovery === "hidden" ? tradeoffValue(2) : tradeoffValue(0),
    walkVsEfficient: tradeoffValue(0),
    saveVsEase: tradeoffValue(0),
    planVsFlexible: structure === "planned" ? tradeoffValue(-2) : structure === "open" ? tradeoffValue(2) : tradeoffValue(0),
    centralVsBetterStay: tradeoffValue(0),
    plannedFoodVsSpontaneous: structure === "planned" ? tradeoffValue(-1) : structure === "open" ? tradeoffValue(1) : tradeoffValue(0),
  };
}

function buildPaceCeiling(pace: Pace, structure: Structure): PaceCeiling {
  return {
    activitiesPerDay: pace === "quiet" ? 1 : pace === "full" ? 3 : "flexible",
    walkingTolerance: pace === "quiet" ? "low" : "medium",
    downtimeRequired: pace !== "full" || structure === "open",
    morningStart: structure === "planned" ? "early" : "leisurely",
  };
}

function wordmark(isBlue: boolean) {
  return (
    <span className="leading-[0.86] tracking-[-0.04em]">
      <span className="block">Wander</span>
      <span className={`block ${isBlue ? "text-white" : "text-accent-primary"}`}>Mind</span>
    </span>
  );
}

export default function FirstVisitFlow({ locale, lang }: Props) {
  const router = useRouter();
  const { setDraft } = useTripDraft();
  const t = copy[locale];
  const [step, setStep] = useState(0);
  const [pace, setPace] = useState<Pace>("balanced");
  const [discovery, setDiscovery] = useState<Discovery>("mixed");
  const [structure, setStructure] = useState<Structure>("fluid");
  const [avoid, setAvoid] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  const isBlue = step === 1 || step === 4;
  const nextLocale = locale === "fr" ? "en" : "fr";

  const selectedSummary = useMemo(() => {
    const findLabel = <TValue extends string>(rows: readonly (readonly [TValue, string, string])[], value: TValue) =>
      rows.find(([key]) => key === value)?.[1] ?? value;

    return [
      findLabel(t.pace, pace),
      findLabel(t.discovery, discovery),
      findLabel(t.structure, structure),
    ];
  }, [discovery, pace, structure, t.discovery, t.pace, t.structure]);

  function persistAndContinue() {
    setDraft({
      travellerDefaults: {
        hardConstraints: {
          languageComfort: [locale === "fr" ? "français" : "english"],
          avoid,
        },
        paceCeiling: buildPaceCeiling(pace, structure),
        tradeoffs: buildTradeoffs(pace, discovery, structure),
        noveltyAppetite:
          discovery === "known" ? "popular_picks" : discovery === "hidden" ? "off_beaten_path" : "balanced",
        freeTextNuance: email ? `First visit email: ${email}` : undefined,
      },
      currentStep: "trip-context",
    });

    router.push(`/${locale}/onboarding/trip-context`);
  }

  function toggleAvoid(item: string) {
    setAvoid((current) =>
      current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item]
    );
  }

  return (
    <main
      className={`min-h-dvh overflow-hidden transition-colors duration-500 ${
        isBlue ? "bg-accent-primary text-white" : "bg-white text-text-primary"
      }`}
    >
      <header className="fixed left-0 right-0 top-0 z-30 flex items-start justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href={`/${locale}`}
          className={`text-[28px] font-bold no-underline transition-colors ${
            isBlue ? "text-white" : "text-text-primary"
          }`}
        >
          {wordmark(isBlue)}
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/${nextLocale}`}
            className={`flex h-11 items-center rounded-[16px] border px-4 text-sm font-semibold no-underline transition-colors ${
              isBlue
                ? "border-white/35 text-white hover:border-white"
                : "border-border text-text-primary hover:border-accent-primary"
            }`}
          >
            {lang.toggle}
          </Link>
          <button
            type="button"
            onClick={() => setStep(4)}
            className={`hidden h-11 rounded-[16px] border px-5 text-sm font-semibold transition-colors sm:block ${
              isBlue
                ? "border-white/35 text-white hover:border-white"
                : "border-border text-text-primary hover:border-accent-primary"
            }`}
          >
            {t.account}
          </button>
        </div>
      </header>

      <div
        className="flex min-h-dvh transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${step * 100}vw)` }}
      >
        <section className="flex min-h-dvh w-screen shrink-0 items-end px-5 pb-24 pt-28 sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div className="max-w-5xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
                {t.heroKicker}
              </p>
              <h1 className="max-w-6xl text-[clamp(56px,11vw,148px)] font-bold leading-[0.86] tracking-[-0.045em] text-text-header">
                {t.heroTitle}
              </h1>
            </div>
            <div className="flex max-w-md flex-col gap-8 pb-1">
              <p className="text-xl leading-[1.35] text-text-secondary sm:text-2xl">
                {t.heroText}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setStep(1)}>
                  {t.heroPrimary}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh w-screen shrink-0 items-end px-5 pb-24 pt-28 sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.48fr)] lg:items-end">
            <div className="max-w-5xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white/55">
                01 / {t.steps[0]}
              </p>
              <h2 className="text-[clamp(52px,9vw,120px)] font-bold leading-[0.88] tracking-[-0.045em] text-white">
                {t.whyTitle}
              </h2>
              <p className="mt-8 max-w-2xl text-xl leading-[1.35] text-white/75 sm:text-2xl">
                {t.whyText}
              </p>
            </div>
            <div className="flex flex-col gap-5 border-t border-white/30 pt-6">
              {t.whyPoints.map((point, index) => (
                <div key={point} className="grid grid-cols-[48px_1fr] gap-5 border-b border-white/20 pb-5">
                  <span className="text-sm font-semibold text-white/45">0{index + 1}</span>
                  <p className="text-2xl font-semibold leading-[1.05] text-white">{point}</p>
                </div>
              ))}
              <Button
                size="lg"
                variant="outline"
                className="mt-4 border-white/35 bg-transparent text-white hover:bg-white hover:text-accent-primary"
                onClick={() => setStep(2)}
              >
                {t.heroPrimary}
              </Button>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh w-screen shrink-0 items-end px-5 pb-24 pt-28 sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(320px,0.52fr)_minmax(0,1fr)] lg:items-end">
            <div className="lg:self-end">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
                02 / {t.steps[1]}
              </p>
              <h2 className="max-w-2xl text-[clamp(44px,7vw,92px)] font-bold leading-[0.9] tracking-[-0.045em] text-text-header">
                {t.preferenceTitle}
              </h2>
            </div>
            <div className="grid gap-6 lg:self-end">
              <ChoiceGroup label={t.paceLabel} rows={t.pace} value={pace} onChange={setPace} />
              <ChoiceGroup label={t.discoveryLabel} rows={t.discovery} value={discovery} onChange={setDiscovery} />
              <ChoiceGroup label={t.structureLabel} rows={t.structure} value={structure} onChange={setStructure} />
              <div className="flex justify-end pt-3">
                <Button size="lg" onClick={() => setStep(3)}>
                  {t.continue}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh w-screen shrink-0 items-end px-5 pb-24 pt-28 sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(360px,0.58fr)] lg:items-end">
            <div className="lg:self-end">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
                03 / {t.steps[2]}
              </p>
              <h2 className="max-w-3xl text-[clamp(48px,8vw,108px)] font-bold leading-[0.88] tracking-[-0.045em] text-text-header">
                {t.limitsTitle}
              </h2>
              <p className="mt-8 max-w-xl text-xl leading-[1.35] text-text-secondary sm:text-2xl">
                {t.limitsText}
              </p>
            </div>
            <div className="flex flex-col gap-8 lg:self-end">
              <div className="flex flex-wrap gap-3">
                {t.limits.map((item) => {
                  const selected = avoid.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAvoid(item)}
                      className={`h-12 rounded-[16px] border px-5 text-base font-semibold transition-colors ${
                        selected
                          ? "border-accent-primary bg-accent-primary text-white"
                          : "border-border bg-white text-text-primary hover:border-accent-primary"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <Button size="lg" onClick={() => setStep(4)}>
                  {t.heroPrimary}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh w-screen shrink-0 items-end bg-accent-primary px-5 pb-24 pt-28 text-white sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(340px,0.48fr)] lg:items-end">
            <div className="lg:self-end">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white/55">
                04 / {t.steps[3]}
              </p>
              <h2 className="max-w-5xl text-[clamp(50px,9vw,124px)] font-bold leading-[0.88] tracking-[-0.045em] text-white">
                {t.loginTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-8 lg:self-end">
              <p className="text-xl leading-[1.35] text-white/75 sm:text-2xl">
                {t.loginText}
              </p>
              <div className="border-y border-white/25 py-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/45">
                  {t.summary}
                </p>
                <p className="text-2xl font-semibold leading-tight text-white">
                  {selectedSummary.join(" / ")}
                </p>
                {avoid.length > 0 && (
                  <p className="mt-3 text-base text-white/65">{avoid.join(", ")}</p>
                )}
              </div>
              <form
                className="flex flex-col gap-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  persistAndContinue();
                }}
              >
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-white/55">
                    {t.emailLabel}
                  </span>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="border-white/45 text-xl text-white placeholder:text-white/45 focus-visible:border-white"
                  />
                </label>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-accent-primary hover:bg-white/90"
                >
                  {t.loginPrimary}
                </Button>
                <button
                  type="button"
                  onClick={persistAndContinue}
                  className="text-left text-base font-semibold text-white/70 transition-colors hover:text-white"
                >
                  {t.skip}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-5 left-5 right-5 z-30 flex items-center justify-between sm:left-8 sm:right-8 lg:left-10 lg:right-10">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => setStep(index)}
              aria-label={`Step ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                step === index
                  ? isBlue || index === 4 ? "w-10 bg-white" : "w-10 bg-accent-primary"
                  : isBlue || step === 4 ? "w-4 bg-white/35" : "w-4 bg-black/20"
              }`}
            />
          ))}
        </div>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            className={`text-sm font-semibold transition-colors ${
              isBlue || step === 4 ? "text-white/70 hover:text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.back}
          </button>
        )}
      </div>
    </main>
  );
}

function ChoiceGroup<TValue extends string>({
  label,
  rows,
  value,
  onChange,
}: {
  label: string;
  rows: readonly (readonly [TValue, string, string])[];
  value: TValue;
  onChange: (value: TValue) => void;
}) {
  return (
    <fieldset className="grid gap-3 border-t border-border pt-4">
      <legend className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
        {label}
      </legend>
      <div className="grid gap-3 md:grid-cols-3">
        {rows.map(([key, title, description]) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`min-h-[148px] rounded-[16px] border p-5 text-left transition-colors ${
                selected
                  ? "border-accent-primary bg-accent-primary text-white"
                  : "border-border bg-white text-text-primary hover:border-accent-primary"
              }`}
            >
              <span className="block text-2xl font-bold leading-none tracking-[-0.02em]">
                {title}
              </span>
              <span className={`mt-4 block text-base leading-snug ${selected ? "text-white/75" : "text-text-secondary"}`}>
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
