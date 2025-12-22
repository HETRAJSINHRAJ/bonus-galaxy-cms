import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Search for user by email
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users.data[0];
    const publicMetadata = user.publicMetadata as { role?: string };

    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: publicMetadata?.role || 'No role assigned',
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
