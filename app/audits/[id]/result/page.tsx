"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Upload, FileText, CheckCircle2, ArrowLeft } from "lucide-react"
import { getAuditById, uploadAuditResult, type AuditRequest } from "@/lib/audit-stats"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AuditResultPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [audit, setAudit] = useState<AuditRequest | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [resultFile, setResultFile] = useState("")

  useEffect(() => {
    const auditData = getAuditById(id)
    if (auditData) {
      setAudit(auditData)
    }
  }, [id])

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate file upload delay
    setTimeout(() => {
      uploadAuditResult(id, resultFile)
      setIsUploading(false)
      router.push(`/audits/${id}`)
    }, 1500)
  }

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
        <div className="mx-auto max-w-3xl">
          <Link href={`/audits/${id}`}>
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Audit Details
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    Audit Result
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {audit.projectName} - {audit.projectType}
                  </CardDescription>
                </div>
                <Badge className={getResultColor(audit.resultStatus || "pending")}>
                  {audit.resultStatus === "uploaded" ? "Result Uploaded" : "Pending Result"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {audit.resultStatus === "uploaded" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <div>
                      <h3 className="font-semibold text-green-500">Result Uploaded Successfully</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on{" "}
                        {audit.resultUploadedDate && new Date(audit.resultUploadedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold">Result File</h3>
                      <div className="rounded-lg border bg-muted p-4">
                        <p className="font-mono text-sm">{audit.resultFile}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full gap-2">
                        <FileText className="h-4 w-4" />
                        Download Result
                      </Button>
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        Send to Client
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="resultFile">Result File Name *</Label>
                    <Input
                      id="resultFile"
                      placeholder="e.g., TalaTech_Audit_Report_2024.pdf"
                      value={resultFile}
                      onChange={(e) => setResultFile(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">Enter the name or path of the audit result file</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Result Summary (Optional)</Label>
                    <Textarea id="summary" placeholder="Brief summary of the audit findings..." rows={4} />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isUploading} className="flex-1 gap-2">
                      {isUploading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload Result
                        </>
                      )}
                    </Button>
                    <Link href={`/audits/${id}`}>
                      <Button type="button" variant="outline" className="bg-transparent">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
