import type React from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSearch, AlertTriangle, Wrench, FileText, Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <AppShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Dashboard</h1>
            <p className="text-text-2">Welcome back to your auditing workspace</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Audit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Audits" value="12" change="+2 this week" icon={<FileSearch className="h-5 w-5" />} />
          <StatCard
            title="Open Findings"
            value="47"
            change="23 critical"
            icon={<AlertTriangle className="h-5 w-5" />}
            variant="warning"
          />
          <StatCard title="Tool Runs" value="156" change="+34 today" icon={<Wrench className="h-5 w-5" />} />
          <StatCard title="Reports" value="8" change="3 pending sign-off" icon={<FileText className="h-5 w-5" />} />
        </div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Audits</CardTitle>
              <CardDescription>Your current audit projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AuditItem name="DeFi Protocol V2" repo="defi-protocol/contracts" findings={12} severity="high" />
                <AuditItem name="NFT Marketplace" repo="nft-market/core" findings={8} severity="medium" />
                <AuditItem name="Lending Platform" repo="lending-proto/contracts" findings={15} severity="critical" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across all audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  action="New finding created"
                  details="Reentrancy in withdraw function"
                  time="2 hours ago"
                />
                <ActivityItem
                  action="Tool run completed"
                  details="Slither analysis on DeFi Protocol V2"
                  time="4 hours ago"
                />
                <ActivityItem action="Report signed" details="NFT Marketplace audit report" time="1 day ago" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function StatCard({
  title,
  value,
  change,
  icon,
  variant = "default",
}: {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  variant?: "default" | "warning"
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-text-2">{title}</p>
            <p className="text-3xl font-bold text-text">{value}</p>
            <p className={`text-xs ${variant === "warning" ? "text-warning" : "text-success"}`}>{change}</p>
          </div>
          <div
            className={`rounded-lg p-3 ${variant === "warning" ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AuditItem({
  name,
  repo,
  findings,
  severity,
}: {
  name: string
  repo: string
  findings: number
  severity: "critical" | "high" | "medium" | "low"
}) {
  const severityColors = {
    critical: "bg-severity-critical",
    high: "bg-severity-high",
    medium: "bg-severity-medium",
    low: "bg-severity-low",
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="space-y-1">
        <p className="font-medium text-text">{name}</p>
        <p className="text-sm text-text-2 font-mono">{repo}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${severityColors[severity]}`} />
        <span className="text-sm text-text-2">{findings} findings</span>
      </div>
    </div>
  )
}

function ActivityItem({
  action,
  details,
  time,
}: {
  action: string
  details: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-text">{action}</p>
        <p className="text-sm text-text-2">{details}</p>
        <p className="text-xs text-muted">{time}</p>
      </div>
    </div>
  )
}
