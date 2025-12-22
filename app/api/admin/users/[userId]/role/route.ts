import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { role } = await request.json();
    const { userId } = await params;

    if (!role || !['viewer', 'editor', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
