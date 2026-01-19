import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local explicitly for seed script (override .env)
config({ path: resolve(process.cwd(), ".env.local"), override: true });
// Also load .env as fallback
config({ path: resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Riddles - Expanded collection
  const riddles = [
    // EASY RIDDLES
    {
      question:
        "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: JSON.stringify(["echo", "an echo"]),
      difficulty: "easy",
      category: "Nature",
      hint1: "E",
      hint2: "4 letters",
      tags: JSON.stringify(["sound", "nature"]),
    },
    {
      question:
        "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
      answer: JSON.stringify(["map", "a map"]),
      difficulty: "easy",
      category: "Objects",
      hint1: "M",
      hint2: "3 letters",
      tags: JSON.stringify(["geography", "objects"]),
    },
    {
      question:
        "What has keys but no locks, space but no room, and you can enter but can't go inside?",
      answer: JSON.stringify(["keyboard", "a keyboard"]),
      difficulty: "easy",
      category: "Technology",
      hint1: "K",
      hint2: "8 letters",
      tags: JSON.stringify(["technology", "computer"]),
    },
    {
      question: "What gets wet while drying?",
      answer: JSON.stringify(["towel", "a towel"]),
      difficulty: "easy",
      category: "Everyday Objects",
      hint1: "T",
      hint2: "5 letters",
      tags: JSON.stringify(["household", "paradox"]),
    },
    {
      question: "What can travel around the world while staying in a corner?",
      answer: JSON.stringify(["stamp", "a stamp"]),
      difficulty: "easy",
      category: "Objects",
      hint1: "S",
      hint2: "5 letters",
      tags: JSON.stringify(["mail", "travel"]),
    },
    {
      question: "What has a head and a tail but no body?",
      answer: JSON.stringify(["coin", "a coin"]),
      difficulty: "easy",
      category: "Objects",
      hint1: "C",
      hint2: "4 letters",
      tags: JSON.stringify(["money", "everyday"]),
    },
    {
      question: "What has hands but can't clap?",
      answer: JSON.stringify(["clock", "a clock"]),
      difficulty: "easy",
      category: "Objects",
      hint1: "C",
      hint2: "5 letters",
      tags: JSON.stringify(["time", "everyday"]),
    },
    {
      question: "What has a neck but no head?",
      answer: JSON.stringify(["bottle", "a bottle"]),
      difficulty: "easy",
      category: "Objects",
      hint1: "B",
      hint2: "6 letters",
      tags: JSON.stringify(["container", "everyday"]),
    },
    {
      question: "What has an eye but cannot see?",
      answer: JSON.stringify(["needle", "a needle"]),
      difficulty: "easy",
      category: "Objects",
      hint1: "N",
      hint2: "6 letters",
      tags: JSON.stringify(["sewing", "everyday"]),
    },
    {
      question: "What goes up but never comes down?",
      answer: JSON.stringify(["age", "your age"]),
      difficulty: "easy",
      category: "Abstract",
      hint1: "A",
      hint2: "3 letters",
      tags: JSON.stringify(["time", "abstract"]),
    },

    // MEDIUM RIDDLES
    {
      question: "The more you take, the more you leave behind. What am I?",
      answer: JSON.stringify(["footsteps", "steps", "footprints"]),
      difficulty: "medium",
      category: "Abstract",
      hint1: "F",
      hint2: "9 letters (or 5)",
      tags: JSON.stringify(["abstract", "walking"]),
    },
    {
      question:
        "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
      answer: JSON.stringify(["fire", "flame"]),
      difficulty: "medium",
      category: "Nature",
      hint1: "F",
      hint2: "4 letters",
      tags: JSON.stringify(["elements", "nature"]),
    },
    {
      question: "I have branches, but no fruit, trunk, or leaves. What am I?",
      answer: JSON.stringify(["bank", "a bank"]),
      difficulty: "medium",
      category: "Wordplay",
      hint1: "B",
      hint2: "4 letters",
      tags: JSON.stringify(["finance", "double-meaning"]),
    },
    {
      question: "I can be cracked, made, told, and played. What am I?",
      answer: JSON.stringify(["joke", "a joke"]),
      difficulty: "medium",
      category: "Wordplay",
      hint1: "J",
      hint2: "4 letters",
      tags: JSON.stringify(["humor", "language"]),
    },
    {
      question: "What begins with T, ends with T, and has T in it?",
      answer: JSON.stringify(["teapot", "a teapot"]),
      difficulty: "medium",
      category: "Wordplay",
      hint1: "T",
      hint2: "6 letters",
      tags: JSON.stringify(["letters", "objects"]),
    },
    {
      question: "I am full of holes but still hold water. What am I?",
      answer: JSON.stringify(["sponge", "a sponge"]),
      difficulty: "medium",
      category: "Objects",
      hint1: "S",
      hint2: "6 letters",
      tags: JSON.stringify(["cleaning", "paradox"]),
    },
    {
      question: "What has words but never speaks?",
      answer: JSON.stringify(["book", "a book"]),
      difficulty: "medium",
      category: "Objects",
      hint1: "B",
      hint2: "4 letters",
      tags: JSON.stringify(["reading", "everyday"]),
    },
    {
      question: "What has a thumb and four fingers but is not alive?",
      answer: JSON.stringify(["glove", "a glove"]),
      difficulty: "medium",
      category: "Objects",
      hint1: "G",
      hint2: "5 letters",
      tags: JSON.stringify(["clothing", "everyday"]),
    },
    {
      question: "What belongs to you but others use it more than you do?",
      answer: JSON.stringify(["name", "your name"]),
      difficulty: "medium",
      category: "Abstract",
      hint1: "N",
      hint2: "4 letters",
      tags: JSON.stringify(["identity", "abstract"]),
    },
    {
      question: "What gets bigger the more you take away?",
      answer: JSON.stringify(["hole", "a hole"]),
      difficulty: "medium",
      category: "Abstract",
      hint1: "H",
      hint2: "4 letters",
      tags: JSON.stringify(["abstract", "paradox"]),
    },
    {
      question: "What has a face and two hands but no arms or legs?",
      answer: JSON.stringify(["clock", "a clock"]),
      difficulty: "medium",
      category: "Objects",
      hint1: "C",
      hint2: "5 letters",
      tags: JSON.stringify(["time", "everyday"]),
    },
    {
      question: "What can you catch but not throw?",
      answer: JSON.stringify(["cold", "a cold"]),
      difficulty: "medium",
      category: "Wordplay",
      hint1: "C",
      hint2: "4 letters",
      tags: JSON.stringify(["health", "wordplay"]),
    },

    // HARD RIDDLES
    {
      question:
        "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?",
      answer: JSON.stringify(["r", "the letter r"]),
      difficulty: "hard",
      category: "Wordplay",
      hint1: "R",
      hint2: "1 letter",
      tags: JSON.stringify(["letters", "tricky"]),
    },
    {
      question:
        "A man pushes his car to a hotel and tells the owner he's bankrupt. Why?",
      answer: JSON.stringify([
        "monopoly",
        "playing monopoly",
        "he is playing monopoly",
      ]),
      difficulty: "hard",
      category: "Lateral Thinking",
      hint1: "M",
      hint2: "8 letters",
      tags: JSON.stringify(["game", "tricky"]),
    },
    {
      question:
        "I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?",
      answer: JSON.stringify(["pencil lead", "graphite", "lead"]),
      difficulty: "hard",
      category: "Objects",
      hint1: "P or G or L",
      hint2: "11 letters (or 8 or 4)",
      tags: JSON.stringify(["writing", "everyday"]),
    },
    {
      question:
        "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?",
      answer: JSON.stringify(["river", "a river"]),
      difficulty: "hard",
      category: "Nature",
      hint1: "R",
      hint2: "5 letters",
      tags: JSON.stringify(["water", "nature", "poetic"]),
    },
    {
      question:
        "I am always hungry, I must always be fed. The finger I touch will soon turn red. What am I?",
      answer: JSON.stringify(["fire", "flame"]),
      difficulty: "hard",
      category: "Nature",
      hint1: "F",
      hint2: "4 letters",
      tags: JSON.stringify(["elements", "nature"]),
    },
    {
      question: "What has a ring but no finger?",
      answer: JSON.stringify(["telephone", "phone", "a telephone"]),
      difficulty: "hard",
      category: "Objects",
      hint1: "T or P",
      hint2: "10 letters (or 5)",
      tags: JSON.stringify(["communication", "everyday"]),
    },
    {
      question:
        "The person who makes it has no need of it; the person who buys it has no use for it. The person who uses it can neither see nor feel it. What is it?",
      answer: JSON.stringify(["coffin", "a coffin"]),
      difficulty: "hard",
      category: "Abstract",
      hint1: "C",
      hint2: "6 letters",
      tags: JSON.stringify(["abstract", "dark"]),
    },
    {
      question: "What has a heart that doesn't beat?",
      answer: JSON.stringify(["artichoke", "an artichoke"]),
      difficulty: "hard",
      category: "Nature",
      hint1: "A",
      hint2: "9 letters",
      tags: JSON.stringify(["food", "nature"]),
    },
    {
      question:
        "I have no feet, no hands, no wings, but I can climb a wall. What am I?",
      answer: JSON.stringify(["snail", "a snail"]),
      difficulty: "hard",
      category: "Nature",
      hint1: "S",
      hint2: "5 letters",
      tags: JSON.stringify(["animals", "nature"]),
    },
    {
      question: "What has a bottom at the top?",
      answer: JSON.stringify(["leg", "legs", "your leg"]),
      difficulty: "hard",
      category: "Wordplay",
      hint1: "L",
      hint2: "3 letters",
      tags: JSON.stringify(["body", "wordplay"]),
    },
    {
      question: "What goes through cities and fields, but never moves?",
      answer: JSON.stringify(["road", "a road"]),
      difficulty: "hard",
      category: "Objects",
      hint1: "R",
      hint2: "4 letters",
      tags: JSON.stringify(["travel", "infrastructure"]),
    },
    {
      question:
        "I am lighter than a feather, but the strongest person can't hold me for more than 5 minutes. What am I?",
      answer: JSON.stringify(["breath", "your breath"]),
      difficulty: "hard",
      category: "Abstract",
      hint1: "B",
      hint2: "6 letters",
      tags: JSON.stringify(["body", "abstract"]),
    },
    {
      question:
        "What has keys but opens no locks, has space but no room, and you can enter but not go inside?",
      answer: JSON.stringify(["keyboard", "a keyboard"]),
      difficulty: "hard",
      category: "Technology",
      hint1: "K",
      hint2: "8 letters",
      tags: JSON.stringify(["technology", "computer"]),
    },
    {
      question: "What can fill a room but takes up no space?",
      answer: JSON.stringify(["light", "lighting"]),
      difficulty: "hard",
      category: "Abstract",
      hint1: "L",
      hint2: "5 letters",
      tags: JSON.stringify(["abstract", "physics"]),
    },
    {
      question:
        "What has a face that doesn't frown, hands that don't wave, but tells time?",
      answer: JSON.stringify(["clock", "a clock"]),
      difficulty: "hard",
      category: "Objects",
      hint1: "C",
      hint2: "5 letters",
      tags: JSON.stringify(["time", "everyday"]),
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
      name: "First Steps",
      description: "Solve your first riddle",
      icon: "trophy",
      condition: "solve_1_riddles",
      reward: 10,
    },
    {
      name: "Getting Started",
      description: "Solve 5 riddles",
      icon: "star",
      condition: "solve_5_riddles",
      reward: 25,
    },
    {
      name: "Riddle Enthusiast",
      description: "Solve 25 riddles",
      icon: "award",
      condition: "solve_25_riddles",
      reward: 50,
    },
    {
      name: "Speed Demon",
      description: "Solve a riddle in under 30 seconds",
      icon: "zap",
      condition: "solve_under_30s",
      reward: 25,
    },
    {
      name: "No Hints Hero",
      description: "Solve 10 riddles without using hints",
      icon: "shield",
      condition: "solve_10_no_hints",
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

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
