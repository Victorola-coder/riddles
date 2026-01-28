import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/auth-token";

/**
 * GET /api/riddle-creator
 * List user-submitted riddles with voting info
 * Query params: status?, sort?, page?, pageSize?
 */
export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const userId = token?.userId;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "APPROVED"; // PENDING, APPROVED, REJECTED, or all
    const sort = searchParams.get("sort") || "votes"; // votes, newest, oldest
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: Record<string, unknown> = {};
    if (status !== "all") {
      where.status = status;
    }

    const orderBy: Record<string, string>[] = [];
    if (sort === "votes") {
      orderBy.push({ totalVotes: "desc" }, { createdAt: "desc" });
    } else if (sort === "newest") {
      orderBy.push({ createdAt: "desc" });
    } else if (sort === "oldest") {
      orderBy.push({ createdAt: "asc" });
    }

    const [riddles, total] = await Promise.all([
      prisma.userRiddle.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: {
            select: {
              id: true,
              username: true,
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

    // Get user's votes for these riddles if logged in
    let userVotes: Record<string, number> = {};
    if (userId) {
      const votes = await prisma.userRiddleVote.findMany({
        where: {
          userId,
          userRiddleId: { in: riddles.map((r) => r.id) },
        },
        select: {
          userRiddleId: true,
          value: true,
        },
      });
      userVotes = Object.fromEntries(
        votes.map((v) => [v.userRiddleId, v.value])
      );
    }

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
          playCount: r.playCount,
          totalVotes: r.totalVotes,
          voteCount: r.voteCount,
          author: {
            id: r.author.id,
            username: r.author.username,
          },
          createdAt: r.createdAt.toISOString(),
          userVote: userVotes[r.id] || null,
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
    console.error("Failed to list user riddles:", error);
    return NextResponse.json(
      { error: "Failed to list riddles" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/riddle-creator
 * Submit a new riddle
 */
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const userId = token?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { question, answer, difficulty, category, hint1, hint2, tags } =
      body;

    if (!question || !answer || !difficulty) {
      return NextResponse.json(
        { error: "Question, answer, and difficulty are required" },
        { status: 400 }
      );
    }

    // Validate difficulty
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json(
        { error: "Difficulty must be easy, medium, or hard" },
        { status: 400 }
      );
    }

    // Convert answer to JSON array
    const answerArray = Array.isArray(answer) ? answer : [answer];
    const answerJson = JSON.stringify(answerArray);

    // Convert tags to JSON array
    const tagsArray = Array.isArray(tags) ? tags : tags ? tags.split(",").map((t: string) => t.trim()) : [];
    const tagsJson = JSON.stringify(tagsArray);

    const userRiddle = await prisma.userRiddle.create({
      data: {
        authorId: userId,
        question: question.trim(),
        answer: answerJson,
        difficulty,
        category: category?.trim() || null,
        hint1: hint1?.trim() || null,
        hint2: hint2?.trim() || null,
        tags: tagsJson,
        status: "PENDING",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        riddle: {
          id: userRiddle.id,
          question: userRiddle.question,
          answer: JSON.parse(userRiddle.answer),
          difficulty: userRiddle.difficulty,
          category: userRiddle.category,
          hint1: userRiddle.hint1,
          hint2: userRiddle.hint2,
          tags: JSON.parse(userRiddle.tags),
          status: userRiddle.status,
          author: {
            id: userRiddle.author.id,
            username: userRiddle.author.username,
          },
          createdAt: userRiddle.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit riddle:", error);
    return NextResponse.json(
      { error: "Failed to submit riddle" },
      { status: 500 }
    );
  }
}
