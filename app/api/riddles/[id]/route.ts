import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/riddles/:id
 * Fetch a single riddle by ID for sharing/viewing.
 */
export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const riddle = await prisma.riddle.findUnique({
      where: { id },
      select: {
        id: true,
        question: true,
        answer: true,
        difficulty: true,
        category: true,
        hint1: true,
        hint2: true,
        tags: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!riddle || !riddle.isActive) {
      return NextResponse.json({ error: "Riddle not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        riddle: {
          id: riddle.id,
          question: riddle.question,
          difficulty: riddle.difficulty,
          category: riddle.category,
          hint1: riddle.hint1,
          hint2: riddle.hint2,
          tags: riddle.tags ? JSON.parse(riddle.tags as string) : [],
          answer: JSON.parse(riddle.answer as string),
          createdAt: riddle.createdAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching riddle by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch riddle" },
      { status: 500 }
    );
  }
}

