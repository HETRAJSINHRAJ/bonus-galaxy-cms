import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@/lib/auth';
import { MissionsList } from '@/components/missions/MissionsList';

export default async function MissionsPage() {
  const user = await currentUser();
  const userRole = user?.publicMetadata?.role as Role;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Missions</h1>
        <p className="text-gray-400 mt-2">Manage and monitor all missions</p>
      </div>

      <MissionsList userRole={userRole} />
    </div>
  );
}
