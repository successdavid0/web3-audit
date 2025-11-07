import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeverityBadge } from "@/components/severity-badge"
import { ChainBadge } from "@/components/chain-badge"
import { Plus, Wrench, Settings, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { mockAuditDetails } from "@/lib/mock-data"

export default function AuditOverviewPage({ params }: { params: { id: string } }) {
  const audit = mockAuditDetails

  return (
    <AppShell breadcrumbs={[{ label: "Audits", href: "/app/audits" }, { label: audit.name }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-text">{audit.name}</h1>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">In Progress</span>
            </div>
            <p className="text-text-2">{audit.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded bg-surface-2 px-2 py-1 font-mono text-sm text-text-2">
                {audit.repo}@{audit.commit.slice(0, 7)}
              </code>
              {audit.chains.map((chain) => (
                <ChainBadge key={chain} chain={chain} />
              ))}
              {audit.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-text-2">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Wrench className="h-4 w-4" />
              Run Tool
            </Button>
            <Link href={`/app/audits/${params.id}/findings/new`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Finding
              </Button>
            </Link>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Risk Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
            <CardDescription>Current security posture and findings distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-severity-critical" />
                  <span className="text-sm text-text-2">Critical</span>
                </div>
                <p className="text-3xl font-bold text-text">{audit.findings.critical}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-severity-high" />
                  <span className="text-sm text-text-2">High</span>
                </div>
                <p className="text-3xl font-bold text-text">{audit.findings.high}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-severity-medium" />
                  <span className="text-sm text-text-2">Medium</span>
                </div>
                <p className="text-3xl font-bold text-text">{audit.findings.medium}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-severity-low" />
                  <span className="text-sm text-text-2">Low</span>
                </div>
                <p className="text-3xl font-bold text-text">{audit.findings.low}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-severity-info" />
                  <span className="text-sm text-text-2">Info</span>
                </div>
                <p className="text-3xl font-bold text-text">{audit.findings.info}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Scope Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Scope Summary</CardTitle>
              <CardDescription>Contracts and verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-2">Total Contracts</span>
                <span className="text-2xl font-bold text-text">{audit.scope.contracts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-2">Lines of Code</span>
                <span className="text-2xl font-bold text-text">{audit.scope.linesOfCode.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-2">Verified</span>
                <span className="text-2xl font-bold text-success">{audit.scope.verified}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-2">Proxies Detected</span>
                <span className="text-2xl font-bold text-warning">{audit.scope.proxies}</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Findings */}
          <Card>
            <CardHeader>
              <CardTitle>Top Findings</CardTitle>
              <CardDescription>Most critical security issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/app/audits/${params.id}/findings/1`}>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-2">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-severity-critical" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <SeverityBadge level="CRITICAL" />
                      <span className="text-sm font-medium text-text">Reentrancy in withdraw</span>
                    </div>
                    <p className="text-sm text-text-2">External call before state update allows reentrancy attack</p>
                  </div>
                </div>
              </Link>
              <Link href={`/app/audits/${params.id}/findings/2`}>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-2">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-severity-high" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <SeverityBadge level="HIGH" />
                      <span className="text-sm font-medium text-text">Missing access control</span>
                    </div>
                    <p className="text-sm text-text-2">Critical function lacks proper authorization checks</p>
                  </div>
                </div>
              </Link>
              <Link href={`/app/audits/${params.id}/findings/3`}>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-2">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-severity-high" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <SeverityBadge level="HIGH" />
                      <span className="text-sm font-medium text-text">Integer overflow risk</span>
                    </div>
                    <p className="text-sm text-text-2">Unchecked arithmetic operations in token calculations</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Recent events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audit.timeline.map((event) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <div className="w-px flex-1 bg-border" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-text">{event.action}</p>
                    {event.details && <p className="text-sm text-text-2">{event.details}</p>}
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                      <span className="font-mono">{event.user}</span>
                      <span>•</span>
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
