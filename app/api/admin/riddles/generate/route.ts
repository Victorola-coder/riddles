import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRiddles } from "@/lib/gemini";
import { requireAdminAuth } from "@/lib/admin-auth-server";

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { count = 5, difficulty, autoActivate = false } = await req.json();

    // Limit count to prevent abuse/timeouts
    const safeCount = Math.min(Math.max(1, count), 10);

    // Call Gemini
    const generatedRiddles = await generateRiddles(safeCount, difficulty);

    const createdRiddles = [];

    // Save to Check existing (simple duplicate check by question)
    for (const r of generatedRiddles) {
        
        // Skip exact duplicate questions
        const existing = await prisma.riddle.findFirst({
            where: { question: r.question }
        });
        
        if (!existing) {
             const newRiddle = await prisma.riddle.create({
                data: {
                    question: r.question,
                    answer: JSON.stringify([r.answer]), // Store as JSON array string
                    difficulty: r.difficulty,
                    hint1: r.hint1,
                    hint2: r.hint2,
                    isActive: autoActivate,
                    category: "AI Generated",
                    order: 9999, // Push to end or use a sorting strategy later
                }
            });
            createdRiddles.push(newRiddle);
        }
    }

    return NextResponse.json({ 
        message: `Generated ${generatedRiddles.length} riddles, saved ${createdRiddles.length} new ones.`,
        riddles: createdRiddles 
    });

  } catch (error: any) {
    console.error("Error generating AI riddles:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate riddles" },
      { status: 500 }
    );
  }
}
