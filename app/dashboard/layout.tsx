import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@/lib/auth';
import { DashboardLayout as DashboardLayoutClient } from '@/components/dashboard-layout-client';

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

  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    emailAddresses: [{
      emailAddress: user.emailAddresses[0]?.emailAddress || '',
    }],
  };

  return (
    <DashboardLayoutClient user={userData} userRole={userRole}>
      {children}
    </DashboardLayoutClient>
  );
}
