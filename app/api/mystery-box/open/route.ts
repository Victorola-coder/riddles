import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/auth-token";

type RewardType = "GEMS" | "STORE_ITEM";

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function pickWeighted<T extends { weight: number }>(items: T[]): T | null {
  const total = items.reduce((sum, i) => sum + Math.max(0, i.weight), 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= Math.max(0, item.weight);
    if (roll <= 0) return item;
  }
  return items[items.length - 1] ?? null;
}

async function ensureUserAndSession(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    await prisma.user.create({
      data: {
        id: userId,
        username: userId.startsWith("guest_")
          ? `Guest_${userId.slice(-8)}`
          : `Player_${userId.slice(0, 8)}`,
        totalGems: 50,
      },
    });
  }

  await prisma.gameSession.upsert({
    where: { userId },
    create: { userId, userGems: 50 },
    update: {},
  });
}

/**
 * POST /api/mystery-box/open
 * Body: { userId: string, boxId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const body: unknown = await req.json();
    const data = body as { userId?: string; boxId?: string };

    const userId = token?.userId || data.userId;
    const boxId = data.boxId;

    if (!userId || !boxId) {
      return NextResponse.json(
        { error: "userId and boxId are required" },
        { status: 400 }
      );
    }

    await ensureUserAndSession(userId);

    const box = await prisma.mysteryBox.findUnique({
      where: { id: boxId },
      include: {
        rewards: {
          where: { isActive: true },
          orderBy: [{ rarity: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!box || !box.isActive) {
      return NextResponse.json({ error: "Box not found" }, { status: 404 });
    }

    if (box.rewards.length === 0) {
      return NextResponse.json(
        { error: "This box has no active rewards configured" },
        { status: 400 }
      );
    }

    const session = await prisma.gameSession.findUnique({ where: { userId } });
    if (!session) {
      return NextResponse.json(
        { error: "Game session not found" },
        { status: 404 }
      );
    }

    if (session.userGems < box.price) {
      return NextResponse.json(
        { error: "Not enough gems" },
        { status: 400 }
      );
    }

    const picked = pickWeighted(
      box.rewards.map((r) => ({ ...r, weight: r.weight || 0 }))
    );
    if (!picked) {
      return NextResponse.json(
        { error: "Failed to select a reward" },
        { status: 500 }
      );
    }

    const rewardType = picked.type as RewardType;

    // Resolve reward
    let gemsGained = 0;
    let inventoryGranted: { itemId: string; name: string; rarity: string } | null =
      null;
    let resolvedReward: Record<string, unknown> = {
      type: rewardType,
      rarity: picked.rarity,
    };

    if (rewardType === "GEMS") {
      const parsed = safeJsonParse<{ amount?: number }>(picked.value, {});
      const amount =
        typeof parsed.amount === "number" && Number.isFinite(parsed.amount)
          ? Math.max(1, Math.floor(parsed.amount))
          : 10;
      gemsGained = amount;
      resolvedReward = { ...resolvedReward, amount };
    } else if (rewardType === "STORE_ITEM") {
      const parsed = safeJsonParse<{ itemId?: string }>(picked.value, {});
      const itemId = parsed.itemId;
      if (!itemId) {
        // Misconfigured reward; fail safe to gems
        gemsGained = 10;
        resolvedReward = { ...resolvedReward, amount: gemsGained, fallback: true };
      } else {
        const item = await prisma.storeItem.findUnique({
          where: { id: itemId },
          select: { id: true, name: true, rarity: true, isActive: true },
        });

        if (!item || !item.isActive) {
          gemsGained = 10;
          resolvedReward = { ...resolvedReward, amount: gemsGained, fallback: true };
        } else {
          // Avoid duplicates (unique constraint). If already owned, fallback to gems.
          const existing = await prisma.userInventory.findUnique({
            where: { userId_itemId: { userId, itemId: item.id } },
            select: { id: true },
          });

          if (existing) {
            gemsGained = 10;
            resolvedReward = {
              ...resolvedReward,
              amount: gemsGained,
              duplicate: true,
              itemId: item.id,
              itemName: item.name,
            };
          } else {
            inventoryGranted = { itemId: item.id, name: item.name, rarity: item.rarity };
            resolvedReward = {
              ...resolvedReward,
              itemId: item.id,
              itemName: item.name,
              itemRarity: item.rarity,
            };
          }
        }
      }
    } else {
      // Unknown reward type; fail safe
      gemsGained = 10;
      resolvedReward = { type: "GEMS", rarity: "COMMON", amount: gemsGained, fallback: true };
    }

    const gemsSpent = box.price;
    const newGems = session.userGems - gemsSpent + gemsGained;

    const opening = await prisma.$transaction(async (tx) => {
      // Spend
      await tx.gameSession.update({
        where: { userId },
        data: { userGems: newGems, lastActivityAt: new Date() },
      });
      await tx.user.update({
        where: { id: userId },
        data: { totalGems: newGems, lastPlayedDate: new Date() },
      });

      // Grant store item if applicable
      if (inventoryGranted) {
        await tx.userInventory.create({
          data: { userId, itemId: inventoryGranted.itemId },
        });
      }

      // Record opening
      return await tx.mysteryBoxOpening.create({
        data: {
          userId,
          mysteryBoxId: box.id,
          rewardId: picked.id,
          rewardData: JSON.stringify({
            ...resolvedReward,
            gemsSpent,
            gemsGained,
          }),
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        userId,
        box: { id: box.id, name: box.name, rarity: box.rarity, price: box.price },
        reward: resolvedReward,
        gemsSpent,
        gemsGained,
        newGems,
        opening: { id: opening.id, createdAt: opening.createdAt.toISOString() },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to open mystery box:", error);
    return NextResponse.json(
      { error: "Failed to open mystery box" },
      { status: 500 }
    );
  }
}

