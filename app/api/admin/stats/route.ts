import { NextRequest, NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/services';
import { verifyAuthToken } from '@/lib/auth-token';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const auth = req.headers.get("authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    const adminId = verifyAuthToken(token);

    if (!adminId || adminId !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getAdminStats();
    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
