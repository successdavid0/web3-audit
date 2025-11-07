"use client"

export type AuditRequest = {
  id: string
  projectName: string
  projectType: string
  blockchain: string
  priority: string
  status: "pending" | "in_progress" | "completed"
  submittedDate: string
  contactEmail: string
  description: string
}

type AuditStats = {
  total: number
  pending: number
  inProgress: number
  completed: number
}

const STORAGE_KEY = "talatech_audit_stats"
const AUDITS_KEY = "talatech_audits"

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

export const getAuditRequests = (): AuditRequest[] => {
  if (typeof window === "undefined") {
    return []
  }

  const stored = localStorage.getItem(AUDITS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  return []
}

export const addAuditRequest = (auditData: Omit<AuditRequest, "id" | "status" | "submittedDate">) => {
  const stats = getAuditStats()
  stats.total += 1
  stats.pending += 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))

  // Save the audit request
  const audits = getAuditRequests()
  const newAudit: AuditRequest = {
    ...auditData,
    id: `AUD-${Date.now()}`,
    status: "pending",
    submittedDate: new Date().toISOString(),
  }
  audits.push(newAudit)
  localStorage.setItem(AUDITS_KEY, JSON.stringify(audits))

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent("auditStatsUpdated", { detail: stats }))
  window.dispatchEvent(new CustomEvent("auditsUpdated", { detail: audits }))
}

export const updateAuditStatus = (from: keyof Omit<AuditStats, "total">, to: keyof Omit<AuditStats, "total">) => {
  const stats = getAuditStats()
  stats[from] -= 1
  stats[to] += 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent("auditStatsUpdated", { detail: stats }))
}
