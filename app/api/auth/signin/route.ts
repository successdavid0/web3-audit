import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const DEMO_USERS = [
  { email: "demo@auditsys.io", password: "demo123", name: "Demo Auditor" },
  { email: "admin@auditsys.io", password: "admin123", name: "Admin User" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const sessionData = {
      email: user.email,
      name: user.name,
      isAuthenticated: true,
    }

    // Set httpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({ user: { email: user.email, name: user.name } })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
