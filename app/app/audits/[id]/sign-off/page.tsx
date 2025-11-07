"use client"

import * as React from "react"
import { useAccount, useSignMessage } from "wagmi"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Clock, Shield, FileText, ExternalLink } from "lucide-react"
import { mockAuditDetails } from "@/lib/mock-data"
import Link from "next/link"

interface Signature {
  role: "Auditor" | "Reviewer" | "Client"
  signer?: string
  chain?: string
  txHash?: string
  timestamp?: string
  status: "pending" | "signed"
}

export default function SignOffPage({ params }: { params: { id: string } }) {
  const audit = mockAuditDetails
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [selectedChain, setSelectedChain] = React.useState("ethereum")
  const [ipfsCid, setIpfsCid] = React.useState("")
  const [signing, setSigning] = React.useState(false)

  const [signatures, setSignatures] = React.useState<Signature[]>([
    {
      role: "Auditor",
      signer: "0x1234...5678",
      chain: "Ethereum",
      txHash: "0xabc...def",
      timestamp: "2024-01-20T10:00:00Z",
      status: "signed",
    },
    {
      role: "Reviewer",
      signer: "0x8765...4321",
      chain: "Ethereum",
      txHash: "0x123...456",
      timestamp: "2024-01-21T14:30:00Z",
      status: "signed",
    },
    { role: "Client", status: "pending" },
  ])

  const handleSign = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    try {
      setSigning(true)

      // Create report hash (in production, this would be the actual report hash)
      const reportHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      const message = `Sign Audit Report\n\nAudit: ${audit.name}\nReport Hash: ${reportHash}\nRole: Client\nTimestamp: ${new Date().toISOString()}`

      const signature = await signMessageAsync({ message })

      // Update signatures
      setSignatures(
        signatures.map((sig) =>
          sig.role === "Client" && sig.status === "pending"
            ? {
                ...sig,
                signer: address,
                chain: selectedChain,
                txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
                timestamp: new Date().toISOString(),
                status: "signed" as const,
              }
            : sig,
        ),
      )

      alert("Report signed successfully!")
    } catch (error) {
      console.error("[v0] Signing error:", error)
      alert("Failed to sign report")
    } finally {
      setSigning(false)
    }
  }

  const allSigned = signatures.every((sig) => sig.status === "signed")

  return (
    <AppShell
      breadcrumbs={[
        { label: "Audits", href: "/app/audits" },
        { label: audit.name, href: `/app/audits/${params.id}/overview` },
        { label: "Sign Off" },
      ]}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Report Sign-Off</h1>
            <p className="text-text-2">{audit.name} - Security Audit Report</p>
          </div>
          <Link href={`/app/audits/${params.id}/report`}>
            <Button variant="outline" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              View Report
            </Button>
          </Link>
        </div>

        {/* Status Banner */}
        {allSigned ? (
          <Card className="border-success bg-success/5">
            <CardContent className="flex items-center gap-3 pt-6">
              <CheckCircle2 className="h-6 w-6 text-success" />
              <div>
                <p className="font-semibold text-success">Report Fully Signed</p>
                <p className="text-sm text-text-2">All required signatures have been collected</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-warning bg-warning/5">
            <CardContent className="flex items-center gap-3 pt-6">
              <Clock className="h-6 w-6 text-warning" />
              <div>
                <p className="font-semibold text-warning">Pending Signatures</p>
                <p className="text-sm text-text-2">
                  {signatures.filter((s) => s.status === "pending").length} signature(s) remaining
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Signatures */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Required Signatures</CardTitle>
                <CardDescription>All parties must sign the report before it can be finalized</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {signatures.map((sig, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-lg border border-border p-4">
                    <div
                      className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${
                        sig.status === "signed" ? "bg-success/10 text-success" : "bg-surface-2 text-text-2"
                      }`}
                    >
                      {sig.status === "signed" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-text">{sig.role}</h4>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            sig.status === "signed" ? "bg-success/10 text-success" : "bg-surface-2 text-text-2"
                          }`}
                        >
                          {sig.status === "signed" ? "Signed" : "Pending"}
                        </span>
                      </div>
                      {sig.status === "signed" && sig.signer && (
                        <div className="space-y-1 text-sm text-text-2">
                          <div className="flex items-center gap-2">
                            <span>Signer:</span>
                            <code className="rounded bg-surface-2 px-2 py-0.5 font-mono text-xs">{sig.signer}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Chain:</span>
                            <span>{sig.chain}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Transaction:</span>
                            <a href="#" className="inline-flex items-center gap-1 text-accent hover:underline">
                              <code className="font-mono text-xs">{sig.txHash}</code>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Timestamp:</span>
                            <span>{new Date(sig.timestamp!).toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sign Report */}
            {!allSigned && (
              <Card>
                <CardHeader>
                  <CardTitle>Sign Report</CardTitle>
                  <CardDescription>Sign the report with your wallet to confirm the audit findings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chain">Chain</Label>
                    <Select value={selectedChain} onValueChange={setSelectedChain}>
                      <SelectTrigger id="chain">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        <SelectItem value="base">Base</SelectItem>
                        <SelectItem value="optimism">Optimism</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipfs">IPFS CID (Optional)</Label>
                    <Input
                      id="ipfs"
                      placeholder="QmX..."
                      value={ipfsCid}
                      onChange={(e) => setIpfsCid(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-xs text-text-2">Anchor the report to IPFS for immutable storage</p>
                  </div>

                  <Button onClick={handleSign} disabled={!isConnected || signing} className="w-full gap-2">
                    <Shield className="h-4 w-4" />
                    {signing ? "Signing..." : "Sign Report"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-text-2">Audit</p>
                  <p className="font-medium text-text">{audit.name}</p>
                </div>
                <div>
                  <p className="text-sm text-text-2">Total Findings</p>
                  <p className="text-2xl font-bold text-text">
                    {Object.values(audit.findings).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-2">Report Hash</p>
                  <code className="block break-all text-xs text-text-2">0x1234...5678</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-text-2">
                <p>Once all required signatures are collected, the report will be finalized and published.</p>
                <p>Signatures are recorded on-chain for transparency and immutability.</p>
                <p>Optional IPFS anchoring provides decentralized storage of the report.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
