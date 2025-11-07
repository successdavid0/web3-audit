"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SeverityBadge } from "@/components/severity-badge"
import { Download, Share2, Eye, Plus, GripVertical, Trash2, FileText } from "lucide-react"
import { mockAuditDetails, mockFindings } from "@/lib/mock-data"
import Link from "next/link"

type BlockType = "heading" | "paragraph" | "findings" | "table"

interface ReportBlock {
  id: string
  type: BlockType
  content: string
  level?: number
}

export default function ReportBuilderPage({ params }: { params: { id: string } }) {
  const audit = mockAuditDetails
  const [blocks, setBlocks] = React.useState<ReportBlock[]>([
    { id: "1", type: "heading", content: "Executive Summary", level: 1 },
    {
      id: "2",
      type: "paragraph",
      content:
        "This report presents the findings of a comprehensive security audit conducted on the DeFi Protocol V2 smart contracts...",
    },
    { id: "3", type: "heading", content: "Scope", level: 2 },
    {
      id: "4",
      type: "paragraph",
      content: `The audit covered ${audit.scope.contracts} smart contracts with a total of ${audit.scope.linesOfCode} lines of code.`,
    },
    { id: "5", type: "heading", content: "Findings", level: 2 },
    { id: "6", type: "findings", content: "" },
  ])

  const addBlock = (type: BlockType) => {
    const newBlock: ReportBlock = {
      id: Date.now().toString(),
      type,
      content: type === "heading" ? "New Heading" : "",
      level: type === "heading" ? 2 : undefined,
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: "Audits", href: "/app/audits" },
        { label: audit.name, href: `/app/audits/${params.id}/overview` },
        { label: "Report" },
      ]}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Report Builder</h1>
            <p className="text-text-2">{audit.name} - Security Audit Report</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Link href={`/app/audits/${params.id}/sign-off`}>
              <Button>Sign Off</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Editor */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Report Content</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => addBlock("heading")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Heading
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addBlock("paragraph")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Paragraph
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className="group relative rounded-lg border border-border p-4 transition-colors hover:border-accent"
                  >
                    <div className="absolute -left-3 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <GripVertical className="h-5 w-5 text-muted" />
                    </div>
                    <div className="absolute -right-3 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteBlock(block.id)}>
                        <Trash2 className="h-4 w-4 text-error" />
                      </Button>
                    </div>

                    {block.type === "heading" && (
                      <Input
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        className="border-0 p-0 text-2xl font-bold focus-visible:ring-0"
                      />
                    )}

                    {block.type === "paragraph" && (
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        className="min-h-[100px] border-0 p-0 focus-visible:ring-0"
                      />
                    )}

                    {block.type === "findings" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-text-2">
                          <FileText className="h-4 w-4" />
                          <span>Findings will be automatically embedded here</span>
                        </div>
                        <div className="space-y-2">
                          {mockFindings.slice(0, 3).map((finding) => (
                            <div key={finding.id} className="rounded-lg border border-border bg-surface-2 p-3">
                              <div className="flex items-start gap-3">
                                <SeverityBadge level={finding.severity} />
                                <div className="flex-1">
                                  <h4 className="font-medium text-text">{finding.title}</h4>
                                  <p className="mt-1 text-sm text-text-2">
                                    {finding.contract} • {finding.category}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-2">Total Findings</span>
                  <span className="text-2xl font-bold text-text">
                    {Object.values(audit.findings).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-2">Critical</span>
                    <span className="font-medium text-severity-critical">{audit.findings.critical}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-2">High</span>
                    <span className="font-medium text-severity-high">{audit.findings.high}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-2">Medium</span>
                    <span className="font-medium text-severity-medium">{audit.findings.medium}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-2">Low</span>
                    <span className="font-medium text-severity-low">{audit.findings.low}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Share2 className="h-4 w-4" />
                  Generate Share Link
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Export Markdown
                </Button>
              </CardContent>
            </Card>

            {/* Client View Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Client View</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-text-2">Hide internal notes and evidence</span>
                </label>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
