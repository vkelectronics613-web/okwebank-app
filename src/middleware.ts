import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;
  
  // Paths that anyone can see (including the secret admin vault)
  const publicPaths = ['/', '/login', '/register', '/management-vault-99'];
  // Paths that logged-in users should NOT see
  const authOnlyPaths = ['/login', '/register'];

  // Skip proxy for static files and internal next files
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. If not logged in and trying to access a private page
  if (!session && !publicPaths.includes(pathname) && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If logged in and trying to access login/register, send to home (dashboard)
  if (session && authOnlyPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
