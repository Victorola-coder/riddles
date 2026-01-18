import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Creates a PrismaClient instance.
 * Using SQLite for local development.
 * For production, switch to PostgreSQL/Supabase.
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

/**
 * Prisma Client Singleton
 * In Next.js, each serverless function can create its own PrismaClient instance,
 * which can quickly exhaust database connections. This singleton pattern ensures
 * we reuse a single instance across all requests.
 */
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
