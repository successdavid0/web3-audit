import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) {
    return NextResponse.json({ isAuthenticated: false, user: null })
  }

  try {
    const data = JSON.parse(session)
    return NextResponse.json({
      isAuthenticated: data.isAuthenticated || false,
      user: {
        email: data.email,
        name: data.name,
      },
    })
  } catch {
    return NextResponse.json({ isAuthenticated: false, user: null })
  }
}
