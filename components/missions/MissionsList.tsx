'use client';

import { useState, useEffect } from 'react';
import { Role } from '@/lib/types';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <Input
                type="text"
                placeholder="Search missions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="one-time">One Time</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="text-xs lg:text-sm text-gray-400">Total Missions</div>
            <div className="text-xl lg:text-2xl font-bold text-white mt-1">{missions.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="text-xs lg:text-sm text-gray-400">Active</div>
            <div className="text-xl lg:text-2xl font-bold text-green-400 mt-1">
              {missions.filter(m => m.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="text-xs lg:text-sm text-gray-400">Inactive</div>
            <div className="text-xl lg:text-2xl font-bold text-gray-500 mt-1">
              {missions.filter(m => !m.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="text-xs lg:text-sm text-gray-400">Total Completions</div>
            <div className="text-xl lg:text-2xl font-bold text-cyan-400 mt-1">
              {missions.reduce((acc, m) => acc + (m._count?.userProgress || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missions Table */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardContent className="p-0">
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded m-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {filteredMissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No missions found</p>
              {canEdit && (
                <Link href="/dashboard/missions/create">
                  <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    Create First Mission
                  </Button>
                </Link>
              )}
            </div>
          ) : (
          <div className="relative">
            {/* Scroll indicator hint for mobile */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none lg:hidden z-10"></div>
            
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50">
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead className="bg-gray-800/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Mission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Completions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(mission.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
