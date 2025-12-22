import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  const { id } = await params;
  
  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          userProgress: true,
        },
      },
    },
  });

  if (!mission) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{mission.title}</h1>
          <p className="text-gray-400 mt-2">Mission Details</p>
        </div>
        <div className="flex gap-3">
          <a
            href={`/dashboard/missions/${mission.id}/edit`}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Edit Mission
          </a>
          <a
            href="/dashboard/missions"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Missions
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-gray-200 mt-1">{mission.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <span className="inline-block mt-1 px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                    {mission.type}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <span className="inline-block mt-1 px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                    {mission.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Points Reward</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">{mission.pointsReward}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Completions</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">{mission._count.userProgress}</p>
                </div>
              </div>

              {mission.startDate && (
                <div>
                  <p className="text-sm text-gray-400">Start Date</p>
                  <p className="text-gray-200 mt-1">{new Date(mission.startDate).toLocaleString()}</p>
                </div>
              )}

              {mission.endDate && (
                <div>
                  <p className="text-sm text-gray-400">End Date</p>
                  <p className="text-gray-200 mt-1">{new Date(mission.endDate).toLocaleString()}</p>
                </div>
              )}

              {mission.maxCompletions && (
                <div>
                  <p className="text-sm text-gray-400">Max Completions</p>
                  <p className="text-gray-200 mt-1">{mission.maxCompletions} per user</p>
                </div>
              )}
            </div>
          </div>

          {/* Requirements & Validation */}
          {(mission.requirements || mission.validationRules) && (
            <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Requirements & Validation</h3>
              
              <div className="space-y-4">
                {mission.requirements && (
                  <div>
                    <p className="text-sm font-medium text-gray-300">Requirements</p>
                    <pre className="mt-2 p-3 bg-gray-900/50 border border-gray-700/50 rounded text-xs overflow-auto text-gray-300">
                      {JSON.stringify(mission.requirements, null, 2)}
                    </pre>
                  </div>
                )}

                {mission.validationRules && (
                  <div>
                    <p className="text-sm font-medium text-gray-300">Validation Rules</p>
                    <pre className="mt-2 p-3 bg-gray-900/50 border border-gray-700/50 rounded text-xs overflow-auto text-gray-300">
                      {JSON.stringify(mission.validationRules, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Active</span>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  mission.isActive 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                }`}>
                  {mission.isActive ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Created</span>
                <span className="text-sm text-gray-200">
                  {new Date(mission.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Updated</span>
                <span className="text-sm text-gray-200">
                  {new Date(mission.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {mission.displayOrder !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Display Order</span>
                  <span className="text-sm text-gray-200">{mission.displayOrder}</span>
                </div>
              )}

              {mission.currentCompletions !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Current Completions</span>
                  <span className="text-sm text-gray-200">{mission.currentCompletions}</span>
                </div>
              )}
            </div>
          </div>

          {mission.iconName && (
            <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Icon</h3>
              <div className="text-6xl text-center">{mission.iconName}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
