import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    
    // Remove id from body if present
    const { id: _, ...updateData } = body;

    const item = await prisma.storeItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update store item:", error);
    return NextResponse.json(
      { error: "Failed to update store item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.storeItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete store item:", error);
    return NextResponse.json(
      { error: "Failed to delete store item" },
      { status: 500 }
    );
  }
}
