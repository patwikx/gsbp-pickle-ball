import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/reset-password']

  // If it's a public route, allow access regardless of authentication status
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // If it's an auth page and the user is already logged in, redirect to dashboard
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If it's not an auth page and the user is not logged in, redirect to sign-in
  if (!pathname.startsWith('/auth') && !session) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // For all other cases, continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}