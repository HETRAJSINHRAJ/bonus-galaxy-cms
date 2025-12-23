'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800/50 border-gray-700/50 text-white"
                placeholder="Complete 5 daily check-ins"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-gray-800/50 border-gray-700/50 text-white"
                placeholder="Check in every day for 5 consecutive days to earn bonus points"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-gray-300">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="bg-gray-800/50 border-gray-700/50 text-white"
                  placeholder="🎯"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points" className="text-gray-300">Points *</Label>
                <Input
                  id="points"
                  type="number"
                  required
                  min="1"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  className="bg-gray-800/50 border-gray-700/50 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-300">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="one-time">One Time</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Schedule (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-gray-800/50 border-gray-700/50 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-gray-800/50 border-gray-700/50 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxCompletions" className="text-gray-300">Max Completions (Optional)</Label>
              <Input
                id="maxCompletions"
                type="number"
                min="1"
                value={formData.maxCompletions || ''}
                onChange={(e) => setFormData({ ...formData, maxCompletions: e.target.value })}
                className="bg-gray-800/50 border-gray-700/50 text-white"
                placeholder="Leave empty for unlimited"
              />
              <p className="text-xs text-gray-400">Maximum number of times this mission can be completed per user</p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="text-gray-300">
                Mission is active
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Mission' : 'Update Mission'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-6 h-fit">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
            <CardDescription className="text-gray-400">
              See how your mission will appear to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{formData.icon || '🎯'}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {formData.title || 'Mission Title'}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {formData.description || 'Mission description will appear here'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="text-sm text-gray-400 capitalize">{formData.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-400 capitalize">{formData.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {formData.points} pts
                  </div>
                  <div className="text-xs text-gray-500">Reward</div>
                </div>
                {formData.isActive ? (
                  <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                    <span className="text-xs font-medium text-green-400">Active</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-gray-500/20 border border-gray-500/50 rounded-full">
                    <span className="text-xs font-medium text-gray-400">Inactive</span>
                  </div>
                )}
              </div>

              {(formData.startDate || formData.endDate) && (
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="text-xs text-gray-400 space-y-1">
                    {formData.startDate && (
                      <div>Starts: {new Date(formData.startDate).toLocaleString()}</div>
                    )}
                    {formData.endDate && (
                      <div>Ends: {new Date(formData.endDate).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              )}

              {formData.maxCompletions && (
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="text-xs text-gray-400">
                    Max {formData.maxCompletions} completion{formData.maxCompletions > 1 ? 's' : ''} per user
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
