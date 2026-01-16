import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@/lib/auth';
import { DashboardLayout as DashboardLayoutClient } from '@/components/dashboard-layout-client';

export default async function AdminLayout({
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
  const allowedRoles = [Role.ADMIN, Role.SUPER_ADMIN];

  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect('/access-denied');
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
