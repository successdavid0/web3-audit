import { cn } from "@/lib/utils"

interface ChainBadgeProps {
  chain: string
  className?: string
}

const chainColors: Record<string, string> = {
  ethereum: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  arbitrum: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  base: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  optimism: "bg-red-500/10 text-red-500 border-red-500/20",
  polygon: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

export function ChainBadge({ chain, className }: ChainBadgeProps) {
  const colorClass = chainColors[chain.toLowerCase()] || "bg-surface-2 text-text-2 border-border"

  return (
    <span
      className={cn("inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium", colorClass, className)}
    >
      {chain}
    </span>
  )
}
