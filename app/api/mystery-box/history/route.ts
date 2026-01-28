import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/auth-token";

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * GET /api/mystery-box/history?userId=<id>
 * Returns most recent openings for a user.
 */
export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const { searchParams } = new URL(req.url);
    const userId = token?.userId || searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const openings = await prisma.mysteryBoxOpening.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        mysteryBox: { select: { id: true, name: true, rarity: true, price: true } },
        reward: { select: { id: true, type: true, rarity: true } },
      },
    });

    return NextResponse.json(
      {
        openings: openings.map((o) => ({
          id: o.id,
          createdAt: o.createdAt.toISOString(),
          box: o.mysteryBox,
          rewardMeta: o.reward,
          reward: safeJsonParse<Record<string, unknown>>(o.rewardData, {}),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch mystery box history:", error);
    return NextResponse.json(
      { error: "Failed to fetch mystery box history" },
      { status: 500 }
    );
  }
}

