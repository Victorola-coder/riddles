import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logRiddleSolved } from '@/lib/activity-logger';
import { GAME_CONFIG } from '@/lib/constants/game-config';

/**
 * POST /api/game/solve
 * Body: { userId: string, riddleId: string, answer: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, riddleId, answer } = body;

    if (!userId || !riddleId || !answer) {
      return NextResponse.json(
        { error: 'userId, riddleId, and answer are required' },
        { status: 400 }
      );
    }

    // Get riddle
    const riddle = await prisma.riddle.findUnique({
      where: { id: riddleId },
    });

    if (!riddle) {
      return NextResponse.json({ error: 'Riddle not found' }, { status: 404 });
    }

    // Parse answer array
    const correctAnswers = JSON.parse(riddle.answer as string) as string[];
    const isCorrect = correctAnswers.some(
      (correctAnswer) =>
        answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    );

    // Calculate gems
    const gemsEarned = isCorrect
      ? GAME_CONFIG.GEM_REWARDS[riddle.difficulty as 'easy' | 'medium' | 'hard']
      : 0;

    // Get or create user
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          totalGems: GAME_CONFIG.INITIAL_GEMS,
          currentLevel: 1,
        },
      });
    }

    // Record attempt
    await prisma.riddleAttempt.create({
      data: {
        userId,
        riddleId,
        isCorrect,
        answerGiven: answer,
        gemsEarned,
        gemsSpent: 0,
      },
    });

    if (isCorrect) {
      // Update user stats
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalGems: { increment: gemsEarned },
          totalRiddlesSolved: { increment: 1 },
          lastPlayedDate: new Date(),
        },
      });

      // Update or create game session
      const existingSession = await prisma.gameSession.findUnique({
        where: { userId },
      });

      if (existingSession) {
        // Parse existing solved riddles JSON string
        const solvedRiddles = JSON.parse(existingSession.solvedRiddles || '[]') as string[];
        solvedRiddles.push(riddleId);
        
        await prisma.gameSession.update({
          where: { userId },
          data: {
            solvedRiddles: JSON.stringify(solvedRiddles),
            userGems: { increment: gemsEarned },
            lastActivityAt: new Date(),
          },
        });
      } else {
        await prisma.gameSession.create({
          data: {
            userId,
            solvedRiddles: JSON.stringify([riddleId]),
            userGems: user.totalGems + gemsEarned,
            currentLevel: 1,
          },
        });
      }

      // Log activity
      await logRiddleSolved(userId, riddleId, gemsEarned);
    }

    return NextResponse.json(
      {
        correct: isCorrect,
        gemsEarned,
        message: isCorrect ? 'Correct! 🎉' : 'Incorrect. Try again!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to process solve:', error);
    return NextResponse.json(
      { error: 'Failed to process solve' },
      { status: 500 }
    );
  }
}
