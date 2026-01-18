import { PrismaClient } from '@prisma/client';
import { RIDDLES } from '../lib/constants/riddles';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Riddles
  console.log('📝 Seeding riddles...');
  for (const riddle of RIDDLES) {
    const answerJson = Array.isArray(riddle.answer)
      ? JSON.stringify(riddle.answer)
      : JSON.stringify([riddle.answer]);

    const tagsJson = riddle.tags ? JSON.stringify(riddle.tags) : '[]';

    await prisma.riddle.upsert({
      where: { id: riddle.id },
      update: {
        question: riddle.question,
        answer: answerJson,
        difficulty: riddle.difficulty,
        category: riddle.category || null,
        hint1: riddle.hint1 || null,
        hint2: riddle.hint2 || null,
        tags: tagsJson,
        isActive: true,
      },
      create: {
        id: riddle.id,
        question: riddle.question,
        answer: answerJson,
        difficulty: riddle.difficulty,
        category: riddle.category || null,
        hint1: riddle.hint1 || null,
        hint2: riddle.hint2 || null,
        tags: tagsJson,
        isActive: true,
      },
    });
  }
  console.log(`✅ Seeded ${RIDDLES.length} riddles`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
