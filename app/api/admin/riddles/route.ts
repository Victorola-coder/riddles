import { NextRequest, NextResponse } from 'next/server';
import { getRiddlesPaginated } from '@/lib/services';
import { prisma } from '@/lib/prisma';
import { logRiddleCreated } from '@/lib/activity-logger';
import { verifyAuthToken } from '@/lib/auth-token';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const auth = req.headers.get("authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    const adminId = verifyAuthToken(token);

    if (!adminId || adminId !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageParam = Number(searchParams.get('page'));
    const pageSizeParam = Number(searchParams.get('pageSize'));
    const search = searchParams.get('search') || undefined;
    const difficulty = (searchParams.get('difficulty') as
      | 'easy'
      | 'medium'
      | 'hard'
      | 'all'
      | string) || 'all';

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize =
      Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 12;

    const data = await getRiddlesPaginated({
      page,
      pageSize,
      search,
      difficulty,
    });

    return NextResponse.json(
      {
        riddles: data.riddles,
        meta: {
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch riddles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch riddles' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const auth = req.headers.get("authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    const adminId = verifyAuthToken(token);

    if (!adminId || adminId !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      question,
      answer,
      difficulty,
      category,
      hint1,
      hint2,
      tags,
    } = body;

    if (!question || !answer || !difficulty) {
      return NextResponse.json(
        { error: 'Question, answer, and difficulty are required' },
        { status: 400 }
      );
    }

    // Convert answer array to JSON string
    const answerJson = Array.isArray(answer)
      ? JSON.stringify(answer)
      : JSON.stringify([answer]);

    const riddle = await prisma.riddle.create({
      data: {
        question,
        answer: answerJson,
        difficulty,
        category: category || null,
        hint1: hint1 || null,
        hint2: hint2 || null,
        tags: tags || [],
        isActive: true,
      },
    });

    // Log activity
    await logRiddleCreated(riddle.id, question, 'admin');

    return NextResponse.json(
      {
        riddle: {
          ...riddle,
          answer: JSON.parse(riddle.answer as string),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create riddle:', error);
    return NextResponse.json(
      { error: 'Failed to create riddle' },
      { status: 500 }
    );
  }
}
