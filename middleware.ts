import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/utils/cors';

/**
 * Middleware - handles CORS and basic routing
 * Authentication is handled client-side via API calls
 * Token management is done in localStorage (client-side only)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight requests for API routes
  if (pathname.startsWith('/api')) {
    const preflightResponse = handleCorsPreflight(request);
    if (preflightResponse) {
      return preflightResponse;
    }

    // Add CORS headers to all API responses
    const response = NextResponse.next();
    return addCorsHeaders(response, request);
  }

  // Allow all other requests - authentication is handled client-side
  // API routes handle their own authentication via Authorization header
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths including API routes for CORS handling
     * Exclude:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
