'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    systemName: 'Bonus Galaxy Mission CMS',
    enableNotifications: true,
    autoActivateMissions: false,
    defaultPoints: 10,
    maxDailyCompletions: 5,
    enableAnalytics: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Configure system settings and preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* General Settings */}
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                System Name
              </label>
              <input
                type="text"
                value={settings.systemName}
                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Default Points per Mission
              </label>
              <input
                type="number"
                min="1"
                value={settings.defaultPoints}
                onChange={(e) => setSettings({ ...settings, defaultPoints: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Daily Completions per User
              </label>
              <input
                type="number"
                min="1"
                value={settings.maxDailyCompletions}
                onChange={(e) => setSettings({ ...settings, maxDailyCompletions: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable Notifications</p>
                <p className="text-xs text-gray-400">Send notifications for mission completions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Auto-Activate Missions</p>
                <p className="text-xs text-gray-400">Automatically activate missions on creation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoActivateMissions}
                  onChange={(e) => setSettings({ ...settings, autoActivateMissions: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable Analytics</p>
                <p className="text-xs text-gray-400">Track and display analytics data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAnalytics}
                  onChange={(e) => setSettings({ ...settings, enableAnalytics: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="glass-dark rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-700/30">
              <span className="text-sm text-gray-400">Version</span>
              <span className="text-sm font-medium text-white">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/30">
              <span className="text-sm text-gray-400">Environment</span>
              <span className="text-sm font-medium text-white">Development</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/30">
              <span className="text-sm text-gray-400">Database</span>
              <span className="text-sm font-medium text-green-400">Connected</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-400">API Status</span>
              <span className="text-sm font-medium text-green-400">Operational</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg font-medium hover:bg-gray-700/50 transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
