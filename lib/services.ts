import { prisma } from './prisma';

/**
 * Admin Services
 * Business logic layer for admin operations
 */

export async function getAdminStats() {
  const [
    totalUsers,
    totalRiddles,
    totalSolved,
    totalGemsEarned,
    activeSessions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.riddle.count({ where: { isActive: true } }),
    prisma.riddleAttempt.count({ where: { isCorrect: true } }),
    prisma.riddleAttempt.aggregate({
      where: { isCorrect: true },
      _sum: { gemsEarned: true },
    }),
    prisma.gameSession.count({
      where: {
        lastActivityAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalRiddles,
    totalSolved,
    totalGemsEarned: totalGemsEarned._sum.gemsEarned || 0,
    activeSessions,
  };
}

export async function getRiddlesPaginated(options: {
  page: number;
  pageSize: number;
  search?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}) {
  const { page, pageSize, search, difficulty } = options;
  const skip = (page - 1) * pageSize;

  const where: any = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { question: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (difficulty && difficulty !== 'all') {
    where.difficulty = difficulty;
  }

  const [riddles, total] = await Promise.all([
    prisma.riddle.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.riddle.count({ where }),
  ]);

  return {
    riddles: riddles.map((r) => ({
      ...r,
      answer: JSON.parse(r.answer as string), // Parse JSON string back to array
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getUsersPaginated(options: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const { page, pageSize, search } = options;
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getActivityLogsPaginated(options: {
  page: number;
  pageSize: number;
  type?: 'admin' | 'user';
  activityType?: string;
}) {
  const { page, pageSize, type, activityType } = options;
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (type) {
    where.category = type;
  }

  if (activityType) {
    where.type = activityType;
  }

  const [activities, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        riddle: {
          select: {
            id: true,
            question: true,
          },
        },
      },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    activities: activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      timestamp: activity.createdAt.toISOString(),
      metadata: activity.metadata,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
