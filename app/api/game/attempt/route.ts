import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/utils/jwt';
import { gameLimiter } from '@/lib/rate-limit';

/**
 * POST /api/game/attempt
 * Record a riddle attempt (correct or incorrect)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      riddleId,
      isCorrect,
      answerGiven,
      hintsUsed = [],
      gemsEarned = 0,
      gemsSpent = 0,
      timeSpent,
    } = body;

    // Create riddle attempt record
    const attempt = await prisma.riddleAttempt.create({
      data: {
        userId,
        riddleId,
        isCorrect,
        answerGiven,
        hintsUsed: JSON.stringify(hintsUsed),
        gemsEarned,
        gemsSpent,
        timeSpent,
      },
    });

    // If correct, update user stats
    if (isCorrect) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalRiddlesSolved: { increment: 1 },
          totalGems: { increment: gemsEarned },
        },
      });
    }

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error('Error recording attempt:', error);
    return NextResponse.json(
      { error: 'Failed to record attempt' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/game/attempt
 * Get user's attempt history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const riddleId = searchParams.get('riddleId');

    // Rate Limiting
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset, remaining } = gameLimiter.check(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please slow down." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString()
          }
        }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const where: any = { userId };
    if (riddleId) {
      where.riddleId = riddleId;
    }

    const attempts = await prisma.riddleAttempt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      attempts: attempts.map((a) => ({
        ...a,
        hintsUsed: JSON.parse(a.hintsUsed),
      })),
    });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    );
  }
}
