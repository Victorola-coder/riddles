import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logHintUsed } from '@/lib/activity-logger';
import { GAME_CONFIG } from '@/lib/constants/game-config';

/**
 * POST /api/game/hint
 * Body: { userId: string, riddleId: string, hintLevel: 1 | 2 | 3 }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, riddleId, hintLevel } = body;

    if (!userId || !riddleId || !hintLevel) {
      return NextResponse.json(
        { error: 'userId, riddleId, and hintLevel are required' },
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

    // Get user
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

    // Calculate cost
    const costKey = `hint${hintLevel}` as keyof typeof GAME_CONFIG.GEM_COSTS;
    const gemsSpent = GAME_CONFIG.GEM_COSTS[costKey];

    if (user.totalGems < gemsSpent) {
      return NextResponse.json(
        { error: 'Not enough gems' },
        { status: 400 }
      );
    }

    // Get hint
    let hint = '';
    if (hintLevel === 1) {
      hint = riddle.hint1 || '';
    } else if (hintLevel === 2) {
      hint = riddle.hint2 || '';
    } else if (hintLevel === 3) {
      const answers = JSON.parse(riddle.answer as string) as string[];
      hint = `The answer is: ${answers[0]}`;
    }

    // Deduct gems
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalGems: { decrement: gemsSpent },
      },
    });

    // Update game session
    const session = await prisma.gameSession.findUnique({
      where: { userId },
    });

    if (session) {
      // Parse hintsUsed JSON (stored as string in SQLite)
      const hintsUsedStr = typeof session.hintsUsed === 'string' 
        ? session.hintsUsed 
        : JSON.stringify(session.hintsUsed || {});
      const hintsUsed = JSON.parse(hintsUsedStr || '{}') as Record<string, number[]>;
      const riddleHints = hintsUsed[riddleId] || [];
      
      if (!riddleHints.includes(hintLevel)) {
        hintsUsed[riddleId] = [...riddleHints, hintLevel];
        await prisma.gameSession.update({
          where: { userId },
          data: {
            hintsUsed: JSON.stringify(hintsUsed),
            userGems: { decrement: gemsSpent },
            lastActivityAt: new Date(),
          },
        });
      }
    }

    // Log activity
    await logHintUsed(userId, riddleId, hintLevel, gemsSpent);

    return NextResponse.json(
      {
        hint,
        gemsSpent,
        remainingGems: user.totalGems - gemsSpent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to process hint:', error);
    return NextResponse.json(
      { error: 'Failed to process hint' },
      { status: 500 }
    );
  }
}
