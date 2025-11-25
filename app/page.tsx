import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, FileSearch, CheckCircle2, Clock, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background">
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
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 leading-6 lg:py-[78px]">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              Professional Web3 Security Audits
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tight lg:text-6xl">
              Submit your smart contract for security audit
            </h1>
            <p className="text-pretty text-xl text-muted-foreground">
              Get comprehensive security analysis for your Web3 project. Our expert auditors review your smart
              contracts, identify vulnerabilities, and provide detailed reports.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/submit-audit">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View Submissions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple process to get your smart contracts audited by security experts
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileSearch className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">1. Submit Details</h3>
              <p className="text-muted-foreground">
                Fill out our comprehensive form with your project details, contract addresses, and audit requirements.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">2. Review Process</h3>
              <p className="text-muted-foreground">
                Our team reviews your submission and assigns expert auditors to analyze your smart contracts.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">3. Get Report</h3>
              <p className="text-muted-foreground">
                Receive a detailed security report with findings, recommendations, and remediation guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold">Ready to secure your smart contracts?</h2>
            <p className="text-lg text-muted-foreground">
              Submit your audit request today and get expert security analysis from our team of professionals.
            </p>
            <Link href="/submit-audit">
              <Button size="lg" className="gap-2">
                Submit Audit Request
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
    </div>
  )
}
