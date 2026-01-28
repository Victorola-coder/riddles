import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";

/**
 * GET /api/admin/riddle-creator
 * List user-submitted riddles for admin review
 * Query params: status?, page?, pageSize?
 */
export async function GET(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: Record<string, unknown> = {};
    if (status !== "all") {
      where.status = status;
    }

    const [riddles, total] = await Promise.all([
      prisma.userRiddle.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
      }),
      prisma.userRiddle.count({ where }),
    ]);

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
          author: {
            id: r.author.id,
            username: r.author.username,
            email: r.author.email,
          },
          createdAt: r.createdAt.toISOString(),
          reviewedAt: r.reviewedAt?.toISOString() || null,
          reviewedBy: r.reviewedBy,
        })),
        meta: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to list user riddles (admin):", error);
    return NextResponse.json(
      { error: "Failed to list riddles" },
      { status: 500 }
    );
  }
}
