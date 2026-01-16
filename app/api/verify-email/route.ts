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

    console.log('Email verification attempt:', email);
    console.log('Users found:', users.data.length);

    if (users.data.length === 0) {
      console.log('No user found with email:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users.data[0];
    const publicMetadata = user.publicMetadata as { role?: string };
    const userRole = publicMetadata?.role;

    console.log('User found:', user.id, 'Role:', userRole);

    // Check if user has a valid role
    if (!userRole || !['viewer', 'editor', 'admin', 'super_admin'].includes(userRole)) {
      console.log('User does not have valid role:', userRole);
      return NextResponse.json({ 
        error: 'No valid role assigned. Please visit /setup-admin to grant access.' 
      }, { status: 403 });
    }

    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: userRole,
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
