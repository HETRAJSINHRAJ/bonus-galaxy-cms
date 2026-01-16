import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('[verify-email] Attempting to verify:', email);

    // Check if Clerk keys are configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.error('[verify-email] CLERK_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }

    // Search for user by email
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    console.log('[verify-email] Users found:', users.data.length);

    if (users.data.length === 0) {
      console.log('[verify-email] No user found with email:', email);
      return NextResponse.json({ 
        error: 'User not found. Please use /setup-admin to create your account first.' 
      }, { status: 404 });
    }

    const user = users.data[0];
    const publicMetadata = user.publicMetadata as { role?: string };
    const userRole = publicMetadata?.role;

    console.log('[verify-email] User found:', user.id, 'Role:', userRole);

    // Check if user has a valid role
    if (!userRole || !['viewer', 'editor', 'admin', 'super_admin'].includes(userRole)) {
      console.log('[verify-email] User does not have valid role:', userRole);
      return NextResponse.json({ 
        error: 'No valid role assigned. Please visit /setup-admin to grant access.',
        hint: 'Go to /setup-admin after signing in to set your role.'
      }, { status: 403 });
    }

    console.log('[verify-email] Verification successful for:', email);

    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: userRole,
    });
  } catch (error) {
    console.error('[verify-email] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify email. Please try /simple-sign-in or /setup-admin instead.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
