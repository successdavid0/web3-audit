"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Search, FileSearch, AlertTriangle, FileText, Plus } from "lucide-react"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2 text-muted-foreground">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-surface-2 px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => router.push("/app/audits/new"))}>
              <Plus className="mr-2 h-4 w-4" />
              New Audit
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/app/findings/new"))}>
              <Plus className="mr-2 h-4 w-4" />
              New Finding
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/app/dashboard"))}>
              <FileSearch className="mr-2 h-4 w-4" />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/app/audits"))}>
              <FileSearch className="mr-2 h-4 w-4" />
              Audits
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/app/findings"))}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Findings
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/app/reports"))}>
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
