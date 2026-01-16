import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/services';

export async function GET() {
  try {
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
