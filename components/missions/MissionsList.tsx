'use client';

import { useState, useEffect } from 'react';
import { Role } from '@/lib/types';
import Link from 'next/link';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  points: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  _count?: {
    userProgress: number;
  };
}

export function MissionsList({ userRole }: { userRole: Role }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMissions();
  }, [filterType, filterStatus]);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('isActive', filterStatus);

      const response = await fetch(`/api/admin/missions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch missions');
      
      const data = await response.json();
      setMissions(data.missions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mission?')) return;

    try {
      const response = await fetch(`/api/admin/missions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete mission');
      
      setMissions(missions.filter(m => m.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/missions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update mission');
      
      const updated = await response.json();
      setMissions(missions.map(m => m.id === id ? updated : m));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const filteredMissions = missions.filter(mission =>
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canEdit = [Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN].includes(userRole);
  const canDelete = [Role.ADMIN, Role.SUPER_ADMIN].includes(userRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading missions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search missions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          >
            <option value="all">All Types</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="one_time">One Time</option>
            <option value="special">Special</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <div className="text-sm text-gray-400">Total Missions</div>
          <div className="text-2xl font-bold text-white mt-1">{missions.length}</div>
        </div>
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <div className="text-sm text-gray-400">Active</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {missions.filter(m => m.isActive).length}
          </div>
        </div>
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <div className="text-sm text-gray-400">Inactive</div>
          <div className="text-2xl font-bold text-gray-500 mt-1">
            {missions.filter(m => !m.isActive).length}
          </div>
        </div>
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <div className="text-sm text-gray-400">Total Completions</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {missions.reduce((acc, m) => acc + (m._count?.userProgress || 0), 0)}
          </div>
        </div>
      </div>

      {/* Missions Table */}
      <div className="glass-dark rounded-xl border border-gray-700/50 overflow-hidden">
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {filteredMissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No missions found</p>
            {canEdit && (
              <Link
                href="/dashboard/missions/create"
                className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20"
              >
                Create First Mission
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Mission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Completions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {filteredMissions.map((mission) => (
                  <tr key={mission.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{mission.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-md">{mission.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-400 rounded-full">
                        {mission.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {mission.points} pts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => canEdit && toggleActive(mission.id, mission.isActive)}
                        disabled={!canEdit}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          mission.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-700/50 text-gray-400'
                        } ${canEdit ? 'cursor-pointer hover:opacity-75' : 'cursor-not-allowed'}`}
                      >
                        {mission.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {mission._count?.userProgress || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/dashboard/missions/${mission.id}`}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        View
                      </Link>
                      {canEdit && (
                        <Link
                          href={`/dashboard/missions/${mission.id}/edit`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Edit
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(mission.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
