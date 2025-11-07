import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, ExternalLink, Calendar, Clock, User, Mail, MessageSquare } from "lucide-react"
import { mockAudits } from "@/lib/mock-data"

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const audit = mockAudits.find((a) => a.id === id)

  if (!audit) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
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
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "low":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
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
              <Button variant="ghost">Submit Audit</Button>
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

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold">Contract Address(es)</h3>
                    <div className="space-y-1">
                      {audit.contractAddresses.map((address, i) => (
                        <code key={i} className="block rounded bg-muted px-2 py-1 font-mono text-sm">
                          {address}
                        </code>
                      ))}
                    </div>
                  </div>
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
                  {audit.solidityVersion && (
                    <div>
                      <h3 className="mb-2 font-semibold">Solidity Version</h3>
                      <p className="text-muted-foreground">{audit.solidityVersion}</p>
                    </div>
                  )}
                  {audit.linesOfCode && (
                    <div>
                      <h3 className="mb-2 font-semibold">Lines of Code</h3>
                      <p className="text-muted-foreground">{audit.linesOfCode.toLocaleString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Audit Scope */}
              <Card>
                <CardHeader>
                  <CardTitle>Audit Scope</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold">Audit Type</h3>
                    <p className="text-muted-foreground">{audit.auditType}</p>
                  </div>
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
                      <div className="text-sm text-muted-foreground">{audit.submittedDate}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Estimated Completion</div>
                      <div className="text-sm text-muted-foreground">{audit.estimatedCompletion}</div>
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
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Name</div>
                      <div className="text-sm text-muted-foreground">{audit.contactName}</div>
                    </div>
                  </div>
                  <Separator />
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
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full">Start Audit</Button>
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
