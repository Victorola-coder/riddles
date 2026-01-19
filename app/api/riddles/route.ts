import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/riddles
 * Fetch riddles for regular users (public endpoint)
 * Supports filtering by difficulty and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category') || undefined;

    const where: any = {
      isActive: true, // Only return active riddles
    };

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      where.difficulty = difficulty;
    }

    if (category) {
      where.category = category;
    }

    // Get all matching riddles
    const allRiddles = await prisma.riddle.findMany({
      where,
      select: {
        id: true,
        question: true,
        difficulty: true,
        category: true,
        hint1: true,
        hint2: true,
        tags: true,
        // Don't expose the answer to regular users
      },
    });

    // Improved randomization: Group by difficulty and category, then shuffle
    const grouped: Record<string, typeof allRiddles> = {};
    
    allRiddles.forEach((riddle) => {
      const key = `${riddle.difficulty}_${riddle.category || 'uncategorized'}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(riddle);
    });

    // Shuffle each group independently using Fisher-Yates algorithm for better randomness
    const shuffleArray = <T>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    Object.keys(grouped).forEach((key) => {
      grouped[key] = shuffleArray(grouped[key]);
    });

    // Interleave groups for better distribution (round-robin style)
    // This ensures users see a mix of categories/difficulties, not all from one group
    const shuffled: typeof allRiddles = [];
    const groups = Object.values(grouped);
    const maxLength = Math.max(...groups.map(g => g.length), 0);
    
    for (let i = 0; i < maxLength; i++) {
      // Shuffle the order of groups each iteration for more randomness
      const shuffledGroups = shuffleArray(groups);
      shuffledGroups.forEach((group) => {
        if (group[i]) {
          shuffled.push(group[i]);
        }
      });
    }

    // Final Fisher-Yates shuffle to ensure true randomness across all groups
    const finalShuffled = shuffleArray(shuffled);
    
    // Apply pagination after randomization
    const riddles = finalShuffled.slice(offset, offset + limit);
    const total = allRiddles.length;

    return NextResponse.json({
      riddles: riddles.map((r) => ({
        id: r.id,
        question: r.question,
        difficulty: r.difficulty,
        category: r.category,
        hint1: r.hint1,
        hint2: r.hint2,
        tags: r.tags ? JSON.parse(r.tags as string) : [],
      })),
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching riddles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch riddles' },
      { status: 500 }
    );
  }
}
