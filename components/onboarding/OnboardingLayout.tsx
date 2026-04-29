"use client";

/* ============================================================
   OnboardingLayout
   The inner shell for screens 01–04 of the traveller profile
   onboarding flow. Provides:
     • BYC-style "01 / 04" pagination indicator
     • Numbered step progress (4 circles)
     • Section title slot
     • Back / Continue navigation
   ============================================================ */

import { useRouter } from "next/navigation";

const STEPS = [
  { num: "01", label: "Contexte",    href: "/onboarding/trip-context" },
  { num: "02", label: "Arbitrages",  href: "/onboarding/tradeoffs" },
  { num: "03", label: "Contraintes", href: "/onboarding/constraints" },
  { num: "04", label: "Profil",      href: "/onboarding/review" },
];

interface Props {
  currentStep: 1 | 2 | 3 | 4;
  sectionTitle: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  currentStep,
  sectionTitle,
  onContinue,
  continueDisabled = false,
  continueLabel = "Continuer",
  children,
}: Props) {
  const router = useRouter();
  const step = STEPS[currentStep - 1];

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(STEPS[currentStep - 2].href);
    }
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else if (currentStep < 4) {
      router.push(STEPS[currentStep].href);
    }
  };

  return (
    <div
      style={{
        padding: "36px 44px 40px",
        maxWidth: "720px",
        margin: "0 auto",
        minHeight: "calc(100dvh - 52px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ---- Progress row ----------------------------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "36px",
        }}
      >
        {/* Step circles */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {STEPS.map((s, i) => {
            const idx = i + 1;
            const isDone   = idx < currentStep;
            const isActive = idx === currentStep;
            return (
              <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
                {/* Circle */}
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: `background var(--motion-std), border-color var(--motion-std), color var(--motion-std)`,
                    background: isActive
                      ? "var(--color-primary)"
                      : isDone
                      ? "rgba(45,57,247,0.22)"
                      : "transparent",
                    border: isActive || isDone
                      ? "none"
                      : "1px solid rgba(255,255,255,0.14)",
                    color: isActive
                      ? "var(--color-white)"
                      : isDone
                      ? "var(--color-primary)"
                      : "rgba(255,255,255,0.25)",
                  }}
                >
                  {isDone ? (
                    /* Checkmark SVG */
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    idx
                  )}
                </div>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: "32px",
                      height: "1px",
                      background: isDone
                        ? "rgba(45,57,247,0.3)"
                        : "rgba(255,255,255,0.1)",
                      transition: `background var(--motion-std)`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* BYC-style pagination "01 / 04" */}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.08em",
          }}
        >
          {step.num} / 04
        </span>
      </div>

      {/* ---- BYC numbered section header -------------------- */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          {step.num}
        </div>
        <h1
          style={{
            fontSize: "var(--text-title-size)",
            lineHeight: "var(--text-title-lh)",
            letterSpacing: "var(--text-title-ls)",
            fontWeight: "var(--text-title-weight)" as any,
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          {sectionTitle}
        </h1>
      </div>

      {/* ---- Form content slot ------------------------------ */}
      <div style={{ flex: 1 }}>{children}</div>

      {/* ---- Navigation footer ------------------------------ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: currentStep > 1 ? "space-between" : "flex-end",
          paddingTop: "20px",
          borderTop: "1px solid var(--color-surface-border)",
          marginTop: "12px",
        }}
      >
        {/* Back button (step 2+) */}
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "var(--radius-xs)",
              fontSize: "13.5px",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              fontFamily: "var(--font-family)",
              transition: `border-color var(--motion-fast), color var(--motion-fast)`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.28)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Précédent
          </button>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={continueDisabled}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "11px 24px",
            background: continueDisabled ? "rgba(45,57,247,0.35)" : "var(--color-primary)",
            border: "none",
            borderRadius: "var(--radius-xs)",
            fontSize: "13.5px",
            fontWeight: 600,
            color: continueDisabled ? "rgba(255,255,255,0.5)" : "var(--color-white)",
            cursor: continueDisabled ? "not-allowed" : "pointer",
            fontFamily: "var(--font-family)",
            transition: `background var(--motion-fast)`,
          }}
          onMouseEnter={(e) => {
            if (!continueDisabled)
              (e.currentTarget as HTMLElement).style.background = "var(--color-primary-hover)";
          }}
          onMouseLeave={(e) => {
            if (!continueDisabled)
              (e.currentTarget as HTMLElement).style.background = "var(--color-primary)";
          }}
        >
          {continueLabel}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
