import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/game/session
 * Fetch or create a game session for the user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    // If no userId provided, treat as guest and generate a guest ID
    // Note: In production, guest ID should come from client-side localStorage
    if (!userId || userId === 'guest') {
      // Generate a guest ID: guest_<timestamp>_<random>
      userId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const isGuest = userId.startsWith('guest_');
      user = await prisma.user.create({
        data: {
          id: userId,
          username: isGuest 
            ? `Guest_${userId.slice(-8)}` 
            : `Player_${userId.slice(0, 8)}`,
          totalGems: 50,
        },
      });
    }

    // Find or create game session
    let session = await prisma.gameSession.findUnique({
      where: { userId },
    });

    if (!session) {
      session = await prisma.gameSession.create({
        data: {
          userId,
          userGems: 50,
        },
      });
    }

    return NextResponse.json({
      user,
      session: {
        ...session,
        solvedRiddles: JSON.parse(session.solvedRiddles),
        skippedRiddles: JSON.parse(session.skippedRiddles),
        hintsUsed: session.hintsUsed ? JSON.parse(session.hintsUsed) : {},
      },
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/game/session
 * Update game session state
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      currentRiddleId,
      solvedRiddles,
      skippedRiddles,
      userGems,
      currentLevel,
      hintsUsed,
    } = body;

    const session = await prisma.gameSession.update({
      where: { userId },
      data: {
        currentRiddleId,
        solvedRiddles: JSON.stringify(solvedRiddles || []),
        skippedRiddles: JSON.stringify(skippedRiddles || []),
        userGems,
        currentLevel,
        hintsUsed: JSON.stringify(hintsUsed || {}),
        lastActivityAt: new Date(),
      },
    });

    // Update user stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalGems: userGems,
        totalRiddlesSolved: solvedRiddles?.length || 0,
        currentLevel,
        lastPlayedDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      session: {
        ...session,
        solvedRiddles: JSON.parse(session.solvedRiddles),
        skippedRiddles: JSON.parse(session.skippedRiddles),
        hintsUsed: session.hintsUsed ? JSON.parse(session.hintsUsed) : {},
      },
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
