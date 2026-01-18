import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  username?: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from request headers
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

/**
 * Get user from request token
 */
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

/**
 * Generate password reset token
 */
export function generateResetToken(email: string): string {
  return jwt.sign({ email, type: 'reset' }, JWT_SECRET, {
    expiresIn: '1h', // Reset token expires in 1 hour
  });
}

/**
 * Verify password reset token
 */
export function verifyResetToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    
    if (decoded.type !== 'reset') {
      return null;
    }
    
    return { email: decoded.email };
  } catch (error) {
    return null;
  }
}

/**
 * Generate email verification token
 */
export function generateVerificationToken(email: string): string {
  return jwt.sign({ email, type: 'verify' }, JWT_SECRET, {
    expiresIn: '24h', // Verification token expires in 24 hours
  });
}

/**
 * Verify email verification token
 */
export function verifyVerificationToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    
    if (decoded.type !== 'verify') {
      return null;
    }
    
    return { email: decoded.email };
  } catch (error) {
    return null;
  }
}
