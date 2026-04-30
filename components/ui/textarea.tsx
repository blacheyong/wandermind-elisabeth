import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-[var(--byco-grey-500)] bg-transparent px-0 pb-2 pt-1 text-base transition-all outline-none placeholder:text-muted-foreground focus-visible:border-b-2 focus-visible:border-ring resize-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
