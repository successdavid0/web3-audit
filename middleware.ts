import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const isAuthPage = request.nextUrl.pathname === "/sign-in"
  const isAppRoute = request.nextUrl.pathname.startsWith("/app")

  // Redirect to sign-in if accessing app routes without session
  if (isAppRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // Redirect to dashboard if accessing sign-in with active session
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*", "/sign-in"],
}
