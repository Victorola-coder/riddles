import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth-token';
import { logAdminAction } from '@/lib/activity-logger';

/**
 * GET /api/admin/users/[id]
 * Get detailed user information
 */
export async function GET(
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

    // Get user with related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        riddleAttempts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            riddle: {
              select: {
                question: true,
                difficulty: true,
              },
            },
          },
        },
        gameSessions: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        totalGems: user.totalGems,
        totalRiddlesSolved: user.totalRiddlesSolved,
        currentStreak: user.currentStreak,
        currentLevel: user.currentLevel,
        lastPlayedDate: user.lastPlayedDate,
        createdAt: user.createdAt,
        recentAttempts: user.riddleAttempts,
        session: user.gameSessions?.[0], // Get first session if exists
      },
    });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update user (ban, reset progress, etc.)
 */
export async function PATCH(
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
    const { action, ...data } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let updatedUser;
    let actionDescription = '';

    switch (action) {
      case 'reset_progress':
        // Reset user progress
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            totalRiddlesSolved: 0,
            currentStreak: 0,
            currentLevel: 1,
            totalGems: 50, // Reset to initial gems
          },
        });

        // Reset game session
        await prisma.gameSession.updateMany({
          where: { userId },
          data: {
            solvedRiddles: '[]',
            skippedRiddles: '[]',
            userGems: 50,
            currentLevel: 1,
            hintsUsed: '{}',
          },
        });

        // Delete all attempts
        await prisma.riddleAttempt.deleteMany({
          where: { userId },
        });

        actionDescription = `Reset progress for user ${user.username || user.email || userId}`;
        break;

      case 'update':
        // Generic update
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data,
        });
        actionDescription = `Updated user ${user.username || user.email || userId}`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Log admin action
    await logAdminAction(action, actionDescription, {
      userId,
      action,
      data,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user account
 */
export async function DELETE(
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user and all related data (cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Log admin action
    await logAdminAction(
      'user_deleted',
      `Deleted user ${user.username || user.email || userId}`,
      { userId, username: user.username, email: user.email }
    );

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
