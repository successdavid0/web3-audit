import { cn } from "@/lib/utils"

type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"

interface SeverityBadgeProps {
  level: SeverityLevel
  className?: string
}

const severityConfig = {
  CRITICAL: {
    label: "Critical",
    className: "bg-severity-critical text-white",
  },
  HIGH: {
    label: "High",
    className: "bg-severity-high text-white",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-severity-medium text-white",
  },
  LOW: {
    label: "Low",
    className: "bg-severity-low text-white",
  },
  INFO: {
    label: "Info",
    className: "bg-severity-info text-white",
  },
}

export function SeverityBadge({ level, className }: SeverityBadgeProps) {
  const config = severityConfig[level]

  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", config.className, className)}
      aria-label={`Severity: ${config.label}`}
    >
      {config.label}
    </span>
  )
}
