"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getAuditStats, getAuditRequests, type AuditRequest } from "@/lib/audit-stats"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 })
  const [audits, setAudits] = useState<AuditRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    // Load initial stats and audits
    setStats(getAuditStats())
    setAudits(getAuditRequests())

    // Listen for stats updates
    const handleStatsUpdate = (event: CustomEvent) => {
      setStats(event.detail)
    }

    const handleAuditsUpdate = (event: CustomEvent) => {
      setAudits(event.detail)
    }

    window.addEventListener("auditStatsUpdated" as any, handleStatsUpdate)
    window.addEventListener("auditsUpdated" as any, handleAuditsUpdate)

    return () => {
      window.removeEventListener("auditStatsUpdated" as any, handleStatsUpdate)
      window.removeEventListener("auditsUpdated" as any, handleAuditsUpdate)
    }
  }, [])

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || audit.status === statusFilter
    const matchesPriority = priorityFilter === "all" || audit.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-400/10 text-orange-400 border-orange-400/20"
      case "in_progress":
        return "bg-orange-600/10 text-orange-600 border-orange-600/20"
      case "completed":
        return "bg-green-400/10 text-green-400 border-green-400/20"
      default:
        return ""
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
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
        return ""
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

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Audit Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Real-time overview of all audit requests</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Requests</div>
            <div className="mt-2 text-3xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Pending Review</div>
            <div className="mt-2 text-3xl font-bold">{stats.pending}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">In Progress</div>
            <div className="mt-2 text-3xl font-bold">{stats.inProgress}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Completed</div>
            <div className="mt-2 text-3xl font-bold">{stats.completed}</div>
          </Card>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold">Audit Requests</h2>
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search audits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {audits.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No audit requests yet. Submit your first audit to get started.</p>
            </Card>
          ) : filteredAudits.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No audits match your search criteria.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAudits.map((audit) => (
                <Card key={audit.id} className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{audit.projectName}</h3>
                        <Badge className={getStatusBadgeClass(audit.status)}>
                          {audit.status === "pending"
                            ? "Pending"
                            : audit.status === "in_progress"
                              ? "In Progress"
                              : "Completed"}
                        </Badge>
                        <Badge className={getPriorityBadgeClass(audit.priority)}>
                          {audit.priority.charAt(0).toUpperCase() + audit.priority.slice(1)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{audit.description}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>ID: {audit.id}</span>
                        <span>Type: {audit.projectType}</span>
                        <span>Chain: {audit.blockchain}</span>
                        <span>Submitted: {new Date(audit.submittedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/audits/${audit.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
