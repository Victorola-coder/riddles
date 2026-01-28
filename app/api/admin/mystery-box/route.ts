import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";

/**
 * GET /api/admin/mystery-box
 * List boxes with reward counts.
 */
export async function GET(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const boxes = await prisma.mysteryBox.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      include: {
        rewards: {
          orderBy: [{ isActive: "desc" }, { rarity: "asc" }, { weight: "desc" }],
        },
        _count: {
          select: { rewards: true, openings: true },
        },
      },
    });

    return NextResponse.json(
      {
        boxes: boxes.map((b) => ({
          id: b.id,
          name: b.name,
          description: b.description,
          price: b.price,
          rarity: b.rarity,
          isActive: b.isActive,
          createdAt: b.createdAt.toISOString(),
          updatedAt: b.updatedAt.toISOString(),
          rewards: b.rewards.map((r) => ({
            id: r.id,
            mysteryBoxId: r.mysteryBoxId,
            type: r.type,
            value: r.value,
            rarity: r.rarity,
            weight: r.weight,
            isActive: r.isActive,
            createdAt: r.createdAt.toISOString(),
          })),
          _count: {
            rewards: b._count.rewards,
            openings: b._count.openings,
          },
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to list mystery boxes (admin):", error);
    return NextResponse.json(
      { error: "Failed to list mystery boxes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/mystery-box
 * Create a box.
 * Body: { name, description?, price, rarity, isActive? }
 */
export async function POST(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: unknown = await req.json();
    const data = body as {
      name?: string;
      description?: string;
      price?: number;
      rarity?: string;
      isActive?: boolean;
    };

    if (!data.name || typeof data.price !== "number" || !data.rarity) {
      return NextResponse.json(
        { error: "name, price and rarity are required" },
        { status: 400 }
      );
    }

    const box = await prisma.mysteryBox.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: Math.max(0, Math.floor(data.price)),
        rarity: data.rarity,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ box }, { status: 201 });
  } catch (error) {
    console.error("Failed to create mystery box (admin):", error);
    return NextResponse.json(
      { error: "Failed to create mystery box" },
      { status: 500 }
    );
  }
}

