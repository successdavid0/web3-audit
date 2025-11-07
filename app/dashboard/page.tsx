import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Search } from "lucide-react"
import { AuditCard } from "@/components/audit-card"
import { mockAudits } from "@/lib/mock-data"

export default function DashboardPage() {
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

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Audit Requests</h1>
          <p className="mt-2 text-muted-foreground">View and manage all submitted audit requests</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-9" />
          </div>
        </div>

        {/* Audit List */}
        <div className="space-y-4">
          {mockAudits.map((audit) => (
            <AuditCard key={audit.id} audit={audit} />
          ))}
        </div>
      </div>
    </div>
  )
}
