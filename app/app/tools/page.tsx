import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Play, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

const mockToolRuns = [
  {
    id: "1",
    tool: "Slither",
    auditId: "1",
    auditName: "DeFi Protocol V2",
    status: "completed",
    duration: "2m 34s",
    findings: 12,
    exitCode: 0,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    tool: "Mythril",
    auditId: "1",
    auditName: "DeFi Protocol V2",
    status: "running",
    duration: "1m 15s",
    findings: 0,
    exitCode: null,
    timestamp: "5 minutes ago",
  },
  {
    id: "3",
    tool: "Echidna",
    auditId: "2",
    auditName: "NFT Marketplace",
    status: "failed",
    duration: "45s",
    findings: 0,
    exitCode: 1,
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    tool: "Foundry",
    auditId: "1",
    auditName: "DeFi Protocol V2",
    status: "completed",
    duration: "3m 12s",
    findings: 8,
    exitCode: 0,
    timestamp: "3 hours ago",
  },
]

export default function ToolsPage() {
  return (
    <AppShell breadcrumbs={[{ label: "Tools" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Tool Runs</h1>
            <p className="text-text-2">Execute and monitor security analysis tools</p>
          </div>
          <Link href="/app/tools/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Run
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input placeholder="Search tool runs..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tools</SelectItem>
                  <SelectItem value="slither">Slither</SelectItem>
                  <SelectItem value="mythril">Mythril</SelectItem>
                  <SelectItem value="echidna">Echidna</SelectItem>
                  <SelectItem value="foundry">Foundry</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tool Runs List */}
        <div className="space-y-4">
          {mockToolRuns.map((run) => (
            <Link key={run.id} href={`/app/tools/runs/${run.id}`}>
              <Card className="transition-colors hover:bg-surface-2">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left: Tool Info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          run.status === "completed"
                            ? "bg-success/10 text-success"
                            : run.status === "running"
                              ? "bg-primary/10 text-primary"
                              : "bg-error/10 text-error"
                        }`}
                      >
                        {run.status === "completed" ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : run.status === "running" ? (
                          <Play className="h-6 w-6" />
                        ) : (
                          <XCircle className="h-6 w-6" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-text">{run.tool}</h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              run.status === "completed"
                                ? "bg-success/10 text-success"
                                : run.status === "running"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-error/10 text-error"
                            }`}
                          >
                            {run.status}
                          </span>
                        </div>
                        <p className="text-sm text-text-2">{run.auditName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <span>{run.timestamp}</span>
                          <span>•</span>
                          <span>Duration: {run.duration}</span>
                          {run.exitCode !== null && (
                            <>
                              <span>•</span>
                              <span>Exit code: {run.exitCode}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex items-center gap-6">
                      {run.findings > 0 && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-text">{run.findings}</p>
                          <p className="text-xs text-text-2">Findings</p>
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        View Details
                      </Button>
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
