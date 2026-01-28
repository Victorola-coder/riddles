import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";

function parseUtcDateOnly(value: string): Date | null {
  // Expect YYYY-MM-DD
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [_, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateOnlyIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * GET /api/admin/daily-challenge?from=YYYY-MM-DD&to=YYYY-MM-DD
 * List daily challenges in a date range.
 */
export async function GET(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const from = fromParam ? parseUtcDateOnly(fromParam) : today;
    const to = toParam
      ? parseUtcDateOnly(toParam)
      : new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 29, 0, 0, 0, 0));

    if (!from || !to) {
      return NextResponse.json(
        { error: "Invalid date range. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const challenges = await prisma.dailyChallenge.findMany({
      where: {
        date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { date: "asc" },
      include: {
        riddle: {
          select: {
            id: true,
            question: true,
            difficulty: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        challenges: challenges.map((c) => ({
          id: c.id,
          date: toDateOnlyIso(c.date),
          riddleId: c.riddleId,
          bonusGems: c.bonusGems,
          riddle: c.riddle,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to list daily challenges:", error);
    return NextResponse.json(
      { error: "Failed to list daily challenges" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/daily-challenge
 * Upsert a daily challenge by date.
 * Body: { date: 'YYYY-MM-DD', riddleId: string, bonusGems?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json();
    const data = body as {
      date?: string;
      riddleId?: string;
      bonusGems?: number;
    };

    if (!data.date || !data.riddleId) {
      return NextResponse.json(
        { error: "date and riddleId are required" },
        { status: 400 }
      );
    }

    const date = parseUtcDateOnly(data.date);
    if (!date) {
      return NextResponse.json(
        { error: "Invalid date. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const bonusGems =
      typeof data.bonusGems === "number" && Number.isFinite(data.bonusGems)
        ? Math.max(0, Math.floor(data.bonusGems))
        : 20;

    const challenge = await prisma.dailyChallenge.upsert({
      where: { date },
      create: {
        date,
        riddleId: data.riddleId,
        bonusGems,
      },
      update: {
        riddleId: data.riddleId,
        bonusGems,
      },
      include: {
        riddle: {
          select: {
            id: true,
            question: true,
            difficulty: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        challenge: {
          id: challenge.id,
          date: toDateOnlyIso(challenge.date),
          riddleId: challenge.riddleId,
          bonusGems: challenge.bonusGems,
          riddle: challenge.riddle,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to upsert daily challenge:", error);
    return NextResponse.json(
      { error: "Failed to upsert daily challenge" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/daily-challenge?id=<challengeId>
 */
export async function DELETE(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.dailyChallenge.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete daily challenge:", error);
    return NextResponse.json(
      { error: "Failed to delete daily challenge" },
      { status: 500 }
    );
  }
}

