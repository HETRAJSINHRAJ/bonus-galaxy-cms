import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Role } from '@/lib/auth';
import { MissionForm } from '@/components/missions/MissionForm';

export default async function CreateMissionPage() {
  const user = await currentUser();
  const userRole = user?.publicMetadata?.role as Role;

  // Only editors and above can create missions
  if (![Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN].includes(userRole)) {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create Mission</h1>
        <p className="text-gray-400 mt-2">Add a new mission to the system</p>
      </div>

      <MissionForm mode="create" />
    </div>
  );
}
