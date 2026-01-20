import { NextRequest, NextResponse } from "next/server";
import { getActivityLogsPaginated } from "@/lib/services";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageParam = Number(searchParams.get("page"));
    const pageSizeParam = Number(searchParams.get("pageSize"));
    const type = searchParams.get("type") as "admin" | "user" | null;
    const activityType = searchParams.get("activityType") || undefined;

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize =
      Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 10;

    const data = await getActivityLogsPaginated({
      page,
      pageSize,
      type: type || undefined,
      activityType,
    });

    return NextResponse.json(
      {
        activities: data.activities,
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
    console.error("Failed to fetch activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}
