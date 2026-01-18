import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/utils/jwt';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/me
 * Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch full user data
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        totalGems: true,
        totalRiddlesSolved: true,
        currentStreak: true,
        longestStreak: true,
        currentLevel: true,
        lastPlayedDate: true,
        createdAt: true,
        achievements: {
          select: {
            achievementId: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        totalGems: userData.totalGems,
        currentLevel: userData.currentLevel,
        achievements: userData.achievements.map((a) => a.achievementId),
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/auth/me
 * Update user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, password, confirmPassword } = body;
    const data: any = {};

    if (username) data.username = username;
    
    if (password) {
      if (password !== confirmPassword) {
        return NextResponse.json(
          { error: 'Passwords do not match' },
          { status: 400 }
        );
      }
      // TODO: Add password validation here
      const { hashPassword } = await import('@/lib/utils/password');
      data.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        totalGems: true,
        totalRiddlesSolved: true,
        currentStreak: true,
        longestStreak: true,
        currentLevel: true,
        lastPlayedDate: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        achievements: [], // Simplified for now
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
