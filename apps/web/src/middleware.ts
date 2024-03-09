import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth/get-session'

const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password']
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getSession()

  const isAuthRoute = authRoutes.some((path) =>
    request.nextUrl.pathname.includes(path),
  )

  if (isAuthRoute) {
    return session
      ? NextResponse.redirect(new URL('/', request.nextUrl.origin))
      : NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
