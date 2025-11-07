"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSearch } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const { isAuthenticated, signIn, isLoading } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/app/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      await signIn(email, password)
      router.push("/app/dashboard")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
      console.error("Sign in error:", err)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <FileSearch className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">Welcome to AuditSys</h1>
          <p className="text-text-2">Sign in to your account to continue</p>
        </div>

        {/* Sign in card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="auditor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-error bg-error/10 p-3 text-sm text-error">{error}</div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <div className="rounded-lg border border-border bg-surface-1 p-4 text-sm text-text-2">
          <p className="mb-2 font-medium text-text">Demo Credentials</p>
          <p className="font-mono text-xs">
            Email: demo@auditsys.io
            <br />
            Password: demo123
          </p>
        </div>
      </div>
    </div>
  )
}
