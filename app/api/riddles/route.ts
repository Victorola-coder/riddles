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
    const includeAnswers = searchParams.get('includeAnswers') === 'true'; // For game use - enables instant validation

    const where: any = {
      isActive: true, // Only return active riddles
    };

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      where.difficulty = difficulty;
    }

    if (category) {
      where.category = category;
    }

    // Fetch riddles with database-side ordering for efficiency
    // Use the pre-computed `order` field if available, otherwise fetch all
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
        order: true,
        ...(includeAnswers && { answer: true }),
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    // Single Fisher-Yates shuffle — no need for grouping/interleaving/triple-shuffle
    const shuffled = [...allRiddles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const riddles = shuffled.slice(offset, offset + limit);
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
        ...(includeAnswers && r.answer && { 
          answer: JSON.parse(r.answer as string) // Parse answer array for client-side validation
        }),
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
