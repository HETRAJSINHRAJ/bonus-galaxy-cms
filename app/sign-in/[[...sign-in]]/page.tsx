'use client';

import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [userInfo, setUserInfo] = useState<{ 
    firstName?: string | null; 
    lastName?: string | null; 
    imageUrl?: string; 
    role?: string;
  } | null>(null);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Verify email and fetch user info from our API
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('This email is not authorized. Only admin accounts can access this system.');
        } else {
          setError('Unable to verify email. Please contact your administrator.');
        }
        return;
      }

      const userData = await response.json();
      setUserInfo(userData);
      setStep('password');
    } catch (err: any) {
      console.error('Email verification error:', err);
      setError('Unable to verify email. Please contact your administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      } else {
        setError('Your account has additional security enabled. Please contact your administrator to disable 2FA before accessing the CMS.');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      const errorMessage = err.errors?.[0]?.message || err.errors?.[0]?.longMessage;
      
      if (errorMessage?.includes('password')) {
        setError('Incorrect password. Please try again.');
      } else {
        setError(errorMessage || 'Sign-in failed. Please contact your administrator.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
    setError('');
    setUserInfo(null);
  };

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
          <h2 className="text-2xl font-semibold mb-6 text-white">Welcome Back</h2>
          
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                {isLoading ? 'Verifying...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="mb-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                  {userInfo?.imageUrl && (
                    <img 
                      src={userInfo.imageUrl} 
                      alt="User" 
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {(userInfo?.firstName || userInfo?.lastName) && (
                        <p className="text-base font-semibold text-white">
                          {userInfo.firstName} {userInfo.lastName}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{emailAddress}</p>
                    {userInfo?.role && (
                      <p className="text-xs text-cyan-400 font-medium mt-1">
                        Role: {userInfo.role}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  ← Change email
                </button>
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
                  autoFocus
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-center text-gray-400">
              Only authorized admin accounts can access this system.<br />
              Contact your system administrator for access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
