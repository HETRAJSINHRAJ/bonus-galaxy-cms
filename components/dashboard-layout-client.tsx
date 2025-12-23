'use client';

import { useClerk } from '@clerk/nextjs';
import { AppSidebar } from './app-sidebar';
import { MobileSidebar } from './mobile-sidebar';
import { Role } from '@/lib/roles';

interface DashboardShellProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    emailAddresses: { emailAddress: string }[];
  };
  userRole: Role;
  children: React.ReactNode;
}

export function DashboardLayout({ user, userRole, children }: DashboardShellProps) {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
          <AppSidebar 
            user={user} 
            userRole={userRole} 
            onSignOut={() => signOut()}
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 lg:pl-64">
          {/* Mobile Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl px-4 lg:hidden">
            <MobileSidebar 
              user={user} 
              userRole={userRole} 
              onSignOut={() => signOut()}
            />
            <div className="flex items-center gap-3">
              <img 
                src="/images/bonus-galaxy-logo.png" 
                alt="Bonus Galaxy" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-sm font-bold text-white">Bonus Galaxy</span>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
