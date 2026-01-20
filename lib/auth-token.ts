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
 * Returns the userId if valid, null otherwise
 */
export function verifyAuthToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type?: string };
    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId as string;
  } catch (error) {
    return null;
  }
}
