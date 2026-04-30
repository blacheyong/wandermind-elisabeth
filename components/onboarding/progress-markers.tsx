type Step = {
  label: string
  state: "done" | "current" | "upcoming"
}

export default function ProgressMarkers({ steps }: { steps: Step[] }) {
  return (
    <nav aria-label="Progression" className="flex items-start gap-6 w-full">
      {steps.map(({ label, state }) => (
        <div key={label} className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div
            className={`h-0.5 w-full transition-colors duration-300 ${
              state === "current" ? "bg-accent-primary" :
              state === "done"    ? "bg-accent-primary/40" :
              "bg-border"
            }`}
          />
          <p
            className={`text-sm font-medium truncate transition-colors duration-300 ${
              state === "current" ? "text-text-header" :
              state === "done"    ? "text-text-secondary" :
              "text-text-muted"
            }`}
          >
            {label.includes(" — ") ? label.split(" — ")[1] : label}
          </p>
        </div>
      ))}
    </nav>
  )
}
