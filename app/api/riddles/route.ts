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

    const [riddles, total] = await Promise.all([
      prisma.riddle.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { difficulty: 'asc' }, // Order by difficulty: easy, medium, hard
          { order: 'asc' }, // Then by order if set
          { createdAt: 'asc' }, // Then by creation date
        ],
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
      }),
      prisma.riddle.count({ where }),
    ]);

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
