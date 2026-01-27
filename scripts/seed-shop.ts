import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = [
    {
      name: "Golden Avatar",
      description: "A shiny golden profile picture frame.",
      type: "AVATAR",
      rarity: "EPIC",
      price: 500,
      imageUrl: "Crown", // Using Lucide icon name for now as placeholder
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

  console.log("Seeding shop items...");

  for (const item of items) {
    // Check if item exists to avoid dupes if run multiple times
    const existing = await prisma.storeItem.findFirst({
        where: { name: item.name }
    });

    if (!existing) {
        await prisma.storeItem.create({
            data: item
        });
        console.log(`Created: ${item.name}`);
    } else {
        console.log(`Skipped: ${item.name} (already exists)`);
    }
  }

  console.log("Shop seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
