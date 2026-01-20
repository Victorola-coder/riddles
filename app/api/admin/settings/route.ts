import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth-token';
import { logActivity } from '@/lib/activity-logger';

/**
 * GET /api/admin/settings
 * Get current game configuration settings
 */
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyAuthToken(token);
    if (!decoded || (decoded.type !== 'admin' && decoded.userId !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all game config settings
    const configs = await prisma.gameConfig.findMany({
      orderBy: { key: 'asc' },
    });

    // Parse and structure the config
    const settings: Record<string, unknown> = {};
    configs.forEach((config) => {
      try {
        settings[config.key] = JSON.parse(config.value);
      } catch {
        settings[config.key] = config.value;
      }
    });

    // Return default values if no config exists
    if (Object.keys(settings).length === 0) {
      return NextResponse.json({
        settings: {
          gemRewards: { easy: 10, medium: 20, hard: 50 },
          gemCosts: { hint1: 15, hint2: 10, hint3: 50, skip: 30 },
          initialGems: 50,
        },
      });
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings
 * Update game configuration settings
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyAuthToken(token);
    if (!decoded || (decoded.type !== 'admin' && decoded.userId !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { gemRewards, gemCosts, initialGems } = body;

    // Validate input
    if (!gemRewards || !gemCosts || initialGems === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update or create config entries
    const updates = [
      prisma.gameConfig.upsert({
        where: { key: 'gemRewards' },
        update: {
          value: JSON.stringify(gemRewards),
          updatedBy: decoded.userId,
        },
        create: {
          key: 'gemRewards',
          value: JSON.stringify(gemRewards),
          description: 'Gem rewards for solving riddles by difficulty',
          updatedBy: decoded.userId,
        },
      }),
      prisma.gameConfig.upsert({
        where: { key: 'gemCosts' },
        update: {
          value: JSON.stringify(gemCosts),
          updatedBy: decoded.userId,
        },
        create: {
          key: 'gemCosts',
          value: JSON.stringify(gemCosts),
          description: 'Gem costs for hints and skip actions',
          updatedBy: decoded.userId,
        },
      }),
      prisma.gameConfig.upsert({
        where: { key: 'initialGems' },
        update: {
          value: JSON.stringify(initialGems),
          updatedBy: decoded.userId,
        },
        create: {
          key: 'initialGems',
          value: JSON.stringify(initialGems),
          description: 'Starting gem count for new users',
          updatedBy: decoded.userId,
        },
      }),
    ];

    await Promise.all(updates);

    // Log the activity
    await logActivity({
      type: 'settings_updated',
      category: 'admin',
      title: 'Game Settings Updated',
      description: `Admin updated game configuration settings`,
      adminId: decoded.userId,
      metadata: {
        gemRewards,
        gemCosts,
        initialGems,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Settings saved successfully',
        settings: {
          gemRewards,
          gemCosts,
          initialGems,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
