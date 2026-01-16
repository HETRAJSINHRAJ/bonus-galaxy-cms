'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupAdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const setAdminRole = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Admin role set successfully! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Failed to set admin role');
      }
    } catch (err) {
      setError('Failed to set admin role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-white">Please sign in first</div>
      </div>
    );
  }

  const currentRole = (user.publicMetadata as any)?.role;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-md w-full glass-dark rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Setup Admin Access</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-white">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="text-white">{user.firstName} {user.lastName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Current Role</p>
            <p className="text-white">{currentRole || 'No role assigned'}</p>
          </div>
        </div>

        {currentRole === 'super_admin' ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
            <p className="text-green-400 text-sm">
              ✅ You already have super admin access!
            </p>
          </div>
        ) : (
          <>
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                Click the button below to grant yourself super admin access to the Mission CMS.
              </p>
            </div>

            <button
              onClick={setAdminRole}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Grant Super Admin Access'}
            </button>
          </>
        )}

        {message && (
          <div className="mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-400 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {currentRole === 'super_admin' && (
          <a
            href="/dashboard"
            className="mt-4 block text-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
          >
            Go to Dashboard
          </a>
        )}
      </div>
    </div>
  );
}
