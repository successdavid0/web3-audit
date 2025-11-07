"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Search, Download, Eye, LayoutGrid, List, FileText, ImageIcon, FileJson } from "lucide-react"
import { mockAuditDetails } from "@/lib/mock-data"

const mockArtifacts = [
  {
    id: "1",
    name: "slither-report.json",
    type: "json",
    size: "45 KB",
    tool: "Slither",
    contract: "LendingPool.sol",
    uploadedBy: "0x1234...5678",
    timestamp: "2024-01-20T10:00:00Z",
    sha256: "a1b2c3d4e5f6...",
  },
  {
    id: "2",
    name: "call-graph.png",
    type: "image",
    size: "128 KB",
    tool: "Slither",
    contract: "All",
    uploadedBy: "0x1234...5678",
    timestamp: "2024-01-20T10:05:00Z",
    sha256: "f6e5d4c3b2a1...",
  },
  {
    id: "3",
    name: "mythril-analysis.txt",
    type: "text",
    size: "23 KB",
    tool: "Mythril",
    contract: "TokenSwap.sol",
    uploadedBy: "0x8765...4321",
    timestamp: "2024-01-21T14:30:00Z",
    sha256: "1a2b3c4d5e6f...",
  },
  {
    id: "4",
    name: "coverage-report.html",
    type: "html",
    size: "156 KB",
    tool: "Foundry",
    contract: "All",
    uploadedBy: "0x1234...5678",
    timestamp: "2024-01-22T09:15:00Z",
    sha256: "6f5e4d3c2b1a...",
  },
]

export default function ArtifactsPage({ params }: { params: { id: string } }) {
  const audit = mockAuditDetails
  const [view, setView] = React.useState<"grid" | "list">("grid")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "json":
        return <FileJson className="h-8 w-8" />
      case "image":
        return <ImageIcon className="h-8 w-8" />
      default:
        return <FileText className="h-8 w-8" />
    }
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: "Audits", href: "/app/audits" },
        { label: audit.name, href: `/app/audits/${params.id}/overview` },
        { label: "Artifacts" },
      ]}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Artifacts</h1>
            <p className="text-text-2">Evidence and analysis outputs</p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Artifact
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input placeholder="Search artifacts..." className="pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tool" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tools</SelectItem>
                    <SelectItem value="slither">Slither</SelectItem>
                    <SelectItem value="mythril">Mythril</SelectItem>
                    <SelectItem value="foundry">Foundry</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")}>
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artifacts */}
        {view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockArtifacts.map((artifact) => (
              <Card key={artifact.id} className="transition-colors hover:bg-surface-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center rounded-lg bg-surface-2 p-6 text-text-2">
                      {getFileIcon(artifact.type)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="truncate font-medium text-text">{artifact.name}</h4>
                      <p className="text-sm text-text-2">{artifact.size}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>{artifact.tool}</span>
                      <span>•</span>
                      <span>{artifact.contract}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-surface-2">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Tool</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Contract</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Uploaded</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockArtifacts.map((artifact) => (
                      <tr key={artifact.id} className="transition-colors hover:bg-surface-2">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="text-text-2">{getFileIcon(artifact.type)}</div>
                            <span className="font-medium text-text">{artifact.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-2">{artifact.type.toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm text-text-2">{artifact.size}</td>
                        <td className="px-6 py-4 text-sm text-text-2">{artifact.tool}</td>
                        <td className="px-6 py-4">
                          <code className="text-sm text-text-2">{artifact.contract}</code>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-2">
                          {new Date(artifact.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
