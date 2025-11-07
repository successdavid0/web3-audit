"use client"

import type React from "react"
import { addAuditRequest } from "@/lib/audit-stats"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield } from "lucide-react"
import Image from "next/image"

const BlockchainIcon = ({ name }: { name: string }) => {
  const logos: Record<string, string> = {
    ethereum: "/ethereum-logo.png",
    polygon: "/polygon-logo.png",
    bsc: "/binance-smart-chain-logo.jpg",
    arbitrum: "/arbitrum-logo-abstract.png",
    optimism: "/optimism-logo-abstract.png",
    avalanche: "/avalanche-logo-abstract.png",
    other: "/blockchain-logo.png",
  }
  return <Image src={logos[name] || logos.other} alt={`${name} logo`} width={24} height={24} className="mr-2" />
}

export default function SubmitAuditPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    addAuditRequest()

    // Redirect to dashboard
    router.push("/dashboard")
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

      {/* Form */}
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Submit Audit Request</h1>
          <p className="mt-2 text-muted-foreground">
            Provide detailed information about your Web3 project for security audit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Basic details about your Web3 project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input id="projectName" placeholder="e.g., DeFi Protocol" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type *</Label>
                <Select required>
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defi">DeFi Protocol</SelectItem>
                    <SelectItem value="nft">NFT Marketplace</SelectItem>
                    <SelectItem value="dao">DAO</SelectItem>
                    <SelectItem value="bridge">Bridge</SelectItem>
                    <SelectItem value="token">Token</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its purpose, and key features..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" type="url" placeholder="https://yourproject.com" />
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
              <CardDescription>Smart contract and blockchain information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blockchain">Blockchain *</Label>
                <Select required>
                  <SelectTrigger id="blockchain">
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">
                      <div className="flex items-center">
                        <BlockchainIcon name="ethereum" />
                        Ethereum
                      </div>
                    </SelectItem>
                    <SelectItem value="polygon">
                      <div className="flex items-center">
                        <BlockchainIcon name="polygon" />
                        Polygon
                      </div>
                    </SelectItem>
                    <SelectItem value="bsc">
                      <div className="flex items-center">
                        <BlockchainIcon name="bsc" />
                        Binance Smart Chain
                      </div>
                    </SelectItem>
                    <SelectItem value="arbitrum">
                      <div className="flex items-center">
                        <BlockchainIcon name="arbitrum" />
                        Arbitrum
                      </div>
                    </SelectItem>
                    <SelectItem value="optimism">
                      <div className="flex items-center">
                        <BlockchainIcon name="optimism" />
                        Optimism
                      </div>
                    </SelectItem>
                    <SelectItem value="avalanche">
                      <div className="flex items-center">
                        <BlockchainIcon name="avalanche" />
                        Avalanche
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center">
                        <BlockchainIcon name="other" />
                        Other
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractAddress">Contract Address(es) *</Label>
                <Textarea
                  id="contractAddress"
                  placeholder="0x... (one per line for multiple contracts)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubRepo">GitHub Repository *</Label>
                <Input id="githubRepo" placeholder="https://github.com/username/repo" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solidity">Solidity Version</Label>
                <Input id="solidity" placeholder="e.g., 0.8.20" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linesOfCode">Estimated Lines of Code</Label>
                <Input id="linesOfCode" type="number" placeholder="e.g., 1500" />
              </div>
            </CardContent>
          </Card>

          {/* Audit Scope */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Scope</CardTitle>
              <CardDescription>Define what needs to be audited</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auditType">Audit Type *</Label>
                <Select required>
                  <SelectTrigger id="auditType">
                    <SelectValue placeholder="Select audit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Audit</SelectItem>
                    <SelectItem value="partial">Partial Audit</SelectItem>
                    <SelectItem value="reaudit">Re-audit</SelectItem>
                    <SelectItem value="quick">Quick Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <Select required>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                    <SelectItem value="high">High (2-4 weeks)</SelectItem>
                    <SelectItem value="normal">Normal (4-6 weeks)</SelectItem>
                    <SelectItem value="low">Low (6+ weeks)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specificConcerns">Specific Concerns or Focus Areas</Label>
                <Textarea
                  id="specificConcerns"
                  placeholder="Describe any specific security concerns, previous issues, or areas you'd like us to focus on..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousAudits">Previous Audits</Label>
                <Textarea
                  id="previousAudits"
                  placeholder="List any previous audits, findings, or security reviews..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How can we reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input id="contactName" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input id="contactEmail" type="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Handle</Label>
                <Input id="telegram" placeholder="@username" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord">Discord Handle</Label>
                <Input id="discord" placeholder="username#1234" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea id="additionalInfo" placeholder="Any other information you'd like to share..." rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Audit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
