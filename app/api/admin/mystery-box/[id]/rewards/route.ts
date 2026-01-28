import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";

/**
 * GET /api/admin/mystery-box/:id/rewards
 * POST /api/admin/mystery-box/:id/rewards
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rewards = await prisma.mysteryBoxReward.findMany({
      where: { mysteryBoxId: params.id },
      orderBy: [{ isActive: "desc" }, { rarity: "asc" }, { weight: "desc" }],
    });

    return NextResponse.json({ rewards }, { status: 200 });
  } catch (error) {
    console.error("Failed to list rewards (admin):", error);
    return NextResponse.json({ error: "Failed to list rewards" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: unknown = await req.json();
    const data = body as {
      type?: string;
      value?: string;
      rarity?: string;
      weight?: number;
      isActive?: boolean;
    };

    if (!data.type || !data.value) {
      return NextResponse.json(
        { error: "type and value are required" },
        { status: 400 }
      );
    }

    const reward = await prisma.mysteryBoxReward.create({
      data: {
        mysteryBoxId: params.id,
        type: data.type,
        value: data.value,
        rarity: data.rarity || "COMMON",
        weight:
          typeof data.weight === "number" && Number.isFinite(data.weight)
            ? Math.max(1, Math.floor(data.weight))
            : 1,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ reward }, { status: 201 });
  } catch (error) {
    console.error("Failed to create reward (admin):", error);
    return NextResponse.json({ error: "Failed to create reward" }, { status: 500 });
  }
}

