import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";

function parseUtcDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [_, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * GET /api/admin/daily-challenge/entries?date=YYYY-MM-DD
 * List entries for a given daily challenge date (fastest first).
 */
export async function GET(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    if (!dateParam) {
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }

    const date = parseUtcDateOnly(dateParam);
    if (!date) {
      return NextResponse.json(
        { error: "Invalid date. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: { date },
      select: { id: true },
    });

    if (!challenge) {
      return NextResponse.json({ entries: [] }, { status: 200 });
    }

    const entries = await prisma.dailyChallengeEntry.findMany({
      where: { dailyChallengeId: challenge.id },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: [{ isCorrect: "desc" }, { solveTimeMs: "asc" }, { completedAt: "asc" }],
    });

    return NextResponse.json(
      {
        entries: entries.map((e) => ({
          id: e.id,
          userId: e.userId,
          username: e.user?.username ?? null,
          email: e.user?.email ?? null,
          isCorrect: e.isCorrect,
          solveTimeMs: e.solveTimeMs,
          completedAt: e.completedAt.toISOString(),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch daily challenge entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge entries" },
      { status: 500 }
    );
  }
}

