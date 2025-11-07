"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight } from "lucide-react"

const leftCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LendingPool {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount);
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        
        balances[msg.sender] -= amount;
    }
}`

const rightCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LendingPool is ReentrancyGuard {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}`

export default function DiffViewerPage() {
  const [view, setView] = React.useState<"split" | "unified">("split")

  return (
    <AppShell breadcrumbs={[{ label: "Tools" }, { label: "Diff Viewer" }]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Diff Viewer</h1>
            <p className="text-text-2">Compare contract versions and changes</p>
          </div>
          <div className="flex gap-2">
            <Button variant={view === "split" ? "default" : "outline"} onClick={() => setView("split")}>
              Split View
            </Button>
            <Button variant={view === "unified" ? "default" : "outline"} onClick={() => setView("unified")}>
              Unified View
            </Button>
          </div>
        </div>

        {/* Version Selectors */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select defaultValue="v1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">Version 1 (Vulnerable)</SelectItem>
                    <SelectItem value="v2">Version 2 (Fixed)</SelectItem>
                    <SelectItem value="deployed">Deployed Version</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ArrowLeftRight className="h-5 w-5 text-muted" />
              <div className="flex-1">
                <Select defaultValue="v2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">Version 1 (Vulnerable)</SelectItem>
                    <SelectItem value="v2">Version 2 (Fixed)</SelectItem>
                    <SelectItem value="deployed">Deployed Version</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diff View */}
        <Card>
          <CardHeader>
            <CardTitle>Code Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {view === "split" ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">Version 1 (Vulnerable)</span>
                    <span className="rounded bg-error/10 px-2 py-1 text-xs font-medium text-error">Before</span>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm">
                    <code className="text-text">{leftCode}</code>
                  </pre>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">Version 2 (Fixed)</span>
                    <span className="rounded bg-success/10 px-2 py-1 text-xs font-medium text-success">After</span>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm">
                    <code className="text-text">{rightCode}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm">
                  <code>
                    <div className="text-text">// SPDX-License-Identifier: MIT</div>
                    <div className="text-text">pragma solidity ^0.8.19;</div>
                    <div className="text-text">{"\n"}</div>
                    <div className="bg-success/10 text-success">
                      + import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
                    </div>
                    <div className="text-text">{"\n"}</div>
                    <div className="bg-error/10 text-error">- contract LendingPool {"{"}</div>
                    <div className="bg-success/10 text-success">+ contract LendingPool is ReentrancyGuard {"{"}</div>
                    <div className="text-text">{"    "}mapping(address =&gt; uint256) public balances;</div>
                    <div className="text-text">{"\n"}</div>
                    <div className="bg-error/10 text-error">
                      - {"    "}function withdraw(uint256 amount) external {"{"}
                    </div>
                    <div className="bg-success/10 text-success">
                      + {"    "}function withdraw(uint256 amount) external nonReentrant {"{"}
                    </div>
                    <div className="bg-error/10 text-error">
                      - {"        "}require(balances[msg.sender] &gt;= amount);
                    </div>
                    <div className="bg-success/10 text-success">
                      + {"        "}require(balances[msg.sender] &gt;= amount, "Insufficient balance");
                    </div>
                    <div className="text-text">{"\n"}</div>
                    <div className="bg-success/10 text-success">+ {"        "}balances[msg.sender] -= amount;</div>
                    <div className="text-text">{"\n"}</div>
                    <div className="text-text">
                      {"        "}(bool success, ) = msg.sender.call{"{"}value: amount{"}"}("");
                    </div>
                    <div className="bg-error/10 text-error">- {"        "}require(success);</div>
                    <div className="bg-success/10 text-success">+ {"        "}require(success, "Transfer failed");</div>
                    <div className="text-text">{"\n"}</div>
                    <div className="bg-error/10 text-error">- {"        "}balances[msg.sender] -= amount;</div>
                    <div className="text-text">{"    }"}</div>
                    <div className="text-text">{"}"}</div>
                  </code>
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Change Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-success bg-success/5 p-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-success" />
                <div className="flex-1">
                  <p className="font-medium text-text">Added ReentrancyGuard</p>
                  <p className="text-sm text-text-2">
                    Imported and inherited OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-success bg-success/5 p-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-success" />
                <div className="flex-1">
                  <p className="font-medium text-text">Fixed checks-effects-interactions pattern</p>
                  <p className="text-sm text-text-2">Moved balance update before external call to prevent reentrancy</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-success bg-success/5 p-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-success" />
                <div className="flex-1">
                  <p className="font-medium text-text">Improved error messages</p>
                  <p className="text-sm text-text-2">Added descriptive error messages to require statements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
