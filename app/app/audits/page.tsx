import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SeverityBadge } from "@/components/severity-badge"
import { ChainBadge } from "@/components/chain-badge"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import { mockAudits } from "@/lib/mock-data"

export default function AuditsPage() {
  return (
    <AppShell breadcrumbs={[{ label: "Audits" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Audits</h1>
            <p className="text-text-2">Manage and track all your security audits</p>
          </div>
          <Link href="/app/audits/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Audit
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input placeholder="Search audits..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audits List */}
        <div className="space-y-4">
          {mockAudits.map((audit) => (
            <Link key={audit.id} href={`/app/audits/${audit.id}/overview`}>
              <Card className="transition-colors hover:bg-surface-2">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left: Audit Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-text">{audit.name}</h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            audit.status === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                          }`}
                        >
                          {audit.status === "in-progress" ? "In Progress" : "Completed"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-text-2">
                        <code className="rounded bg-surface-2 px-2 py-1 font-mono text-xs">
                          {audit.repo}@{audit.commit}
                        </code>
                        {audit.chains.map((chain) => (
                          <ChainBadge key={chain} chain={chain} />
                        ))}
                      </div>
                    </div>

                    {/* Middle: Stats */}
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-text">{audit.scopeSize}</p>
                        <p className="text-xs text-text-2">Contracts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-text">{audit.riskScore}</p>
                        <p className="text-xs text-text-2">Risk Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-text">
                          {Object.values(audit.findings).reduce((a, b) => a + b, 0)}
                        </p>
                        <p className="text-xs text-text-2">Findings</p>
                      </div>
                    </div>

                    {/* Right: Findings Breakdown */}
                    <div className="flex flex-wrap gap-2">
                      {audit.findings.critical > 0 && (
                        <div className="flex items-center gap-1">
                          <SeverityBadge level="CRITICAL" />
                          <span className="text-sm text-text-2">{audit.findings.critical}</span>
                        </div>
                      )}
                      {audit.findings.high > 0 && (
                        <div className="flex items-center gap-1">
                          <SeverityBadge level="HIGH" />
                          <span className="text-sm text-text-2">{audit.findings.high}</span>
                        </div>
                      )}
                      {audit.findings.medium > 0 && (
                        <div className="flex items-center gap-1">
                          <SeverityBadge level="MEDIUM" />
                          <span className="text-sm text-text-2">{audit.findings.medium}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
