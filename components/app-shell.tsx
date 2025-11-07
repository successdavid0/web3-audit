"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@/components/user-button"
import { CommandMenu } from "@/components/command-menu"
import {
  LayoutDashboard,
  FileSearch,
  AlertTriangle,
  FileText,
  Wrench,
  Code2,
  Users,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Audits", href: "/app/audits", icon: FileSearch },
  { name: "Findings", href: "/app/findings", icon: AlertTriangle },
  { name: "Reports", href: "/app/reports", icon: FileText },
  { name: "Tools", href: "/app/tools", icon: Wrench },
  { name: "Contracts", href: "/app/contracts", icon: Code2 },
  { name: "Organization", href: "/app/org", icon: Users },
]

interface AppShellProps {
  children: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function AppShell({ children, breadcrumbs }: AppShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-surface-1 border-r border-border transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link href="/app/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <FileSearch className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-text">AuditSys</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-white" : "text-text-2 hover:bg-surface-2 hover:text-text",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2 text-xs text-muted">
              <div className="h-2 w-2 rounded-full bg-success" />
              All systems operational
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface-1 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <ChevronRight className="h-4 w-4 text-muted" />}
                    {crumb.href ? (
                      <Link href={crumb.href} className="text-text-2 hover:text-text">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-text">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            <CommandMenu />
            <ThemeToggle />
            <UserButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
