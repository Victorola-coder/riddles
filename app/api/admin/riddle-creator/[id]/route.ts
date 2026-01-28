import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth-server";
import { logRiddleCreated } from "@/lib/activity-logger";

/**
 * POST /api/admin/riddle-creator/:id/approve
 * Approve a user-submitted riddle and add it to the main Riddle table
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const userRiddle = await prisma.userRiddle.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!userRiddle) {
      return NextResponse.json({ error: "Riddle not found" }, { status: 404 });
    }

    if (userRiddle.status === "APPROVED") {
      return NextResponse.json(
        { error: "Riddle already approved" },
        { status: 400 }
      );
    }

    // Create the approved riddle in the main Riddle table
    const approvedRiddle = await prisma.$transaction(async (tx) => {
      // Check if question already exists (shouldn't happen due to unique constraint, but safety check)
      const existing = await tx.riddle.findUnique({
        where: { question: userRiddle.question },
      });

      if (existing) {
        throw new Error("A riddle with this question already exists");
      }

      // Create the riddle
      const riddle = await tx.riddle.create({
        data: {
          question: userRiddle.question,
          answer: userRiddle.answer,
          difficulty: userRiddle.difficulty,
          category: userRiddle.category,
          hint1: userRiddle.hint1,
          hint2: userRiddle.hint2,
          tags: userRiddle.tags,
          isActive: true,
        },
      });

      // Update user riddle status and link
      await tx.userRiddle.update({
        where: { id },
        data: {
          status: "APPROVED",
          approvedRiddleId: riddle.id,
          reviewedAt: new Date(),
          reviewedBy: admin.userId,
        },
      });

      // Award creator 10 gems for having their riddle approved
      await tx.user.update({
        where: { id: userRiddle.authorId },
        data: {
          totalGems: { increment: 10 },
        },
      });

      // Update game session if exists
      const session = await tx.gameSession.findUnique({
        where: { userId: userRiddle.authorId },
      });
      if (session) {
        await tx.gameSession.update({
          where: { userId: userRiddle.authorId },
          data: {
            userGems: { increment: 10 },
          },
        });
      }

      return riddle;
    });

    // Log activity
    await logRiddleCreated(
      approvedRiddle.id,
      approvedRiddle.question,
      "user",
      userRiddle.authorId
    );

    return NextResponse.json(
      {
        success: true,
        riddle: {
          ...approvedRiddle,
          answer: JSON.parse(approvedRiddle.answer as string),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to approve riddle:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to approve riddle",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/riddle-creator/:id
 * Reject a user-submitted riddle
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const { reason } = body as { reason?: string };

    const userRiddle = await prisma.userRiddle.findUnique({
      where: { id },
    });

    if (!userRiddle) {
      return NextResponse.json({ error: "Riddle not found" }, { status: 404 });
    }

    if (userRiddle.status === "REJECTED") {
      return NextResponse.json(
        { error: "Riddle already rejected" },
        { status: 400 }
      );
    }

    await prisma.userRiddle.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason || null,
        reviewedAt: new Date(),
        reviewedBy: admin.userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to reject riddle:", error);
    return NextResponse.json(
      { error: "Failed to reject riddle" },
      { status: 500 }
    );
  }
}
