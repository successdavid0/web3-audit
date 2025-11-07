import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChainBadge } from "@/components/chain-badge"
import { Search, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

const mockContracts = [
  {
    address: "0x1234567890123456789012345678901234567890",
    name: "LendingPool",
    chain: "Ethereum",
    verified: true,
    isProxy: true,
    implementation: "0xabcd...ef01",
    auditId: "1",
    auditName: "DeFi Protocol V2",
  },
  {
    address: "0x2345678901234567890123456789012345678901",
    name: "TokenSwap",
    chain: "Arbitrum",
    verified: true,
    isProxy: false,
    implementation: null,
    auditId: "1",
    auditName: "DeFi Protocol V2",
  },
  {
    address: "0x3456789012345678901234567890123456789012",
    name: "NFTMarketplace",
    chain: "Base",
    verified: false,
    isProxy: false,
    implementation: null,
    auditId: "2",
    auditName: "NFT Marketplace",
  },
]

export default function ContractsPage() {
  return (
    <AppShell breadcrumbs={[{ label: "Contracts" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Contract Explorer</h1>
            <p className="text-text-2">Verify and analyze deployed contracts</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input placeholder="Search by address, name, or chain..." className="pl-9" />
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <div className="space-y-4">
          {mockContracts.map((contract) => (
            <Link key={contract.address} href={`/app/contracts/${contract.chain.toLowerCase()}/${contract.address}`}>
              <Card className="transition-colors hover:bg-surface-2">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-text">{contract.name}</h3>
                        {contract.verified ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-warning" />
                        )}
                        {contract.isProxy && (
                          <span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                            Proxy
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="rounded bg-surface-2 px-2 py-1 font-mono text-sm text-text-2">
                          {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                        </code>
                        <ChainBadge chain={contract.chain} />
                        <span className="text-sm text-text-2">•</span>
                        <span className="text-sm text-text-2">{contract.auditName}</span>
                      </div>
                      {contract.isProxy && contract.implementation && (
                        <div className="flex items-center gap-2 text-sm text-text-2">
                          <span>Implementation:</span>
                          <code className="rounded bg-surface-2 px-2 py-1 font-mono text-xs">
                            {contract.implementation}
                          </code>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          contract.verified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}
                      >
                        {contract.verified ? "Verified" : "Unverified"}
                      </span>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        View Details
                        <ExternalLink className="h-4 w-4" />
                      </Button>
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
