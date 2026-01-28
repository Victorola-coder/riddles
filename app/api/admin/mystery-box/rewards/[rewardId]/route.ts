import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";

/**
 * PUT /api/admin/mystery-box/rewards/:rewardId
 * DELETE /api/admin/mystery-box/rewards/:rewardId
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ rewardId: string }> }
) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rewardId } = await context.params;
    const body: unknown = await req.json();
    const data = body as {
      type?: string;
      value?: string;
      rarity?: string;
      weight?: number;
      isActive?: boolean;
    };

    const updated = await prisma.mysteryBoxReward.update({
      where: { id: rewardId },
      data: {
        ...(typeof data.type === "string" ? { type: data.type } : {}),
        ...(typeof data.value === "string" ? { value: data.value } : {}),
        ...(typeof data.rarity === "string" ? { rarity: data.rarity } : {}),
        ...(typeof data.weight === "number" && Number.isFinite(data.weight)
          ? { weight: Math.max(1, Math.floor(data.weight)) }
          : {}),
        ...(typeof data.isActive === "boolean" ? { isActive: data.isActive } : {}),
      },
    });

    return NextResponse.json({ reward: updated }, { status: 200 });
  } catch (error) {
    console.error("Failed to update reward (admin):", error);
    return NextResponse.json({ error: "Failed to update reward" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ rewardId: string }> }
) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rewardId } = await context.params;
    await prisma.mysteryBoxReward.delete({ where: { id: rewardId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete reward (admin):", error);
    return NextResponse.json({ error: "Failed to delete reward" }, { status: 500 });
  }
}

