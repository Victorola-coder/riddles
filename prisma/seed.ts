import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Riddles
  const riddles = [
    {
      question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
      answer: JSON.stringify(['echo', 'an echo']),
      difficulty: 'easy',
      category: 'Nature',
      hint1: 'E',
      hint2: '4 letters',
      tags: JSON.stringify(['sound', 'nature']),
    },
    {
      question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
      answer: JSON.stringify(['map', 'a map']),
      difficulty: 'easy',
      category: 'Objects',
      hint1: 'M',
      hint2: '3 letters',
      tags: JSON.stringify(['geography', 'objects']),
    },
    {
      question: 'What has keys but no locks, space but no room, and you can enter but can\'t go inside?',
      answer: JSON.stringify(['keyboard', 'a keyboard']),
      difficulty: 'easy',
      category: 'Technology',
      hint1: 'K',
      hint2: '8 letters',
      tags: JSON.stringify(['technology', 'computer']),
    },
    {
      question: 'The more you take, the more you leave behind. What am I?',
      answer: JSON.stringify(['footsteps', 'steps']),
      difficulty: 'medium',
      category: 'Abstract',
      hint1: 'F',
      hint2: '9 letters',
      tags: JSON.stringify(['abstract', 'walking']),
    },
    {
      question: 'I am not alive, but I grow; I don\'t have lungs, but I need air; I don\'t have a mouth, but water kills me. What am I?',
      answer: JSON.stringify(['fire']),
      difficulty: 'medium',
      category: 'Nature',
      hint1: 'F',
      hint2: '4 letters',
      tags: JSON.stringify(['elements', 'nature']),
    },
  ];

  for (const riddle of riddles) {
    await prisma.riddle.upsert({
      where: { question: riddle.question },
      update: {},
      create: riddle,
    });
  }

  console.log(`✅ Created ${riddles.length} riddles`);

  // Seed Achievements
  const achievements = [
    {
      name: 'First Steps',
      description: 'Solve your first riddle',
      icon: 'trophy',
      condition: 'solve_1_riddles',
      reward: 10,
    },
    {
      name: 'Getting Started',
      description: 'Solve 5 riddles',
      icon: 'star',
      condition: 'solve_5_riddles',
      reward: 25,
    },
    {
      name: 'Riddle Enthusiast',
      description: 'Solve 25 riddles',
      icon: 'award',
      condition: 'solve_25_riddles',
      reward: 50,
    },
    {
      name: 'Speed Demon',
      description: 'Solve a riddle in under 30 seconds',
      icon: 'zap',
      condition: 'solve_under_30s',
      reward: 25,
    },
    {
      name: 'No Hints Hero',
      description: 'Solve 10 riddles without using hints',
      icon: 'shield',
      condition: 'solve_10_no_hints',
      reward: 50,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { condition: achievement.condition },
      update: {},
      create: achievement,
    });
  }

  console.log(`✅ Created ${achievements.length} achievements`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
