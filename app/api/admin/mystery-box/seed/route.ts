import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";

/**
 * POST /api/admin/mystery-box/seed
 * Creates a small set of default boxes + rewards.
 * Safe to run multiple times (no-op if boxes already exist).
 */
export async function POST(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existingCount = await prisma.mysteryBox.count();
    if (existingCount > 0) {
      return NextResponse.json(
        { message: "Mystery boxes already exist. Seed skipped.", created: 0 },
        { status: 200 }
      );
    }

    const created = await prisma.$transaction(async (tx) => {
      const starter = await tx.mysteryBox.create({
        data: {
          name: "Starter Box",
          description: "A small box with common rewards.",
          price: 50,
          rarity: "COMMON",
          isActive: true,
        },
      });

      const adventurer = await tx.mysteryBox.create({
        data: {
          name: "Adventurer Box",
          description: "Better odds and bigger gem drops.",
          price: 150,
          rarity: "RARE",
          isActive: true,
        },
      });

      const legend = await tx.mysteryBox.create({
        data: {
          name: "Legend Box",
          description: "High stakes, high rewards.",
          price: 500,
          rarity: "LEGENDARY",
          isActive: true,
        },
      });

      await tx.mysteryBoxReward.createMany({
        data: [
          // Starter
          {
            mysteryBoxId: starter.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 10 }),
            rarity: "COMMON",
            weight: 60,
            isActive: true,
          },
          {
            mysteryBoxId: starter.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 25 }),
            rarity: "RARE",
            weight: 30,
            isActive: true,
          },
          {
            mysteryBoxId: starter.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 50 }),
            rarity: "EPIC",
            weight: 10,
            isActive: true,
          },

          // Adventurer
          {
            mysteryBoxId: adventurer.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 25 }),
            rarity: "COMMON",
            weight: 45,
            isActive: true,
          },
          {
            mysteryBoxId: adventurer.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 75 }),
            rarity: "RARE",
            weight: 40,
            isActive: true,
          },
          {
            mysteryBoxId: adventurer.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 150 }),
            rarity: "EPIC",
            weight: 15,
            isActive: true,
          },

          // Legend
          {
            mysteryBoxId: legend.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 100 }),
            rarity: "RARE",
            weight: 55,
            isActive: true,
          },
          {
            mysteryBoxId: legend.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 250 }),
            rarity: "EPIC",
            weight: 35,
            isActive: true,
          },
          {
            mysteryBoxId: legend.id,
            type: "GEMS",
            value: JSON.stringify({ amount: 600 }),
            rarity: "LEGENDARY",
            weight: 10,
            isActive: true,
          },
        ],
      });

      return 3;
    });

    return NextResponse.json(
      { message: `Seeded ${created} mystery boxes.`, created },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to seed mystery boxes (admin):", error);
    return NextResponse.json({ error: "Failed to seed mystery boxes" }, { status: 500 });
  }
}

