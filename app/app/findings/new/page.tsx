"use client"

import type * as React from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewFindingPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/app/audits/1/findings/1")
  }

  return (
    <AppShell breadcrumbs={[{ label: "Findings", href: "/app/findings" }, { label: "New Finding" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/app/findings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text">New Finding</h1>
            <p className="text-text-2">Document a new security finding</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core details about the finding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Brief description of the vulnerability" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <Select required>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="info">Informational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reentrancy">Reentrancy</SelectItem>
                      <SelectItem value="access">Access Control</SelectItem>
                      <SelectItem value="math">Math</SelectItem>
                      <SelectItem value="oracle">Oracle</SelectItem>
                      <SelectItem value="mev">MEV</SelectItem>
                      <SelectItem value="upgradeability">Upgradeability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contract">Contract</Label>
                  <Input id="contract" placeholder="ContractName.sol" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lines">Affected Lines</Label>
                  <Input id="lines" placeholder="e.g., 145-152" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cwe">CWE</Label>
                  <Input id="cwe" placeholder="e.g., CWE-107" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owasp">OWASP</Label>
                  <Input id="owasp" placeholder="e.g., A1:2021" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Comprehensive analysis of the finding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the vulnerability..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impact">Impact *</Label>
                <Textarea
                  id="impact"
                  placeholder="What are the consequences of this vulnerability?"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="likelihood">Likelihood</Label>
                <Textarea id="likelihood" placeholder="How likely is this to be exploited?" rows={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scenario">Exploit Scenario</Label>
                <Textarea id="scenario" placeholder="Step-by-step exploitation scenario..." rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poc">Proof of Concept</Label>
                <Textarea
                  id="poc"
                  placeholder="Code demonstrating the vulnerability..."
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommendation">Recommendation *</Label>
                <Textarea id="recommendation" placeholder="How to fix this vulnerability..." rows={4} required />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/app/findings">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit">Create Finding</Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
