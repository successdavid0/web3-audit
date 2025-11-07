import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink } from "lucide-react"
import type { Audit } from "@/lib/mock-data"

export function AuditCard({ audit }: { audit: Audit }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-400/10 text-orange-400 border-orange-400/20"
      case "in-progress":
        return "bg-orange-600/10 text-orange-600 border-orange-600/20"
      case "completed":
        return "bg-green-400/10 text-green-400 border-green-400/20"
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
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
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
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className={getStatusColor(audit.status)}>{audit.status}</Badge>
              <Badge className={getPriorityColor(audit.priority)}>{audit.priority}</Badge>
              <Badge variant="outline">{audit.blockchain}</Badge>
              <Badge className={getResultColor(audit.resultStatus || "pending")}>
                {audit.resultStatus === "uploaded" ? "Result Uploaded" : "Pending Result"}
              </Badge>
            </div>
            <CardTitle className="text-xl">{audit.projectName}</CardTitle>
            <CardDescription className="mt-1">{audit.projectType}</CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/audits/${audit.id}`}>
              <Button variant="ghost" size="sm" className="w-full gap-2">
                View Details
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/audits/${audit.id}/result`}>
              <Button
                size="sm"
                className="w-full gap-2"
                variant={audit.resultStatus === "uploaded" ? "default" : "outline"}
              >
                {audit.resultStatus === "uploaded" ? "View Result" : "Upload Result"}
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{audit.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Submitted {audit.submittedDate}</span>
          </div>
          <div>•</div>
          <div>{audit.auditType}</div>
        </div>
      </CardContent>
    </Card>
  )
}
