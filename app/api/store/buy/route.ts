import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, itemId } = await req.json();

    if (!userId || !itemId) {
      return NextResponse.json(
        { error: "Missing userId or itemId" },
        { status: 400 }
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get User and Item
      const user = await tx.user.findUnique({ where: { id: userId } });
      const item = await tx.storeItem.findUnique({ where: { id: itemId } });

      if (!user) throw new Error("User not found");
      if (!item) throw new Error("Item not found");
      if (!item.isActive) throw new Error("Item is not available");

      // 2. Check funds
      if (user.totalGems < item.price) {
        throw new Error("Insufficient funds");
      }

      // 3. Check ownership
      const existing = await tx.userInventory.findUnique({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
      });

      if (existing) {
        throw new Error("You already own this item");
      }

      // 4. Deduct Gems
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalGems: { decrement: item.price },
        },
      });

      // 5. Add to Inventory
      const inventoryItem = await tx.userInventory.create({
        data: {
          userId,
          itemId,
        },
      });
      
      // Update Game Session gems too if it exists (to sync with client state immediately)
      await tx.gameSession.updateMany({
        where: { userId },
        data: { userGems: updatedUser.totalGems } // Sync
      });

      return { user: updatedUser, inventoryItem };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Purchase failed:", error);
    return NextResponse.json(
      { error: error.message || "Purchase failed" },
      { status: 400 }
    );
  }
}
