'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalMissions: 0,
    activeMissions: 0,
    totalCompletions: 0,
    inactiveMissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/missions?limit=100');
      const data = await response.json();

      if (response.ok) {
        const missions = data.missions || [];
        setStats({
          totalMissions: missions.length,
          activeMissions: missions.filter((m: any) => m.isActive).length,
          inactiveMissions: missions.filter((m: any) => !m.isActive).length,
          totalCompletions: missions.reduce((sum: number, m: any) => sum + (m.currentCompletions || 0), 0),
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
        <p className="text-gray-400 mt-2">Overview of mission management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Missions</p>
              <p className="text-xs text-gray-500">All created missions</p>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl font-bold text-white">
              {loading ? '...' : stats.totalMissions}
            </h3>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Missions</p>
              <p className="text-xs text-gray-500">Currently running</p>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl font-bold text-green-400">
              {loading ? '...' : stats.activeMissions}
            </h3>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Inactive Missions</p>
              <p className="text-xs text-gray-500">Paused or draft</p>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl font-bold text-orange-400">
              {loading ? '...' : stats.inactiveMissions}
            </h3>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Completions</p>
              <p className="text-xs text-gray-500">User engagement</p>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl font-bold text-cyan-400">
              {loading ? '...' : stats.totalCompletions}
            </h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/missions/create"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg hover:from-cyan-500/20 hover:to-blue-500/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Create New Mission</span>
            </a>
            <a
              href="/dashboard/missions"
              className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">View All Missions</span>
            </a>
            <a
              href="/dashboard/analytics"
              className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Analytics Dashboard</span>
            </a>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Database</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">API Services</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Authentication</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
