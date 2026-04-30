"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  backHref?: string
  continueLabel: string
  continueDisabled?: boolean
  onContinue?: () => void
  continueHref?: string
}

export default function StepNav({
  backHref,
  continueLabel,
  continueDisabled = false,
  onContinue,
  continueHref,
}: Props) {
  return (
    <div className="flex items-center justify-between pt-8">
      {backHref ? (
        <Link
          href={backHref}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Retour
        </Link>
      ) : (
        <div />
      )}

      {continueHref && !onContinue ? (
        <Link
          href={continueDisabled ? "#" : continueHref}
          aria-disabled={continueDisabled}
          className={cn(
            buttonVariants({ variant: "default" }),
            continueDisabled && "pointer-events-none opacity-40"
          )}
        >
          {continueLabel}
        </Link>
      ) : (
        <Button disabled={continueDisabled} onClick={onContinue}>
          {continueLabel}
        </Button>
      )}
    </div>
  )
}
