import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Sign an authentication token
 */
export function signAuthToken(userId: string, expiresIn: string = '7d'): string {
  return jwt.sign({ userId, type: 'admin' }, JWT_SECRET, {
    expiresIn: expiresIn as any,
  });
}

/**
 * Verify an authentication token
 */
export function verifyAuthToken(token: string): { userId: string; type?: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type?: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract and verify a Bearer token from a request-like object.
 * Used by API routes that accept `Authorization: Bearer <token>`.
 */
export function getAuthToken(req: {
  headers: { get: (name: string) => string | null };
}): { userId: string; type?: string } | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return null;
  return verifyAuthToken(token);
}
