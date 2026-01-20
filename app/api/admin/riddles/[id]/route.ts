import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  logRiddleUpdated,
  logRiddleDeleted,
} from '@/lib/activity-logger';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};

    if (body.question !== undefined) updateData.question = body.question;
    if (body.answer !== undefined) {
      updateData.answer = Array.isArray(body.answer)
        ? JSON.stringify(body.answer)
        : JSON.stringify([body.answer]);
    }
    if (body.difficulty !== undefined)
      updateData.difficulty = body.difficulty;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.hint1 !== undefined) updateData.hint1 = body.hint1;
    if (body.hint2 !== undefined) updateData.hint2 = body.hint2;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const riddle = await prisma.riddle.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await logRiddleUpdated(riddle.id, riddle.question, 'admin');

    return NextResponse.json(
      {
        riddle: {
          ...riddle,
          answer: JSON.parse(riddle.answer as string),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update riddle:', error);
    return NextResponse.json(
      { error: 'Failed to update riddle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const riddle = await prisma.riddle.findUnique({ where: { id } });
    if (!riddle) {
      return NextResponse.json({ error: 'Riddle not found' }, { status: 404 });
    }

    await prisma.riddle.delete({ where: { id } });

    // Log activity
    await logRiddleDeleted(id, riddle.question, 'admin');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete riddle:', error);
    return NextResponse.json(
      { error: 'Failed to delete riddle' },
      { status: 500 }
    );
  }
}
