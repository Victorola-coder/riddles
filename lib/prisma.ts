import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Creates a PrismaClient instance with optimized connection pool settings.
 * IMPORTANT: For Supabase connection pooling, ensure your DATABASE_URL uses the session pooler:
 * - Session pooler: postgresql://user:pass@host:6543/db?pgbouncer=true
 * - Direct connection: postgresql://user:pass@host:5432/db (use for migrations only)
 */
const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;

  // Warn if DATABASE_URL doesn't appear to use session pooler
  if (
    databaseUrl &&
    !databaseUrl.includes('pgbouncer=true') &&
    !databaseUrl.includes(':6543')
  ) {
    console.warn(
      '⚠️  DATABASE_URL may not be using Supabase session pooler. ' +
        'For production, use port 6543 with pgbouncer=true'
    );
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

/**
 * Prisma Client Singleton
 * In Next.js, each serverless function can create its own PrismaClient instance,
 * which can quickly exhaust database connections. This singleton pattern ensures
 * we reuse a single instance across all requests.
 */
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
