import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId: requestUserId } = await req.json();
    const { userId: authUserId } = await auth();

    // Verify the user is authenticated and requesting for themselves
    if (!authUserId || authUserId !== requestUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update user's public metadata with super_admin role
    const client = await clerkClient();
    await client.users.updateUser(authUserId, {
      publicMetadata: {
        role: 'super_admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Super admin role granted successfully',
    });
  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: 'Failed to set admin role' },
      { status: 500 }
    );
  }
}
