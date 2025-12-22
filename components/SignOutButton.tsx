'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700/50 hover:border-red-500/50"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
