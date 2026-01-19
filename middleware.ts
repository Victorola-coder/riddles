import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Minimal middleware - only handles basic routing
 * Authentication is handled client-side via API calls
 * Token management is done in localStorage (client-side only)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all requests - authentication is handled client-side
  // API routes handle their own authentication via Authorization header
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
