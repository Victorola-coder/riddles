import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';

// Paths that require authentication
// Allow `/game` for guest play; keep profile protected
const PROTECTED_PATHS = ['/profile'];
const ADMIN_PATHS = ['/admin'];
const PUBLIC_PATHS = ['/login', '/signup', '/auth', '/verify-email', '/forgot-password', '/reset-password', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') || // Files like favicon.ico
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // Check auth for protected paths
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));

  // If no token and accessing protected route, redirect to login
  if ((isProtected || isAdminPath) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If token exists, verify it (basic check, full verification happens on API/Page)
  if (token) {
    try {
      const payload = await verifyToken(token);
      
      if (!payload) {
        // Invalid token
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }

      // If accessing admin routes, check for admin privileges (if role was in token)
      // Since we don't have roles in token yet, we'll skip this strict check for now
      // or implement a basic check if we add role to JWT
    } catch (error) {
      // Token verification failed
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
