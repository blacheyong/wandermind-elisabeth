"use client"

import { useState } from "react"
import { useTripDraft } from "@/lib/contexts/trip-draft-context"

function Pinwheel() {
  // 8 quarter-circle sectors at 45° intervals, alternating deep/primary blue
  // viewBox 200×200, center (100,100), radius 76
  const r = 76
  const cx = 100
  const cy = 100
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const pt = (deg: number) =>
    `${cx + r * Math.cos(toRad(deg))},${cy + r * Math.sin(toRad(deg))}`

  const petals = Array.from({ length: 8 }, (_, i) => {
    const a1 = i * 45
    const a2 = a1 + 90
    return `M ${cx},${cy} L ${pt(a1)} A ${r},${r} 0 0,1 ${pt(a2)} Z`
  })

  const deepBlue    = "#050D85"
  const primaryBlue = "#2D39F7"

  return (
    <svg
      viewBox="0 0 200 200"
      width="140"
      height="140"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <g className="pinwheel-spin">
        {petals.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={i % 2 === 0 ? primaryBlue : deepBlue}
            opacity="0.82"
          />
        ))}
      </g>
    </svg>
  )
}

export default function TripNameHeader({ locale }: { locale: string }) {
  const { draft, setDraft } = useTripDraft()
  const defaultName = locale === "fr" ? "Voyage de cet été" : "Summer trip"
  const [tripName, setTripName] = useState(draft.tripName ?? defaultName)

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 min-w-0 flex-1 group">
        <input
          type="text"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          onBlur={() => setDraft({ tripName })}
          className="min-w-0 flex-1 bg-transparent text-5xl font-bold tracking-tight text-text-header outline-none border-b-2 border-transparent focus:border-accent-primary pb-1 transition-colors placeholder:text-text-muted"
          placeholder={defaultName}
          aria-label="Nom du voyage"
        />
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--byco-grey-500)] flex items-center justify-center opacity-40 group-focus-within:opacity-100 group-focus-within:border-accent-primary group-focus-within:text-accent-primary transition-all">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 1.5 L11.5 3.5 L4.5 10.5 L2 11 L2.5 8.5 Z" />
            <path d="M8 3 L10 5" />
          </svg>
        </div>
      </div>
      <Pinwheel />
    </div>
  )
}
