"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { SeverityBadge } from "@/components/severity-badge"
import { ArrowLeft, Edit, MessageSquare, FileText, Send } from "lucide-react"
import Link from "next/link"
import { mockFindingDetail } from "@/lib/mock-data"

export default function FindingDetailPage({
  params,
}: {
  params: { id: string; findingId: string }
}) {
  const finding = mockFindingDetail
  const [comment, setComment] = React.useState("")

  return (
    <AppShell
      breadcrumbs={[
        { label: "Audits", href: "/app/audits" },
        { label: finding.auditName, href: `/app/audits/${params.id}/overview` },
        { label: "Findings", href: `/app/audits/${params.id}/findings` },
        { label: `#${finding.id}` },
      ]}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link href={`/app/audits/${params.id}/findings`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <SeverityBadge level={finding.severity} />
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    finding.status === "accepted"
                      ? "bg-success/10 text-success"
                      : finding.status === "in_review"
                        ? "bg-warning/10 text-warning"
                        : "bg-surface-2 text-text-2"
                  }`}
                >
                  {finding.status.replace("_", " ")}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-text">{finding.title}</h1>
              <div className="flex items-center gap-2 text-sm text-text-2">
                <span>Reported by</span>
                <code className="rounded bg-surface-2 px-2 py-1 font-mono text-xs">{finding.reporter}</code>
                <span>•</span>
                <span>{new Date(finding.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="discussion">Discussion ({finding.comments.length})</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-2 leading-relaxed">{finding.description}</p>
                  </CardContent>
                </Card>

                {/* Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-2 leading-relaxed">{finding.impact}</p>
                  </CardContent>
                </Card>

                {/* Likelihood */}
                <Card>
                  <CardHeader>
                    <CardTitle>Likelihood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-2 leading-relaxed">{finding.likelihood}</p>
                  </CardContent>
                </Card>

                {/* Exploit Scenario */}
                <Card>
                  <CardHeader>
                    <CardTitle>Exploit Scenario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm text-text-2 leading-relaxed">
                      {finding.exploitScenario}
                    </pre>
                  </CardContent>
                </Card>

                {/* Reproduction */}
                <Card>
                  <CardHeader>
                    <CardTitle>Proof of Concept</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm text-text">
                      {finding.reproduction}
                    </pre>
                  </CardContent>
                </Card>

                {/* Recommendation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm text-text-2 leading-relaxed">
                      {finding.recommendation}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="space-y-4">
                {/* Comments */}
                <div className="space-y-4">
                  {finding.comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <code className="rounded bg-surface-2 px-2 py-1 font-mono text-xs text-text-2">
                              {comment.author}
                            </code>
                            <span className="text-muted">{new Date(comment.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-text-2">{comment.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add Comment */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                      />
                      <div className="flex justify-end">
                        <Button className="gap-2">
                          <Send className="h-4 w-4" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evidence">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-text-2">No evidence attached yet</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-text-2">Contract</p>
                  <code className="text-sm font-medium text-text">{finding.contract}</code>
                </div>
                <div>
                  <p className="text-sm text-text-2">Category</p>
                  <p className="text-sm font-medium text-text">{finding.category}</p>
                </div>
                <div>
                  <p className="text-sm text-text-2">CWE</p>
                  <p className="text-sm font-medium text-text">{finding.cwe}</p>
                </div>
                <div>
                  <p className="text-sm text-text-2">OWASP</p>
                  <p className="text-sm font-medium text-text">{finding.owasp}</p>
                </div>
                <div>
                  <p className="text-sm text-text-2">Affected Lines</p>
                  <code className="text-sm font-medium text-text">{finding.affectedLines}</code>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Request Review
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Promote to Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
