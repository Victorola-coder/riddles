import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const items = [
      {
        name: "Golden Avatar",
        description: "A shiny golden profile picture frame.",
        type: "AVATAR",
        rarity: "EPIC",
        price: 500,
        imageUrl: "Crown",
        isActive: true
      },
      {
        name: "Verified Badge",
        description: "Show everyone you're a verified riddler.",
        type: "BADGE",
        rarity: "LEGENDARY",
        price: 1000,
        imageUrl: "ShieldCheck",
        isActive: true
      },
      {
        name: "Hint Potion",
        description: "Instantly reveals one hint.",
        type: "CONSUMABLE",
        rarity: "COMMON",
        price: 50,
        imageUrl: "FlaskConical",
        isActive: true
      },
      {
        name: "Neon Frame",
        description: "Glowing neon border for your avatar.",
        type: "AVATAR",
        rarity: "RARE",
        price: 250,
        imageUrl: "Zap",
        isActive: true
      }
    ];

    let count = 0;
    for (const item of items) {
      const existing = await prisma.storeItem.findFirst({
        where: { name: item.name },
      });

      if (!existing) {
        await prisma.storeItem.create({ data: item });
        count++;
      }
    }

    return NextResponse.json({ success: true, message: `Seeded ${count} items` });
  } catch (error) {
    console.error("Failed to seed items:", error);
    return NextResponse.json(
      { error: "Failed to seed items" },
      { status: 500 }
    );
  }
}
