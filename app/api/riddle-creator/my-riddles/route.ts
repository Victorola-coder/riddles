import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/auth-token";

/**
 * GET /api/riddle-creator/my-riddles
 * Get current user's submitted riddles
 */
export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const userId = token?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const riddles = await prisma.userRiddle.findMany({
      where: { authorId: userId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        riddles: riddles.map((r) => ({
          id: r.id,
          question: r.question,
          answer: JSON.parse(r.answer),
          difficulty: r.difficulty,
          category: r.category,
          hint1: r.hint1,
          hint2: r.hint2,
          tags: JSON.parse(r.tags),
          status: r.status,
          rejectionReason: r.rejectionReason,
          playCount: r.playCount,
          totalVotes: r.totalVotes,
          voteCount: r.voteCount,
          createdAt: r.createdAt.toISOString(),
          reviewedAt: r.reviewedAt?.toISOString() || null,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch user riddles:", error);
    return NextResponse.json(
      { error: "Failed to fetch your riddles" },
      { status: 500 }
    );
  }
}
