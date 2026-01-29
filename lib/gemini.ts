
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-pro" }) : null;

export interface GeneratedRiddle {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  hint1: string;
  hint2: string;
}

export async function generateRiddles(count: number = 3, difficulty?: string): Promise<GeneratedRiddle[]> {
  if (!model) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const validDifficulty = difficulty && ["easy", "medium", "hard"].includes(difficulty.toLowerCase()) 
    ? difficulty.toLowerCase() 
    : "mixed";

  const prompt = `
    You are a creative riddle generator game master.
    Generate ${count} unique, clever riddles.
    ${validDifficulty !== "mixed" ? `All riddles should have ${validDifficulty} difficulty.` : "Mix difficulties: easy, medium, and hard."}
    
    Output NOTING BUT a valid JSON array of objects.
    Each object must have these exact fields:
    - question: The riddle text
    - answer: The answer (short, usually 1-3 words)
    - difficulty: "easy", "medium", or "hard"
    - hint1: A subtle hint
    - hint2: A stronger hint

    Example JSON format:
    [
      {
        "question": "I have keys but no locks. I have space but no room. You can enter but never leave. What am I?",
        "answer": "A keyboard",
        "difficulty": "easy",
        "hint1": "You are using one right now.",
        "hint2": "It has letters and numbers."
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting in response (e.g. ```json ... ```)
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const riddles: GeneratedRiddle[] = JSON.parse(jsonStr);
    
    // Validate output structure
    if (!Array.isArray(riddles)) {
      throw new Error("AI did not return an array");
    }

    return riddles.map(r => ({
        question: r.question,
        answer: r.answer,
        difficulty: (["easy", "medium", "hard"].includes(r.difficulty.toLowerCase()) ? r.difficulty.toLowerCase() : "medium") as "easy" | "medium" | "hard",
        hint1: r.hint1 || "No hint available",
        hint2: r.hint2 || "No hint available"
    }));

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Failed to generate riddles with AI");
  }
}
