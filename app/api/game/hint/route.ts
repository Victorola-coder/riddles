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

    // Compute a consistent hint based on level
    // 1 => First letter of the primary answer (or custom hint1 override)
    // 2 => Word length (e.g. "7 letters") (or custom hint2 override)
    // 3 => Full answer reveal
    const answers = JSON.parse(riddle.answer as string) as string[];
    const primaryAnswer = (answers[0] || "").trim();

    let hint = "";
    if (hintLevel === 1) {
      // Prefer explicit hint1 if provided, otherwise first letter
      if (riddle.hint1 && riddle.hint1.trim().length > 0) {
        hint = riddle.hint1.trim();
      } else if (primaryAnswer) {
        hint = primaryAnswer.charAt(0).toUpperCase();
      }
    } else if (hintLevel === 2) {
      // Prefer explicit hint2 if provided, otherwise word length description
      if (riddle.hint2 && riddle.hint2.trim().length > 0) {
        hint = riddle.hint2.trim();
      } else if (primaryAnswer) {
        const length = primaryAnswer.replace(/\s/g, '').length;
        hint = `${length} letter${length !== 1 ? 's' : ''}`;
      }
    } else if (hintLevel === 3) {
      // Full answer reveal
      hint = primaryAnswer ? `The answer is: ${primaryAnswer}` : '';
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
