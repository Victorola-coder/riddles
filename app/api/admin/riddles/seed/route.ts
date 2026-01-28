import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const riddles = [
      {
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        answer: JSON.stringify(["Echo", "An echo"]),
        difficulty: "easy",
        category: "Nature",
        hint1: "It shares its name with a smart speaker device.",
        hint2: "Starts with E.",
        order: 10
      },
      {
        question: "The more of this there is, the less you see. What is it?",
        answer: JSON.stringify(["Darkness", "The dark"]),
        difficulty: "easy",
        category: "Abstract",
        hint1: "You might need a light.",
        hint2: "The opposite of light.",
        order: 11
      },
      {
        question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        answer: JSON.stringify(["Map", "A map"]),
        difficulty: "medium",
        category: "Objects",
        hint1: "You use me to find your way.",
        hint2: "I am usually made of paper or on a screen.",
        order: 12
      },
      {
        question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        answer: JSON.stringify(["The letter M", "Letter M", "M"]),
        difficulty: "medium",
        category: "Wordplay",
        hint1: "Look at the spelling of the words.",
        hint2: "It's a character in the alphabet.",
        order: 13
      },
      {
        question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
        answer: JSON.stringify(["Fire", "A fire", "Flame"]),
        difficulty: "medium",
        category: "Elements",
        hint1: "It produces heat and light.",
        hint2: "Combustion.",
        order: 14
      },
      {
        question: "What has a head and a tail but no body?",
        answer: JSON.stringify(["Coin", "A coin", "Penny", "Quarter"]),
        difficulty: "easy",
        category: "Objects",
        hint1: "You flip it to make a decision.",
        hint2: "Money.",
        order: 15
      },
      {
        question: "What can travel all around the world without leaving its corner?",
        answer: JSON.stringify(["Stamp", "A stamp", "Postage stamp"]),
        difficulty: "hard",
        category: "Objects",
        hint1: "It goes on an envelope.",
        hint2: "You lick it (usually).",
        order: 16
      },
      {
        question: "What kind of room has no doors or windows?",
        answer: JSON.stringify(["Mushroom", "A mushroom"]),
        difficulty: "easy",
        category: "Wordplay",
        hint1: "It's a fungus.",
        hint2: "Edible (sometimes).",
        order: 17
      },
      {
        question: "What gets wet while drying?",
        answer: JSON.stringify(["Towel", "A towel"]),
        difficulty: "medium",
        category: "Household",
        hint1: "You use it after a shower.",
        hint2: "Made of fabric.",
        order: 18
      },
      {
        question: "The person who makes it has no need of it; the person who buys it has no use for it. The person who uses it can neither see nor feel it. What is it?",
        answer: JSON.stringify(["Coffin", "A coffin", "Casket"]),
        difficulty: "hard",
        category: "Dark",
        hint1: "It's for the dead.",
        hint2: "Burial.",
        order: 19
      }
    ];

    let count = 0;
    for (const r of riddles) {
      const existing = await prisma.riddle.findUnique({
        where: { question: r.question },
      });

      if (!existing) {
        await prisma.riddle.create({ data: r });
        count++;
      }
    }

    return NextResponse.json({ success: true, message: `Seeded ${count} riddles` });
  } catch (error) {
    console.error("Failed to seed riddles:", error);
    return NextResponse.json(
      { error: "Failed to seed riddles" },
      { status: 500 }
    );
  }
}
