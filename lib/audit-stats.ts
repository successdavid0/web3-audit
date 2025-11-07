"use client"

type AuditStats = {
  total: number
  pending: number
  inProgress: number
  completed: number
}

const STORAGE_KEY = "talatech_audit_stats"

export const getAuditStats = (): AuditStats => {
  if (typeof window === "undefined") {
    return { total: 0, pending: 0, inProgress: 0, completed: 0 }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  // Initialize with default stats
  const defaultStats = { total: 0, pending: 0, inProgress: 0, completed: 0 }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStats))
  return defaultStats
}

export const addAuditRequest = () => {
  const stats = getAuditStats()
  stats.total += 1
  stats.pending += 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent("auditStatsUpdated", { detail: stats }))
}

export const updateAuditStatus = (from: keyof Omit<AuditStats, "total">, to: keyof Omit<AuditStats, "total">) => {
  const stats = getAuditStats()
  stats[from] -= 1
  stats[to] += 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent("auditStatsUpdated", { detail: stats }))
}
