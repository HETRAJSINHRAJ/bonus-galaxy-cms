'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface MissionFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
}

export function MissionForm({ mode, initialData }: MissionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'daily',
    category: initialData?.category || 'engagement',
    points: initialData?.points || 10,
    icon: initialData?.icon || '🎯',
    isActive: initialData?.isActive ?? true,
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    maxCompletions: initialData?.maxCompletions || '',
    requirementType: 'custom',
    requirements: initialData?.requirements || {},
    validationRules: initialData?.validationRules || {},
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mode === 'create' 
        ? '/api/admin/missions'
        : `/api/admin/missions/${initialData.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PATCH';

      // Build payload matching the CreateMissionSchema
      const payload: any = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        pointsReward: parseInt(formData.points.toString()),
        bonusReward: 0,
        isActive: formData.isActive,
        requirements: {
          type: formData.requirementType,
          details: typeof formData.requirements === 'string' 
            ? { description: formData.requirements } 
            : formData.requirements,
        },
        iconName: formData.icon,
        displayOrder: 0,
        tags: [],
      };

      // Add optional fields only if they have values
      if (formData.startDate) {
        payload.startDate = new Date(formData.startDate).toISOString();
      }
      if (formData.endDate) {
        payload.endDate = new Date(formData.endDate).toISOString();
      }
      if (formData.maxCompletions) {
        payload.maxCompletions = parseInt(formData.maxCompletions.toString());
      }
      
      // Add validationRules only if they exist
      if (formData.validationRules && Object.keys(formData.validationRules).length > 0) {
        payload.validationRules = formData.validationRules;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save mission');
      }

      router.push('/dashboard/missions');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <div className="mb-6 bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="glass-dark rounded-xl border border-gray-700/50 p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="Complete 5 daily check-ins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="Check in every day for 5 consecutive days to earn bonus points"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="🎯"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Points *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="one_time">One Time</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                >
                  <option value="engagement">Engagement</option>
                  <option value="social">Social</option>
                  <option value="achievement">Achievement</option>
                  <option value="referral">Referral</option>
                  <option value="purchase">Purchase</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Schedule (Optional)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Completions (Optional)
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxCompletions || ''}
                onChange={(e) => setFormData({ ...formData, maxCompletions: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="Leave empty for unlimited"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum number of times this mission can be completed per user</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 bg-gray-800 border-gray-700 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
                Mission is active
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-700/50">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Mission' : 'Update Mission'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg font-medium hover:bg-gray-700/50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
