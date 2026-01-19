import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/utils/jwt';

/**
 * POST /api/auth/migrate-guest
 * Migrate guest user data to a real user account
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { guestId } = body;

    if (!guestId || !guestId.startsWith('guest_')) {
      return NextResponse.json(
        { error: 'Invalid guest ID' },
        { status: 400 }
      );
    }

    // Find guest user
    const guestUser = await prisma.user.findUnique({
      where: { id: guestId },
      include: {
        gameSessions: true,
        riddleAttempts: true,
        achievements: true,
      },
    });

    if (!guestUser) {
      return NextResponse.json({
        success: true,
        message: 'No guest data to migrate',
      });
    }

    // Migrate game session
    const guestSession = guestUser.gameSessions[0];
    if (guestSession) {
      await prisma.gameSession.upsert({
        where: { userId: user.userId },
        update: {
          // Merge solved riddles
          solvedRiddles: JSON.stringify([
            ...JSON.parse(guestSession.solvedRiddles || '[]'),
            ...JSON.parse(
              (await prisma.gameSession.findUnique({
                where: { userId: user.userId },
              }))?.solvedRiddles || '[]'
            ),
          ]),
          // Merge skipped riddles
          skippedRiddles: JSON.stringify([
            ...JSON.parse(guestSession.skippedRiddles || '[]'),
            ...JSON.parse(
              (await prisma.gameSession.findUnique({
                where: { userId: user.userId },
              }))?.skippedRiddles || '[]'
            ),
          ]),
          // Use higher gem count
          userGems: Math.max(
            guestSession.userGems,
            (await prisma.gameSession.findUnique({
              where: { userId: user.userId },
            }))?.userGems || 0
          ),
        },
        create: {
          userId: user.userId,
          currentRiddleId: guestSession.currentRiddleId,
          solvedRiddles: guestSession.solvedRiddles,
          skippedRiddles: guestSession.skippedRiddles,
          userGems: guestSession.userGems,
          currentLevel: guestSession.currentLevel,
          hintsUsed: guestSession.hintsUsed,
        },
      });
    }

    // Migrate riddle attempts
    await prisma.riddleAttempt.updateMany({
      where: { userId: guestId },
      data: { userId: user.userId },
    });

    // Migrate achievements
    await prisma.userAchievement.updateMany({
      where: { userId: guestId },
      data: { userId: user.userId },
    });

    // Update user stats (merge totals)
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        totalGems: {
          increment: guestUser.totalGems,
        },
        totalRiddlesSolved: {
          increment: guestUser.totalRiddlesSolved,
        },
        currentStreak: Math.max(
          (await prisma.user.findUnique({
            where: { id: user.userId },
          }))?.currentStreak || 0,
          guestUser.currentStreak
        ),
      },
    });

    // Delete guest user (cascade will clean up related data)
    await prisma.user.delete({
      where: { id: guestId },
    });

    return NextResponse.json({
      success: true,
      message: 'Guest data migrated successfully',
    });
  } catch (error) {
    console.error('Error migrating guest data:', error);
    return NextResponse.json(
      { error: 'Failed to migrate guest data' },
      { status: 500 }
    );
  }
}
