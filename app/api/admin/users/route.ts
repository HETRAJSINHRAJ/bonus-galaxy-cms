import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({ limit: 100 });

    return NextResponse.json({
      users: users.data,
      total: users.totalCount,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
