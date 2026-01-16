import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-out(.*)',
  '/access-denied',
  '/setup-admin',
  '/api/webhooks(.*)',
  '/api/verify-email',
  '/api/setup-admin',
  '/partner/redeem', // Public partner redemption portal
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes without any checks
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Get auth state
  const { userId } = await auth();

  // If user is not authenticated, protect the route (will redirect to sign-in)
  if (!userId) {
    await auth.protect();
    return NextResponse.next();
  }

  // Fetch fresh user data directly from Clerk to ensure we have latest metadata
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const publicMetadata = user.publicMetadata as { role?: string } | undefined;
    const userRole = publicMetadata?.role;

    // If no valid role, redirect to setup-admin page
    if (!userRole || !['viewer', 'editor', 'admin', 'super_admin'].includes(userRole)) {
      // If already on setup-admin, allow access
      if (request.nextUrl.pathname === '/setup-admin') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/setup-admin', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
