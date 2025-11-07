"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SeverityBadge } from "@/components/severity-badge"
import { Plus, Search, LayoutGrid, TableIcon } from "lucide-react"
import Link from "next/link"
import { mockFindings } from "@/lib/mock-data"

export default function FindingsPage() {
  const [view, setView] = React.useState<"kanban" | "table">("table")

  const findingsByStatus = {
    draft: mockFindings.filter((f) => f.status === "draft"),
    in_review: mockFindings.filter((f) => f.status === "in_review"),
    accepted: mockFindings.filter((f) => f.status === "accepted"),
    fixed: mockFindings.filter((f) => f.status === "fixed"),
  }

  return (
    <AppShell breadcrumbs={[{ label: "Findings" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Findings</h1>
            <p className="text-text-2">Track and manage security findings across all audits</p>
          </div>
          <Link href="/app/findings/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Finding
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input placeholder="Search findings..." className="pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="reentrancy">Reentrancy</SelectItem>
                    <SelectItem value="access">Access Control</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant={view === "table" ? "default" : "outline"} size="icon" onClick={() => setView("table")}>
                  <TableIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "kanban" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("kanban")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Views */}
        {view === "table" ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-surface-2">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Contract</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockFindings.map((finding) => (
                      <tr key={finding.id} className="transition-colors hover:bg-surface-2">
                        <td className="px-6 py-4">
                          <Link
                            href={`/app/audits/${finding.auditId}/findings/${finding.id}`}
                            className="font-medium text-text hover:text-accent"
                          >
                            {finding.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <SeverityBadge level={finding.severity} />
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              finding.status === "accepted"
                                ? "bg-success/10 text-success"
                                : finding.status === "in_review"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-surface-2 text-text-2"
                            }`}
                          >
                            {finding.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm text-text-2">{finding.contract}</code>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-2">{finding.category}</td>
                        <td className="px-6 py-4 text-sm text-text-2">{finding.auditName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-4">
            <KanbanColumn title="Draft" findings={findingsByStatus.draft} />
            <KanbanColumn title="In Review" findings={findingsByStatus.in_review} />
            <KanbanColumn title="Accepted" findings={findingsByStatus.accepted} />
            <KanbanColumn title="Fixed" findings={findingsByStatus.fixed} />
          </div>
        )}
      </div>
    </AppShell>
  )
}

function KanbanColumn({
  title,
  findings,
}: {
  title: string
  findings: typeof mockFindings
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text">{title}</h3>
        <span className="rounded-full bg-surface-2 px-2 py-1 text-xs text-text-2">{findings.length}</span>
      </div>
      <div className="space-y-3">
        {findings.map((finding) => (
          <Link key={finding.id} href={`/app/audits/${finding.auditId}/findings/${finding.id}`}>
            <Card className="transition-colors hover:bg-surface-2">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <SeverityBadge level={finding.severity} />
                  <h4 className="text-sm font-medium text-text line-clamp-2">{finding.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-text-2">
                    <code>{finding.contract}</code>
                    <span>•</span>
                    <span>{finding.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
