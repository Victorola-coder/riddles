import { signAuthToken } from "@/lib/auth-token";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_USER_ID = "admin"; // Special admin user ID

/**
 * Admin authentication endpoint
 * POST /api/admin/auth
 * Body: { accessCode: string }
 * Returns: { token: string, success: true }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessCode } = body;

    if (!accessCode) {
      return NextResponse.json(
        { error: "Access code is required" },
        { status: 400 }
      );
    }

    // Find admin in database by code
    const admin = await prisma.admin.findUnique({
      where: { code: accessCode },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid access code" },
        { status: 401 }
      );
    }

    // Generate a long-lived admin token (30 days)
    const token = signAuthToken(ADMIN_USER_ID, "30d");

    return NextResponse.json({ token, success: true }, { status: 200 });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
