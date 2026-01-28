import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DAILY_CHALLENGE_CONFIG } from '@/lib/constants/daily-challenge';

/**
 * GET /api/daily-challenge/leaderboard
 * Get today's daily challenge leaderboard (fastest solvers)
 */
export async function GET(request: NextRequest) {
  try {
    // Get today's date
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find today's challenge
    const challenge = await prisma.dailyChallenge.findUnique({
      where: { date: today },
    });

    if (!challenge) {
      return NextResponse.json({
        entries: [],
        totalEntries: 0,
      });
    }

    // Get correct entries sorted by solve time
    const entries = await prisma.dailyChallengeEntry.findMany({
      where: {
        dailyChallengeId: challenge.id,
        isCorrect: true,
        solveTimeMs: {
          not: null,
          lte: DAILY_CHALLENGE_CONFIG.MAX_SOLVE_TIME_MS,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        solveTimeMs: 'asc', // Fastest first
      },
      take: DAILY_CHALLENGE_CONFIG.LEADERBOARD_LIMIT,
    });

    const totalEntries = await prisma.dailyChallengeEntry.count({
      where: {
        dailyChallengeId: challenge.id,
        isCorrect: true,
      },
    });

    return NextResponse.json({
      entries: entries.map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId,
        username: entry.user.username,
        solveTimeMs: entry.solveTimeMs!,
        completedAt: entry.completedAt.toISOString(),
      })),
      totalEntries,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
