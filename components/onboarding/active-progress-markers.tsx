"use client"

import { usePathname } from "next/navigation"
import ProgressMarkers from "@/components/onboarding/progress-markers"

const STEP_SLUGS = ["constraints", "tradeoffs", "trip-context", "review"] as const
type StepSlug = (typeof STEP_SLUGS)[number]

function getActiveStep(pathname: string): StepSlug {
  for (const slug of [...STEP_SLUGS].reverse()) {
    if (pathname.includes(slug)) return slug
  }
  return "trip-context"
}

type Props = {
  labels: [string, string, string, string]
}

export default function ActiveProgressMarkers({ labels }: Props) {
  const pathname = usePathname()
  const activeSlug = getActiveStep(pathname)
  const activeIndex = STEP_SLUGS.indexOf(activeSlug)

  const steps = STEP_SLUGS.map((slug, i) => ({
    label: labels[i],
    state: (
      i < activeIndex ? "done" : i === activeIndex ? "current" : "upcoming"
    ) as "done" | "current" | "upcoming",
  }))

  return <ProgressMarkers steps={steps} />
}
