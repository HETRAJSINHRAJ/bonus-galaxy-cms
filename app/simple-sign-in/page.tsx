'use client';

import { SignIn } from '@clerk/nextjs';

/**
 * Simple Sign-In Page
 * Uses Clerk's standard sign-in component without custom email verification
 * Use this if the custom sign-in page has issues
 * 
 * Access at: /simple-sign-in
 */
export default function SimpleSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-white">Bonus Galaxy CMS</h1>
          </div>
          <p className="text-gray-300 text-sm">Simple Sign-In</p>
        </div>

        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 shadow-2xl",
            }
          }}
          redirectUrl="/setup-admin"
          signUpUrl="/sign-up"
        />

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            After signing in, you'll be redirected to setup your admin access.
          </p>
        </div>
      </div>
    </div>
  );
}
