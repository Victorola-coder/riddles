import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS configuration helper
 * Adds CORS headers to API responses
 */
export function addCorsHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get('origin');
  const isDev = process.env.NODE_ENV === 'development';
  
  // In development, allow all origins; in production, use specific origin
  const allowedOrigin = isDev 
    ? origin || '*'
    : process.env.NEXT_PUBLIC_APP_URL || origin || '*';

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

/**
 * Handle CORS preflight requests (OPTIONS)
 */
export function handleCorsPreflight(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response, request);
  }
  return null;
}

/**
 * Wrapper for API route responses to add CORS headers
 * Use this in API routes: return withCors(NextResponse.json(data), request)
 */
export function withCors<T extends NextResponse>(
  response: T,
  request: NextRequest
): T {
  return addCorsHeaders(response, request) as T;
}
