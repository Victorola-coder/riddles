import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.storeItem.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to fetch store items:", error);
    return NextResponse.json(
      { error: "Failed to fetch store items" },
      { status: 500 }
    );
  }
}
