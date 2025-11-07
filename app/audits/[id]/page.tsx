"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, ExternalLink, Calendar, Mail, FileText, MessageSquare } from "lucide-react"
import { getAuditById, type AuditRequest } from "@/lib/audit-stats"

export default function AuditDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [audit, setAudit] = useState<AuditRequest | null>(null)

  useEffect(() => {
    const auditData = getAuditById(id)
    if (auditData) {
      setAudit(auditData)
    }

    const handleAuditsUpdated = () => {
      const updatedAudit = getAuditById(id)
      if (updatedAudit) {
        setAudit(updatedAudit)
      }
    }

    window.addEventListener("auditsUpdated", handleAuditsUpdated)
    return () => window.removeEventListener("auditsUpdated", handleAuditsUpdated)
  }, [id])

  if (!audit) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Audit Not Found</h2>
          <p className="mt-2 text-muted-foreground">The audit request you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-400/10 text-orange-400 border-orange-400/20"
      case "in_progress":
        return "bg-orange-600/10 text-orange-600 border-orange-600/20"
      case "completed":
        return "bg-green-400/10 text-green-400 border-green-400/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "normal":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getResultColor = (resultStatus: string) => {
    switch (resultStatus) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "uploaded":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

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

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge className={getStatusColor(audit.status)}>{audit.status}</Badge>
              <Badge className={getPriorityColor(audit.priority)}>{audit.priority}</Badge>
              <Badge variant="outline">{audit.blockchain}</Badge>
              <Badge className={getResultColor(audit.resultStatus || "pending")}>
                {audit.resultStatus === "uploaded" ? "Result Uploaded" : "Pending Result"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{audit.projectName}</h1>
            <p className="mt-2 text-muted-foreground">{audit.projectType}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold">Description</h3>
                    <p className="text-muted-foreground">{audit.description}</p>
                  </div>
                  {audit.website && (
                    <div>
                      <h3 className="mb-2 font-semibold">Website</h3>
                      <a
                        href={audit.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {audit.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audit.contractAddress && (
                    <div>
                      <h3 className="mb-2 font-semibold">Contract Address(es)</h3>
                      <code className="block rounded bg-muted px-2 py-1 font-mono text-sm whitespace-pre-wrap">
                        {audit.contractAddress}
                      </code>
                    </div>
                  )}
                  {audit.githubRepo && (
                    <div>
                      <h3 className="mb-2 font-semibold">GitHub Repository</h3>
                      <a
                        href={audit.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {audit.githubRepo}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {audit.solidity && (
                    <div>
                      <h3 className="mb-2 font-semibold">Solidity Version</h3>
                      <p className="text-muted-foreground">{audit.solidity}</p>
                    </div>
                  )}
                  {audit.linesOfCode && (
                    <div>
                      <h3 className="mb-2 font-semibold">Lines of Code</h3>
                      <p className="text-muted-foreground">{Number(audit.linesOfCode).toLocaleString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Scope</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audit.auditType && (
                    <div>
                      <h3 className="mb-2 font-semibold">Audit Type</h3>
                      <p className="text-muted-foreground capitalize">{audit.auditType}</p>
                    </div>
                  )}
                  {audit.specificConcerns && (
                    <div>
                      <h3 className="mb-2 font-semibold">Specific Concerns</h3>
                      <p className="text-muted-foreground">{audit.specificConcerns}</p>
                    </div>
                  )}
                  {audit.previousAudits && (
                    <div>
                      <h3 className="mb-2 font-semibold">Previous Audits</h3>
                      <p className="text-muted-foreground">{audit.previousAudits}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Audit Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audit.resultStatus === "uploaded" ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getResultColor("uploaded")}>Result Uploaded</Badge>
                        {audit.resultUploadedDate && (
                          <span className="text-sm text-muted-foreground">
                            Uploaded on {new Date(audit.resultUploadedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {audit.resultFile && (
                        <div>
                          <h3 className="mb-2 font-semibold">Result File</h3>
                          <p className="text-sm text-muted-foreground">{audit.resultFile}</p>
                        </div>
                      )}
                      <Link href={`/audits/${audit.id}/result`}>
                        <Button className="w-full">View Full Result</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getResultColor("pending")}>Pending Result</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The audit result has not been uploaded yet. Once the audit is complete, the result will be
                        available here.
                      </p>
                      <Link href={`/audits/${audit.id}/result`}>
                        <Button className="w-full">Upload Result</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Submitted</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(audit.submittedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audit.contactName && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-4 w-4 text-muted-foreground">👤</div>
                        <div>
                          <div className="text-sm font-medium">Name</div>
                          <div className="text-sm text-muted-foreground">{audit.contactName}</div>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <a href={`mailto:${audit.contactEmail}`} className="text-sm text-primary hover:underline">
                        {audit.contactEmail}
                      </a>
                    </div>
                  </div>
                  {audit.telegram && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Telegram</div>
                          <div className="text-sm text-muted-foreground">{audit.telegram}</div>
                        </div>
                      </div>
                    </>
                  )}
                  {audit.discord && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Discord</div>
                          <div className="text-sm text-muted-foreground">{audit.discord}</div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/audits/${audit.id}/result`}>
                    <Button className="w-full">
                      {audit.resultStatus === "uploaded" ? "View Result" : "Upload Result"}
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full bg-transparent">
                    Request More Info
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Download Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
