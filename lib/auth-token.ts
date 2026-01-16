import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Sign an authentication token
 */
export function signAuthToken(userId: string, expiresIn: string = '7d'): string {
  return jwt.sign({ userId, type: 'admin' }, JWT_SECRET, {
    expiresIn,
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
