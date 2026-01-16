'use client';

import { useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('Already signed in, redirecting to dashboard...');
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Sign in directly with Clerk
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // Middleware will check for role and redirect to setup-admin if needed
        router.push('/dashboard');
      } else {
        setError('Sign-in requires additional verification. Please contact your administrator.');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      const errorMessage = err.errors?.[0]?.message || err.errors?.[0]?.longMessage;
      
      // Check if already signed in
      if (errorMessage?.includes('already signed in')) {
        setError('You are already signed in. Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 1500);
        return;
      }
      
      if (errorMessage?.includes('password') || errorMessage?.includes('Incorrect')) {
        setError('Incorrect email or password. Please try again.');
      } else if (errorMessage?.includes('not found')) {
        setError('Account not found. Please contact your administrator for access.');
      } else {
        setError(errorMessage || 'Sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth status
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirecting message if already signed in
  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Already signed in. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/images/bonus-galaxy-logo.png" 
              alt="Bonus Galaxy" 
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-3xl font-bold text-white">Bonus Galaxy</h1>
          </div>
        </div>

        <div className="glass-dark rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-white">Admin Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-center text-gray-400">
              Only authorized admin accounts can access this system.<br />
              Contact your system administrator for access.
            </p>
            <p className="text-xs text-center text-gray-500 mt-2">
              Need to set up admin access? Visit <a href="/setup-admin" className="text-cyan-400 hover:text-cyan-300">/setup-admin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
