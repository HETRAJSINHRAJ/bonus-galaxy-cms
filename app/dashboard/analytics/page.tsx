'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalMissions: number;
  activeMissions: number;
  totalCompletions: number;
  totalUsers: number;
  averageCompletionRate: number;
  topMissions: Array<{
    id: string;
    title: string;
    completions: number;
    points: number;
  }>;
  recentActivity: Array<{
    id: string;
    userId: string;
    missionTitle: string;
    completedAt: string;
    pointsEarned: number;
  }>;
  completionTrend: Array<{
    date: string;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/missions/analytics?range=${timeRange}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-2">Mission performance and user engagement metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Missions</p>
              <p className="text-3xl font-bold text-white mt-2">{data?.totalMissions || 0}</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {data?.activeMissions || 0} active
          </p>
        </div>

        <div className="glass-dark rounded-xl border border-gray-700/50 p-6 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Completions</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{data?.totalCompletions || 0}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Across all missions
          </p>
        </div>

        <div className="glass-dark rounded-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{data?.totalUsers || 0}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            With mission activity
          </p>
        </div>

        <div className="glass-dark rounded-xl border border-gray-700/50 p-6 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">
                {data?.averageCompletionRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Average across missions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Missions */}
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Missions</h3>
          <div className="space-y-4">
            {data?.topMissions?.length ? (
              data.topMissions.map((mission, index) => (
                <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 text-cyan-400 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{mission.title}</p>
                      <p className="text-xs text-gray-400">{mission.completions} completions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-400">{mission.points} pts</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {data?.recentActivity?.length ? (
              data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border-b border-gray-700/30 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.missionTitle}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.completedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-green-400">
                      +{activity.pointsEarned} pts
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Completion Trend Chart Placeholder */}
      <div className="mt-6 glass-dark rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Completion Trend</h3>
        <div className="h-64 flex items-center justify-center bg-gray-800/30 rounded-lg border border-gray-700/30">
          <p className="text-gray-400">Chart visualization coming soon</p>
        </div>
      </div>
    </div>
  );
}
