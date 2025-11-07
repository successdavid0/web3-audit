import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

const mockReports = [
  {
    id: "1",
    auditId: "1",
    auditName: "DeFi Protocol V2",
    status: "draft",
    findings: 32,
    signatures: { required: 3, completed: 0 },
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    auditId: "2",
    auditName: "NFT Marketplace",
    status: "pending_signatures",
    findings: 17,
    signatures: { required: 3, completed: 2 },
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    auditId: "3",
    auditName: "Lending Platform",
    status: "completed",
    findings: 43,
    signatures: { required: 3, completed: 3 },
    lastUpdated: "3 days ago",
  },
]

export default function ReportsPage() {
  return (
    <AppShell breadcrumbs={[{ label: "Reports" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Reports</h1>
            <p className="text-text-2">Generate and manage audit reports</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input placeholder="Search reports..." className="pl-9" />
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {mockReports.map((report) => (
            <Link key={report.id} href={`/app/audits/${report.auditId}/report`}>
              <Card className="transition-colors hover:bg-surface-2">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-accent/10 p-3 text-accent">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-text">{report.auditName} - Audit Report</h3>
                        <p className="text-sm text-text-2">
                          {report.findings} findings • Last updated {report.lastUpdated}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-text-2">Signatures</p>
                        <p className="text-lg font-semibold text-text">
                          {report.signatures.completed}/{report.signatures.required}
                        </p>
                      </div>
                      <div>
                        {report.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                          </span>
                        ) : report.status === "pending_signatures" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
                            <Clock className="h-4 w-4" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-sm font-medium text-text-2">
                            <AlertCircle className="h-4 w-4" />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
