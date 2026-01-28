import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken } from '@/lib/auth-token';

/**
 * GET /api/daily-challenge
 * Get today's daily challenge and user's entry status
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const userId = token?.userId;

    // Get today's date (UTC, date-only)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Find today's challenge
    const challenge = await prisma.dailyChallenge.findUnique({
      where: { date: today },
      include: {
        riddle: {
          select: {
            id: true,
            question: true,
            difficulty: true,
            category: true,
            hint1: true,
            hint2: true,
            tags: true,
            answer: true, // Include answer for validation
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json({
        challenge: null,
        userEntry: null,
        userStreak: userId ? await getUserDailyStreak(userId) : 0,
      });
    }

    // Get user's entry if authenticated
    let userEntry = null;
    let userStreak = 0;

    if (userId) {
      userEntry = await prisma.dailyChallengeEntry.findUnique({
        where: {
          dailyChallengeId_userId: {
            dailyChallengeId: challenge.id,
            userId,
          },
        },
      });

      userStreak = await getUserDailyStreak(userId);
    }

    // Parse answer for client-side validation
    const riddle = {
      ...challenge.riddle,
      answer: challenge.riddle.answer
        ? JSON.parse(challenge.riddle.answer as string)
        : null,
      tags: challenge.riddle.tags
        ? JSON.parse(challenge.riddle.tags as string)
        : [],
    };

    return NextResponse.json({
      challenge: {
        id: challenge.id,
        riddleId: challenge.riddleId,
        riddle,
        date: todayStr,
        bonusGems: challenge.bonusGems,
      },
      userEntry: userEntry
        ? {
            id: userEntry.id,
            userId: userEntry.userId,
            solveTimeMs: userEntry.solveTimeMs,
            isCorrect: userEntry.isCorrect,
            completedAt: userEntry.completedAt.toISOString(),
          }
        : null,
      userStreak,
    });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily challenge' },
      { status: 500 }
    );
  }
}

/**
 * Helper: Get user's current daily challenge streak
 */
async function getUserDailyStreak(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { dailyChallengeStreak: true },
  });

  return user?.dailyChallengeStreak || 0;
}
