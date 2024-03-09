import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession, sessionIsExpired } from './lib/auth/manage-session'

const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password']
export async function middleware(request: NextRequest) {
  const isAuthRoute = authRoutes.some((path) =>
    request.nextUrl.pathname.includes(path),
  )
  const isExpired = await sessionIsExpired()

  if (isExpired && !isAuthRoute) {
    return NextResponse.redirect(
      new URL('/auth/sign-in', request.nextUrl.origin),
    )
  }

  const session = await getSession()

  if (isAuthRoute) {
    return session
      ? NextResponse.redirect(new URL('/', request.nextUrl.origin))
      : NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
