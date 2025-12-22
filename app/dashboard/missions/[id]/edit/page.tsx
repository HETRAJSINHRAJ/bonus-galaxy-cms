import { currentUser } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { Role } from '@/lib/auth';
import { MissionForm } from '@/components/missions/MissionForm';
import prisma from '@/lib/prisma';

export default async function EditMissionPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();
  const userRole = user?.publicMetadata?.role as Role;

  // Only editors and above can edit missions
  if (![Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN].includes(userRole)) {
    redirect('/dashboard');
  }

  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
  });

  if (!mission) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Mission</h1>
        <p className="text-gray-600 mt-2">Update mission details</p>
      </div>

      <MissionForm 
        mode="edit" 
        initialData={{
          ...mission,
          startDate: mission.startDate ? new Date(mission.startDate).toISOString().slice(0, 16) : '',
          endDate: mission.endDate ? new Date(mission.endDate).toISOString().slice(0, 16) : '',
        }}
      />
    </div>
  );
}
