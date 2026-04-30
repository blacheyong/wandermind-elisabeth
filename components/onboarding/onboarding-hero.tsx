"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTripDraft } from "@/lib/contexts/trip-draft-context"

const STEP_SLUGS = ["review", "constraints", "tradeoffs", "trip-context"] as const

function getActiveIndex(pathname: string): number {
  for (let i = STEP_SLUGS.length - 1; i >= 0; i--) {
    if (pathname.includes(STEP_SLUGS[i])) return i
  }
  return 0
}

function AbstractShape() {
  // Three interlocked meridian-ellipses — like a globe's skeleton, purely geometric
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" aria-hidden="true" style={{ flexShrink: 0 }}>
      {/* Outer full circle */}
      <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />

      {/* Tilted ellipse — 60° rotation */}
      <ellipse cx="80" cy="80" rx="68" ry="28"
        fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
        transform="rotate(60 80 80)" />

      {/* Tilted ellipse — -60° rotation */}
      <ellipse cx="80" cy="80" rx="68" ry="28"
        fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
        transform="rotate(-60 80 80)" />

      {/* Equatorial ellipse (flat horizontal) */}
      <ellipse cx="80" cy="80" rx="68" ry="18"
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />

      {/* Accent arc — top-right quadrant of outer circle */}
      <path d="M 80,12 A 68,68 0 0,1 148,80"
        fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Inner concentric circle */}
      <circle cx="80" cy="80" r="26"
        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />

      {/* Center dot */}
      <circle cx="80" cy="80" r="4" fill="rgba(255,255,255,0.9)" />

      {/* Arc start / end accent dots */}
      <circle cx="80"  cy="12"  r="2.5" fill="rgba(255,255,255,0.9)" />
      <circle cx="148" cy="80"  r="2.5" fill="rgba(255,255,255,0.9)" />
    </svg>
  )
}

type Props = {
  stepLabels: [string, string, string, string]
  locale: string
}

export default function OnboardingHero({ stepLabels, locale }: Props) {
  const pathname = usePathname()
  const activeIndex = getActiveIndex(pathname)

  const { draft, setDraft } = useTripDraft()
  const defaultName = locale === "fr" ? "Voyage de cet été" : "Summer trip"
  const [tripName, setTripName] = useState(draft.tripName ?? defaultName)

  return (
    <div className="byc-reveal" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {/* Progress bar */}
      <nav aria-label="Progression" style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}>
        {stepLabels.map((label, i) => {
          const state = i < activeIndex ? "done" : i === activeIndex ? "current" : "upcoming"
          const barColor =
            state === "current" ? "#ffffff" :
            state === "done"    ? "rgba(255,255,255,0.45)" :
            "rgba(255,255,255,0.15)"
          const textColor =
            state === "current" ? "#ffffff" :
            state === "done"    ? "rgba(255,255,255,0.55)" :
            "rgba(255,255,255,0.3)"
          const displayLabel = label.includes(" — ") ? label.split(" — ")[1] : label
          return (
            <div key={i} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ height: "2px", background: barColor, borderRadius: "1px", transition: "background 0.3s" }} />
              <p style={{ fontSize: "13px", fontWeight: 500, color: textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.3s" }}>
                {displayLabel}
              </p>
            </div>
          )
        })}
      </nav>

      {/* Step label */}
      <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
        {stepLabels[activeIndex]}
      </p>

      {/* Title + illustration */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }} className="group">
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            onBlur={() => setDraft({ tripName })}
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.25)",
              outline: "none",
              fontFamily: "var(--font)",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              paddingBottom: "4px",
              transition: "border-color 0.2s",
            }}
            onFocus={e => {
              e.currentTarget.style.borderBottom = "2px solid rgba(255,255,255,0.9)"
            }}
            onBlurCapture={e => {
              e.currentTarget.style.borderBottom = "1px solid rgba(255,255,255,0.25)"
            }}
            placeholder={defaultName}
            aria-label="Nom du voyage"
          />
          <div style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.5)",
            transition: "border-color 0.2s, color 0.2s",
          }}
          className="group-focus-within:!border-white group-focus-within:!text-white"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 1.5 L11.5 3.5 L4.5 10.5 L2 11 L2.5 8.5 Z" />
              <path d="M8 3 L10 5" />
            </svg>
          </div>
        </div>
        <AbstractShape />
      </div>
    </div>
  )
}
