import { NextRequest, NextResponse } from 'next/server';
import { getUsersPaginated } from '@/lib/services';
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

    const { searchParams } = new URL(req.url);
    const pageParam = Number(searchParams.get('page'));
    const pageSizeParam = Number(searchParams.get('pageSize'));
    const search = searchParams.get('search') || undefined;

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize =
      Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 12;

    const data = await getUsersPaginated({ page, pageSize, search });

    return NextResponse.json(
      {
        users: data.users,
        meta: {
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
