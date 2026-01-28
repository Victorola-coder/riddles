import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const body: unknown = await req.json();
    const data = body as {
      name?: string;
      description?: string | null;
      price?: number;
      rarity?: string;
      isActive?: boolean;
    };

    const updated = await prisma.mysteryBox.update({
      where: { id },
      data: {
        ...(typeof data.name === "string" ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description ?? null } : {}),
        ...(typeof data.price === "number"
          ? { price: Math.max(0, Math.floor(data.price)) }
          : {}),
        ...(typeof data.rarity === "string" ? { rarity: data.rarity } : {}),
        ...(typeof data.isActive === "boolean" ? { isActive: data.isActive } : {}),
      },
    });

    return NextResponse.json({ box: updated }, { status: 200 });
  } catch (error) {
    console.error("Failed to update mystery box (admin):", error);
    return NextResponse.json(
      { error: "Failed to update mystery box" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    await prisma.mysteryBox.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete mystery box (admin):", error);
    return NextResponse.json(
      { error: "Failed to delete mystery box" },
      { status: 500 }
    );
  }
}

