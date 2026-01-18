import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/leaderboard
 * Fetch global or weekly leaderboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'global'; // 'global' or 'weekly'
    const limit = parseInt(searchParams.get('limit') || '50');

    if (type === 'weekly') {
      // Weekly leaderboard: Most riddles solved in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyStats = await prisma.riddleAttempt.groupBy({
        by: ['userId'],
        where: {
          isCorrect: true,
          createdAt: {
            gte: weekAgo,
          },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: limit,
      });

      // Fetch user details
      const userIds = weeklyStats.map((s) => s.userId);
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          username: true,
          totalGems: true,
          currentStreak: true,
        },
      });

      const leaderboard = weeklyStats.map((stat, index) => {
        const user = users.find((u) => u.id === stat.userId);
        return {
          rank: index + 1,
          userId: stat.userId,
          username: user?.username || 'Unknown',
          riddlesSolved: stat._count.id,
          totalGems: user?.totalGems || 0,
          currentStreak: user?.currentStreak || 0,
        };
      });

      return NextResponse.json({ leaderboard, type: 'weekly' });
    } else {
      // Global leaderboard: By total gems
      const users = await prisma.user.findMany({
        orderBy: [
          { totalGems: 'desc' },
          { totalRiddlesSolved: 'desc' },
        ],
        take: limit,
        select: {
          id: true,
          username: true,
          totalGems: true,
          totalRiddlesSolved: true,
          currentStreak: true,
        },
      });

      const leaderboard = users.map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        username: user.username || 'Unknown',
        totalGems: user.totalGems,
        riddlesSolved: user.totalRiddlesSolved,
        currentStreak: user.currentStreak,
      }));

      return NextResponse.json({ leaderboard, type: 'global' });
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
