import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken } from '@/lib/auth-token';
import { validateAnswer } from '@/lib/utils/riddle-validator';
import { DAILY_CHALLENGE_CONFIG, getStreakBonus } from '@/lib/constants/daily-challenge';
import { GAME_CONFIG } from '@/lib/constants/game-config';
import type { DifficultyLevel } from '@/types/riddle';

/**
 * POST /api/daily-challenge/submit
 * Submit answer for today's daily challenge
 */
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answer } = await request.json();
    if (!answer || typeof answer !== 'string') {
      return NextResponse.json(
        { error: 'Answer is required' },
        { status: 400 }
      );
    }

    const userId = token.userId;
    const startTime = Date.now();

    // Get today's challenge
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const challenge = await prisma.dailyChallenge.findUnique({
      where: { date: today },
      include: {
        riddle: true,
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'No daily challenge available today' },
        { status: 404 }
      );
    }

    // Check if user already submitted
    const existingEntry = await prisma.dailyChallengeEntry.findUnique({
      where: {
        dailyChallengeId_userId: {
          dailyChallengeId: challenge.id,
          userId,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'You have already submitted for today' },
        { status: 400 }
      );
    }

    // Validate answer
    const riddleAnswer = challenge.riddle.answer
      ? JSON.parse(challenge.riddle.answer as string)
      : challenge.riddle.answer;
    const isCorrect = validateAnswer(answer, {
      id: challenge.riddle.id,
      question: challenge.riddle.question,
      difficulty: challenge.riddle.difficulty as DifficultyLevel,
      category: challenge.riddle.category ?? undefined,
      hint1: challenge.riddle.hint1 ?? undefined,
      hint2: challenge.riddle.hint2 ?? undefined,
      tags: challenge.riddle.tags ? JSON.parse(challenge.riddle.tags as string) : [],
      answer: riddleAnswer,
    });

    const solveTimeMs = Date.now() - startTime;

    // Get user's current streak
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyChallengeStreak: true, totalGems: true },
    });

    const currentStreak = user?.dailyChallengeStreak || 0;

    // Calculate rewards
    let gemsEarned = 0;
    let streakBonus = 0;
    let newStreak = currentStreak;

    if (isCorrect) {
      // Base reward from difficulty
      const baseGems =
        GAME_CONFIG.GEM_REWARDS[
          challenge.riddle.difficulty as 'easy' | 'medium' | 'hard'
        ] || 20;

      // Base bonus from daily challenge
      gemsEarned = baseGems + challenge.bonusGems + DAILY_CHALLENGE_CONFIG.BASE_BONUS;

      // Streak bonus
      newStreak = currentStreak + 1;
      streakBonus = getStreakBonus(newStreak);
      gemsEarned += streakBonus;

      // Update user streak and gems in transaction
      await prisma.$transaction([
        prisma.dailyChallengeEntry.create({
          data: {
            dailyChallengeId: challenge.id,
            userId,
            solveTimeMs,
            isCorrect: true,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            dailyChallengeStreak: newStreak,
            totalGems: {
              increment: gemsEarned,
            },
            totalRiddlesSolved: {
              increment: 1,
            },
          },
        }),
        // Update game session gems
        prisma.gameSession.upsert({
          where: { userId },
          create: {
            userId,
            userGems: gemsEarned,
          },
          update: {
            userGems: {
              increment: gemsEarned,
            },
          },
        }),
      ]);
    } else {
      // Record incorrect attempt
      await prisma.dailyChallengeEntry.create({
        data: {
          dailyChallengeId: challenge.id,
          userId,
          solveTimeMs: null,
          isCorrect: false,
        },
      });

      // Reset streak on incorrect answer
      if (currentStreak > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            dailyChallengeStreak: 0,
          },
        });
      }
    }

    return NextResponse.json({
      isCorrect,
      gemsEarned,
      streakBonus,
      newStreak,
      solveTimeMs: isCorrect ? solveTimeMs : undefined,
    });
  } catch (error) {
    console.error('Error submitting daily challenge:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
