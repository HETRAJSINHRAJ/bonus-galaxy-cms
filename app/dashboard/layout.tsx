import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@/lib/auth';
import { SignOutButton } from '@/components/SignOutButton';
import { ActiveLink } from '@/components/ActiveLink';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if user has admin access
  const userRole = user.publicMetadata?.role as Role;
  const allowedRoles = [Role.VIEWER, Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN];

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="glass-dark rounded-2xl p-8 max-w-md text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-300 mb-4">You don't have permission to access the Mission CMS.</p>
          <p className="text-sm text-gray-400">Please contact an administrator to request access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex">
        {/* Modern Sidebar */}
        <aside className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-700/50 min-h-screen fixed flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <img 
                src="/images/bonus-galaxy-logo.png" 
                alt="Bonus Galaxy" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h2 className="text-lg font-bold text-white">Bonus Galaxy</h2>
                
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for..."
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1 flex-1 overflow-y-auto py-2">
            <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Overview</div>
            <ActiveLink
              href="/dashboard"
              icon={
                <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400  transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
              }
            >
              Dashboard
            </ActiveLink>

            <ActiveLink
              href="/dashboard/missions"
              icon={
                <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            >
              Missions
            </ActiveLink>

            <ActiveLink
              href="/dashboard/analytics"
              icon={
                <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            >
              Analytics
              <span className="ml-auto bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-semibold">New</span>
            </ActiveLink>

            {(userRole === Role.EDITOR || userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN) && (
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2 mt-4">Actions</div>
                <ActiveLink
                  href="/dashboard/missions/create"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                  className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  activeClassName="text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/20"
                >
                  Create Mission
                </ActiveLink>
              </>
            )}

            {(userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN) && (
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2 mt-4">Admin</div>
                <ActiveLink
                  href="/dashboard/users"
                  icon={
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                >
                  Users
                </ActiveLink>

                <ActiveLink
                  href="/dashboard/settings"
                  icon={
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                >
                  Settings
                </ActiveLink>
              </>
            )}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all cursor-pointer">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName || 'User'} 
                  className="w-10 h-10 rounded-full border-2 border-cyan-500/50"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
