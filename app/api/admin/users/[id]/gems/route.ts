import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth-token';
import { logAdminAction } from '@/lib/activity-logger';

/**
 * POST /api/admin/users/[id]/gems
 * Add or deduct gems from a user
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;
  
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyAuthToken(token);
    if (!decoded || (decoded.type !== 'admin' && decoded.userId !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, reason } = body;

    // Validation
    if (typeof amount !== 'number' || !reason) {
      return NextResponse.json(
        { error: 'Amount (number) and reason (string) are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate new gem total (ensure it doesn't go below 0)
    const newGemTotal = Math.max(0, user.totalGems + amount);

    // Update user gems
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { totalGems: newGemTotal },
    });

    // Also update game session if exists
    const session = await prisma.gameSession.findUnique({
      where: { userId },
    });

    if (session) {
      await prisma.gameSession.update({
        where: { userId },
        data: { userGems: newGemTotal },
      });
    }

    // Log admin action
    await logAdminAction(
      'gem_adjustment',
      `${amount > 0 ? 'Added' : 'Deducted'} ${Math.abs(amount)} gems ${amount > 0 ? 'to' : 'from'} user ${user.username || user.email || userId}`,
      {
        userId,
        amount,
        reason,
        previousGems: user.totalGems,
        newGems: newGemTotal,
      }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        totalGems: updatedUser.totalGems,
      },
      message: `Successfully ${amount > 0 ? 'added' : 'deducted'} ${Math.abs(amount)} gems`,
    });
  } catch (error) {
    console.error('Failed to adjust gems:', error);
    return NextResponse.json(
      { error: 'Failed to adjust gems' },
      { status: 500 }
    );
  }
}
