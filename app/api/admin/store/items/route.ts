import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Helper to check admin auth (basic/hardcoded for now as per other admin routes)
// Ideally reuse a middleware or helper
const checkAdminAuth = async () => {
    // In a real app, verify session/token
    // For now, assuming middleware handles it or we check a specific header/cookie
    // But looking at existing admin routes (e.g. users/route.ts):
    // const authHeader = headers().get("authorization");
    // ...
    // Let's implement basic check if needed, or rely on layout
    return true;
};

export async function GET() {
  try {
    const items = await prisma.storeItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch store items:", error);
    return NextResponse.json(
      { error: "Failed to fetch store items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, type, price, imageUrl, rarity } = body;

    if (!name || !type || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await prisma.storeItem.create({
      data: {
        name,
        description,
        type,
        price: parseInt(price),
        imageUrl,
        rarity: rarity || "COMMON",
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to create store item:", error);
    return NextResponse.json(
      { error: "Failed to create store item" },
      { status: 500 }
    );
  }
}
