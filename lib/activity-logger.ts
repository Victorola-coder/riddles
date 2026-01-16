import { prisma } from './prisma';

/**
 * Activity Logger
 * Centralized logging for all admin and user actions
 */

export async function logActivity(data: {
  type: string;
  category: 'admin' | 'user' | 'system';
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  riddleId?: string;
  adminId?: string;
}): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        type: data.type,
        category: data.category,
        title: data.title,
        description: data.description,
        metadata: data.metadata ? (data.metadata as any) : null,
        userId: data.userId || null,
        riddleId: data.riddleId || null,
        adminId: data.adminId || null,
      },
    });
  } catch (error) {
    // Don't fail the main operation if logging fails
    console.error('Failed to log activity:', error);
  }
}

// Admin activity loggers
export async function logRiddleCreated(
  riddleId: string,
  question: string,
  adminId?: string
): Promise<void> {
  await logActivity({
    type: 'riddle_created',
    category: 'admin',
    title: 'Riddle Created',
    description: question,
    metadata: { riddleId, question },
    riddleId,
    adminId,
  });
}

export async function logRiddleUpdated(
  riddleId: string,
  question: string,
  adminId?: string,
  changes?: Record<string, { before: unknown; after: unknown }>
): Promise<void> {
  await logActivity({
    type: 'riddle_updated',
    category: 'admin',
    title: 'Riddle Updated',
    description: question,
    metadata: { riddleId, question, changes: changes || {} },
    riddleId,
    adminId,
  });
}

export async function logRiddleDeleted(
  riddleId: string,
  question: string,
  adminId?: string
): Promise<void> {
  await logActivity({
    type: 'riddle_deleted',
    category: 'admin',
    title: 'Riddle Deleted',
    description: question,
    metadata: { riddleId, question },
    riddleId,
    adminId,
  });
}

// User activity loggers
export async function logRiddleSolved(
  userId: string,
  riddleId: string,
  gemsEarned: number
): Promise<void> {
  await logActivity({
    type: 'riddle_solved',
    category: 'user',
    title: 'Riddle Solved',
    description: `User solved a riddle and earned ${gemsEarned} gems`,
    metadata: { userId, riddleId, gemsEarned },
    userId,
    riddleId,
  });
}

export async function logHintUsed(
  userId: string,
  riddleId: string,
  hintLevel: number,
  gemsSpent: number
): Promise<void> {
  await logActivity({
    type: 'hint_used',
    category: 'user',
    title: 'Hint Used',
    description: `User used hint level ${hintLevel}`,
    metadata: { userId, riddleId, hintLevel, gemsSpent },
    userId,
    riddleId,
  });
}
