import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/mystery-box
 * List active mystery boxes with lightweight reward summary.
 */
export async function GET(_req: NextRequest) {
  try {
    const boxes = await prisma.mysteryBox.findMany({
      where: { isActive: true },
      orderBy: [{ rarity: "asc" }, { price: "asc" }, { createdAt: "desc" }],
      include: {
        rewards: {
          where: { isActive: true },
          select: { id: true, rarity: true, weight: true, type: true },
        },
      },
    });

    const normalized = boxes.map((b) => {
      const totalWeight = b.rewards.reduce((sum, r) => sum + (r.weight || 0), 0);
      const rarityWeights: Record<string, number> = {};
      for (const r of b.rewards) {
        rarityWeights[r.rarity] = (rarityWeights[r.rarity] || 0) + r.weight;
      }
      const rarityChances: Record<string, number> = {};
      for (const [rarity, w] of Object.entries(rarityWeights)) {
        rarityChances[rarity] = totalWeight > 0 ? Math.round((w / totalWeight) * 1000) / 10 : 0;
      }

      return {
        id: b.id,
        name: b.name,
        description: b.description,
        price: b.price,
        rarity: b.rarity,
        isActive: b.isActive,
        rewardCount: b.rewards.length,
        rarityChances,
      };
    });

    return NextResponse.json({ boxes: normalized }, { status: 200 });
  } catch (error) {
    console.error("Failed to list mystery boxes:", error);
    return NextResponse.json(
      { error: "Failed to list mystery boxes" },
      { status: 500 }
    );
  }
}

