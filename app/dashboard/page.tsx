"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getAuditStats } from "@/lib/audit-stats"

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 })

  useEffect(() => {
    // Load initial stats
    setStats(getAuditStats())

    // Listen for stats updates
    const handleStatsUpdate = (event: CustomEvent) => {
      setStats(event.detail)
    }

    window.addEventListener("auditStatsUpdated" as any, handleStatsUpdate)

    return () => {
      window.removeEventListener("auditStatsUpdated" as any, handleStatsUpdate)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">TalaTech Audit</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/submit-audit">
              <Button>Submit Audit</Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Audit Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Real-time overview of all audit requests</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Requests</div>
            <div className="mt-2 text-3xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Pending Review</div>
            <div className="mt-2 text-3xl font-bold">{stats.pending}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">In Progress</div>
            <div className="mt-2 text-3xl font-bold">{stats.inProgress}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Completed</div>
            <div className="mt-2 text-3xl font-bold">{stats.completed}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
