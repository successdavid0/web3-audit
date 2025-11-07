"use client"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Plus, CheckCircle2, AlertTriangle } from "lucide-react"
import Link from "next/link"

const mockRunDetail = {
  id: "1",
  tool: "Slither",
  version: "0.10.0",
  auditId: "1",
  auditName: "DeFi Protocol V2",
  status: "completed",
  duration: "2m 34s",
  exitCode: 0,
  timestamp: "2024-01-20T10:00:00Z",
  commit: "a1b2c3d4e5f6",
  signer: "0x1234...5678",
  findings: [
    {
      id: "1",
      severity: "high",
      title: "Reentrancy in withdraw function",
      contract: "LendingPool.sol",
      line: 145,
    },
    {
      id: "2",
      severity: "medium",
      title: "Unchecked return value",
      contract: "TokenSwap.sol",
      line: 89,
    },
  ],
  logs: `[INFO] Starting Slither analysis...
[INFO] Analyzing contract: LendingPool.sol
[INFO] Analyzing contract: TokenSwap.sol
[INFO] Analyzing contract: Governance.sol
[WARN] Reentrancy detected in LendingPool.withdraw()
[WARN] Unchecked return value in TokenSwap.swap()
[INFO] Analysis complete
[INFO] Found 12 potential issues
[INFO] Exit code: 0`,
  artifacts: [
    { id: "1", name: "slither-report.json", size: "45 KB", type: "json" },
    { id: "2", name: "call-graph.png", size: "128 KB", type: "image" },
    { id: "3", name: "analysis-log.txt", size: "12 KB", type: "text" },
  ],
}

export default function ToolRunDetailPage({ params }: { params: { runId: string } }) {
  const run = mockRunDetail

  return (
    <AppShell
      breadcrumbs={[
        { label: "Tools", href: "/app/tools" },
        { label: "Runs", href: "/app/tools" },
        { label: `#${run.id}` },
      ]}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link href="/app/tools">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text">{run.tool} Analysis</h1>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
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
              <div className="flex items-center gap-2 text-sm text-text-2">
                <span>{run.auditName}</span>
                <span>•</span>
                <code className="rounded bg-surface-2 px-2 py-1 font-mono text-xs">{run.commit}</code>
                <span>•</span>
                <span>{new Date(run.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <Tabs defaultValue="logs">
              <TabsList>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="findings">Findings ({run.findings.length})</TabsTrigger>
                <TabsTrigger value="artifacts">Artifacts ({run.artifacts.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="logs">
                <Card>
                  <CardHeader>
                    <CardTitle>Execution Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm text-text">
                      {run.logs}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="findings" className="space-y-4">
                {run.findings.map((finding) => (
                  <Card key={finding.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`mt-1 h-5 w-5 ${
                              finding.severity === "high" ? "text-severity-high" : "text-severity-medium"
                            }`}
                          />
                          <div className="space-y-1">
                            <h4 className="font-medium text-text">{finding.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-text-2">
                              <code>{finding.contract}</code>
                              <span>•</span>
                              <span>Line {finding.line}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Plus className="h-4 w-4" />
                          Create Finding
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="artifacts" className="space-y-4">
                {run.artifacts.map((artifact) => (
                  <Card key={artifact.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2">
                            <span className="text-xs font-medium text-text-2">{artifact.type.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-text">{artifact.name}</p>
                            <p className="text-sm text-text-2">{artifact.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Run Info */}
            <Card>
              <CardHeader>
                <CardTitle>Run Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-text-2">Tool</p>
                  <p className="font-medium text-text">
                    {run.tool} v{run.version}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-2">Duration</p>
                  <p className="font-medium text-text">{run.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-text-2">Exit Code</p>
                  <p className="font-medium text-text">{run.exitCode}</p>
                </div>
                <div>
                  <p className="text-sm text-text-2">Executed By</p>
                  <code className="text-sm font-medium text-text">{run.signer}</code>
                </div>
                <div>
                  <p className="text-sm text-text-2">Commit</p>
                  <code className="text-sm font-medium text-text">{run.commit}</code>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Create Findings
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <CheckCircle2 className="h-4 w-4" />
                  Re-run Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
