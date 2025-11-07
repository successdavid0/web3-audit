"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChainBadge } from "@/components/chain-badge"
import { ArrowLeft, CheckCircle2, ExternalLink, Copy, Check } from "lucide-react"
import Link from "next/link"

const mockContractDetail = {
  address: "0x1234567890123456789012345678901234567890",
  name: "LendingPool",
  chain: "Ethereum",
  verified: true,
  isProxy: true,
  implementation: "0xabcdef0123456789012345678901234567890123",
  compiler: "0.8.19",
  optimization: true,
  runs: 200,
  license: "MIT",
  sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingPool is ReentrancyGuard, Ownable {
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    
    function deposit() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdraw(msg.sender, amount);
    }
    
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}`,
  storageLayout: [
    { slot: 0, name: "_status", type: "uint256", size: 32 },
    { slot: 1, name: "_owner", type: "address", size: 20 },
    { slot: 2, name: "balances", type: "mapping(address => uint256)", size: 32 },
  ],
}

export default function ContractDetailPage({
  params,
}: {
  params: { chain: string; address: string }
}) {
  const contract = mockContractDetail
  const [copied, setCopied] = React.useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppShell breadcrumbs={[{ label: "Contracts", href: "/app/contracts" }, { label: contract.name }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link href="/app/contracts">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text">{contract.name}</h1>
                {contract.verified && <CheckCircle2 className="h-6 w-6 text-success" />}
                {contract.isProxy && (
                  <span className="rounded-md bg-accent/10 px-2 py-1 text-sm font-medium text-accent">
                    Proxy Contract
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <code className="rounded bg-surface-2 px-2 py-1 font-mono text-sm text-text-2">{contract.address}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(contract.address)}>
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
                <ChainBadge chain={contract.chain} />
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            View on Explorer
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <Tabs defaultValue="source">
              <TabsList>
                <TabsTrigger value="source">Source Code</TabsTrigger>
                <TabsTrigger value="storage">Storage Layout</TabsTrigger>
                <TabsTrigger value="abi">ABI</TabsTrigger>
                {contract.isProxy && <TabsTrigger value="proxy">Proxy Info</TabsTrigger>}
              </TabsList>

              <TabsContent value="source">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Source Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm text-text">
                      {contract.sourceCode}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="storage">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contract.storageLayout.map((item) => (
                        <div
                          key={item.slot}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-accent/10 px-2 py-1 font-mono text-xs text-accent">
                                Slot {item.slot}
                              </span>
                              <code className="font-mono text-sm font-medium text-text">{item.name}</code>
                            </div>
                            <p className="text-sm text-text-2">{item.type}</p>
                          </div>
                          <span className="text-sm text-text-2">{item.size} bytes</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="abi">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract ABI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm text-text">
                      {JSON.stringify(
                        [
                          {
                            type: "function",
                            name: "deposit",
                            inputs: [],
                            outputs: [],
                            stateMutability: "payable",
                          },
                          {
                            type: "function",
                            name: "withdraw",
                            inputs: [{ name: "amount", type: "uint256" }],
                            outputs: [],
                            stateMutability: "nonpayable",
                          },
                        ],
                        null,
                        2,
                      )}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              {contract.isProxy && (
                <TabsContent value="proxy">
                  <Card>
                    <CardHeader>
                      <CardTitle>Proxy Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-text-2">Implementation Address</p>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="rounded bg-surface-2 px-2 py-1 font-mono text-sm text-text">
                            {contract.implementation}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopy(contract.implementation!)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-text-2">Proxy Pattern</p>
                        <p className="mt-1 font-medium text-text">Transparent Upgradeable Proxy</p>
                      </div>
                      <div className="rounded-lg border border-warning bg-warning/5 p-4">
                        <p className="text-sm text-warning">
                          Warning: This is a proxy contract. Storage layout changes in upgrades can cause data
                          corruption.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium text-success">Verified</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-2">Compiler</span>
                    <span className="font-medium text-text">{contract.compiler}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-2">Optimization</span>
                    <span className="font-medium text-text">{contract.optimization ? "Enabled" : "Disabled"}</span>
                  </div>
                  {contract.optimization && (
                    <div className="flex justify-between">
                      <span className="text-text-2">Runs</span>
                      <span className="font-medium text-text">{contract.runs}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-2">License</span>
                    <span className="font-medium text-text">{contract.license}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/app/tools/diff">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Compare Versions
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  View Transactions
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Analyze Storage
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
