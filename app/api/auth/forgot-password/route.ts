import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateResetToken } from '@/lib/utils/jwt';
import { sendPasswordResetEmail } from '@/lib/utils/email';

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = generateResetToken(email);

    const resetLink = `${
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }/reset-password?token=${resetToken}`;

    // Send email (falls back to console logging in dev if SMTP isn't configured)
    await sendPasswordResetEmail({
      to: email,
      resetLink,
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
      // Only expose resetLink in development for easier testing
      resetLink:
        process.env.NODE_ENV === 'development' ? resetLink : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
