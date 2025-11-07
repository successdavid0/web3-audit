"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

export default function NewAuditPage() {
  const router = useRouter()
  const [tags, setTags] = React.useState<string[]>([])
  const [tagInput, setTagInput] = React.useState("")
  const [selectedChains, setSelectedChains] = React.useState<string[]>(["ethereum"])

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const toggleChain = (chain: string) => {
    setSelectedChains((prev) => (prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create the audit
    router.push("/app/audits/1/overview")
  }

  return (
    <AppShell breadcrumbs={[{ label: "Audits", href: "/app/audits" }, { label: "New Audit" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/app/audits">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text">New Audit</h1>
            <p className="text-text-2">Create a new security audit project</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the core details about this audit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Audit Name *</Label>
                <Input id="name" placeholder="e.g., DeFi Protocol V2" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the audit scope and objectives..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="repo">Repository</Label>
                  <Input id="repo" placeholder="org/repo" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commit">Commit Hash</Label>
                  <Input id="commit" placeholder="a1b2c3d4e5f6..." className="font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chains */}
          <Card>
            <CardHeader>
              <CardTitle>Target Chains</CardTitle>
              <CardDescription>Select the blockchain networks this audit covers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Ethereum", "Arbitrum", "Base", "Optimism", "Polygon"].map((chain) => (
                  <div key={chain} className="flex items-center space-x-2">
                    <Checkbox
                      id={chain}
                      checked={selectedChains.includes(chain.toLowerCase())}
                      onCheckedChange={() => toggleChain(chain.toLowerCase())}
                    />
                    <Label htmlFor={chain} className="text-sm font-normal cursor-pointer">
                      {chain}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to categorize this audit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-sm text-text"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-muted hover:text-text">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/app/audits">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Create Audit</Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
