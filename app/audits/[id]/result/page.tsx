"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Upload, FileText, CheckCircle2, ArrowLeft, AlertTriangle, Code, Server } from "lucide-react"
import { getAuditById, uploadAuditResult, type AuditRequest } from "@/lib/audit-stats"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

type AnalysisResult = {
  address: string
  slither_analysis: Array<{
    contract_name: string
    functions: Array<{
      function_name: string
      state_variables_read: string[]
      state_variables_written: string[]
      nodes: string[]
    }>
  }>
  abi: any[]
  erc20_calldata: any
}

export default function AuditResultPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [audit, setAudit] = useState<AuditRequest | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [resultFile, setResultFile] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  useEffect(() => {
    const auditData = getAuditById(id)
    if (auditData) {
      setAudit(auditData)
    }
  }, [id])

  const runAutomatedAnalysis = async () => {
    if (!audit?.contractAddress) {
      setAnalysisError("No contract address found for this audit")
      return
    }

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      console.log("[v0] Starting automated audit analysis for:", audit.contractAddress)

      const response = await fetch("/api/audit/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress: audit.contractAddress,
          owner: "0x1111111111111111111111111111111111111111",
          spender: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
          recipient: "0xcccccccccccccccccccccccccccccccccccccccc",
          amount: 10000000,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      console.log("[v0] Analysis completed successfully")
      setAnalysisResult(data.data)
      setResultFile(`Analysis_${audit.projectName}_${Date.now()}.json`)
    } catch (error: any) {
      console.error("[v0] Analysis error:", error)
      setAnalysisError(error.message || "Failed to analyze contract")
    } finally {
      setIsAnalyzing(false)
    }
  }

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
        <div className="mx-auto max-w-4xl">
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
                    {audit?.projectName} - {audit?.projectType}
                  </CardDescription>
                </div>
                <Badge className={getResultColor(audit?.resultStatus || "pending")}>
                  {audit?.resultStatus === "uploaded" ? "Result Uploaded" : "Pending Result"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {audit?.resultStatus === "uploaded" ? (
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
                <div className="space-y-6">
                  {audit?.contractAddress && (
                    <Card className="border-purple-500/20 bg-purple-500/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Server className="h-5 w-5 text-purple-500" />
                          Automated Contract Analysis
                        </CardTitle>
                        <CardDescription>
                          Run automated security analysis using Slither on contract: {audit.contractAddress}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button onClick={runAutomatedAnalysis} disabled={isAnalyzing} className="w-full gap-2">
                          {isAnalyzing ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                              Analyzing Contract...
                            </>
                          ) : (
                            <>
                              <Code className="h-4 w-4" />
                              Run Automated Analysis
                            </>
                          )}
                        </Button>

                        {analysisError && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{analysisError}</AlertDescription>
                          </Alert>
                        )}

                        {analysisResult && (
                          <div className="space-y-4">
                            <Alert className="border-green-500/20 bg-green-500/5">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <AlertDescription className="text-green-500">
                                Analysis completed successfully!
                              </AlertDescription>
                            </Alert>

                            <div className="space-y-3">
                              <h4 className="font-semibold">Analysis Summary</h4>
                              <div className="rounded-lg border bg-muted p-4">
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <span className="font-semibold">Contract Address:</span>{" "}
                                    <code className="rounded bg-background px-1 py-0.5">{analysisResult.address}</code>
                                  </p>
                                  <p>
                                    <span className="font-semibold">Contracts Found:</span>{" "}
                                    {analysisResult.slither_analysis.length}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Total Functions:</span>{" "}
                                    {analysisResult.slither_analysis.reduce((sum, c) => sum + c.functions.length, 0)}
                                  </p>
                                </div>
                              </div>

                              {analysisResult.slither_analysis.map((contract, idx) => (
                                <details key={idx} className="rounded-lg border bg-muted">
                                  <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/50">
                                    {contract.contract_name} ({contract.functions.length} functions)
                                  </summary>
                                  <div className="border-t p-4">
                                    {contract.functions.slice(0, 5).map((func, fidx) => (
                                      <div key={fidx} className="mb-4 rounded border bg-background p-3">
                                        <p className="font-mono text-sm font-semibold">{func.function_name}()</p>
                                        <div className="mt-2 space-y-1 text-xs">
                                          {func.state_variables_read.length > 0 && (
                                            <p>
                                              <span className="text-blue-500">Reads:</span>{" "}
                                              {func.state_variables_read.join(", ")}
                                            </p>
                                          )}
                                          {func.state_variables_written.length > 0 && (
                                            <p>
                                              <span className="text-orange-500">Writes:</span>{" "}
                                              {func.state_variables_written.join(", ")}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                    {contract.functions.length > 5 && (
                                      <p className="text-center text-sm text-muted-foreground">
                                        + {contract.functions.length - 5} more functions
                                      </p>
                                    )}
                                  </div>
                                </details>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
