import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/admin-auth-server';

/**
 * POST /api/admin/daily-challenge/seed
 * Seed daily challenges for future dates
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    const admin = requireAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { days = 30 } = await request.json().catch(() => ({}));

    // Get all active riddles
    const riddles = await prisma.riddle.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    if (riddles.length === 0) {
      return NextResponse.json(
        { error: 'No active riddles available' },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const challenges = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() + i);

      // Check if challenge already exists
      const existing = await prisma.dailyChallenge.findUnique({
        where: { date },
      });

      if (existing) continue;

      // Randomly select a riddle
      const randomRiddle =
        riddles[Math.floor(Math.random() * riddles.length)];

      challenges.push({
        riddleId: randomRiddle.id,
        date,
        bonusGems: 20, // Base bonus
      });
    }

    // Create challenges in batch
    const created = await prisma.$transaction(
      challenges.map((challenge) =>
        prisma.dailyChallenge.create({ data: challenge })
      )
    );

    return NextResponse.json({
      message: `Created ${created.length} daily challenges`,
      created: created.length,
      total: challenges.length,
    });
  } catch (error) {
    console.error('Error seeding daily challenges:', error);
    return NextResponse.json(
      { error: 'Failed to seed daily challenges' },
      { status: 500 }
    );
  }
}
