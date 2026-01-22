'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Package, Edit, Trash2, Star, Euro, Coins, Loader2 } from 'lucide-react';

interface VoucherBundle {
  id: string;
  name: string;
  description: string;
  price: number;
  value: number;
  pointsCost: number;
  voucherCount: number;
  paymentMethod: string;
  features: string[];
  isPopular: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BundlesTabProps {
  shopId?: string; // Made optional since bundles are global, not shop-specific
}

export function BundlesTab({ shopId }: BundlesTabProps) {
  const [bundles, setBundles] = useState<VoucherBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<VoucherBundle | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    value: '',
    pointsCost: '',
    voucherCount: '10',
    paymentMethod: 'cash',
    features: '',
    isPopular: false,
    displayOrder: '0',
  });

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      console.log('Fetching bundles from:', `${apiUrl}/voucher-bundles`);
      
      const response = await fetch(`${apiUrl}/voucher-bundles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Bundles data:', data);
      setBundles(data.bundles || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching bundles:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bundles';
      
      // Check if it's a network error
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Cannot connect to API. Make sure bonus-galaxy-new is running on port 3000.');
      } else {
        setError(errorMessage);
      }
      setBundles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bundle: VoucherBundle) => {
    setEditingBundle(bundle);
    setFormData({
      name: bundle.name,
      description: bundle.description,
      price: bundle.price.toString(),
      value: bundle.value.toString(),
      pointsCost: bundle.pointsCost.toString(),
      voucherCount: bundle.voucherCount.toString(),
      paymentMethod: bundle.paymentMethod,
      features: bundle.features.join('\n'),
      isPopular: bundle.isPopular,
      displayOrder: bundle.displayOrder.toString(),
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingBundle(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      value: '',
      pointsCost: '',
      voucherCount: '10',
      paymentMethod: 'cash',
      features: '',
      isPopular: false,
      displayOrder: '0',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const featuresArray = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const url = editingBundle
        ? `${apiUrl}/voucher-bundles/${editingBundle.id}`
        : `${apiUrl}/voucher-bundles`;
      
      const method = editingBundle ? 'PUT' : 'POST';

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        value: parseFloat(formData.value),
        pointsCost: parseInt(formData.pointsCost),
        voucherCount: parseInt(formData.voucherCount),
        paymentMethod: formData.paymentMethod,
        features: featuresArray,
        isPopular: formData.isPopular,
        displayOrder: parseInt(formData.displayOrder),
      };

      console.log('Sending payload:', payload);
      console.log('To URL:', url, 'Method:', method);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        url,
        method
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to save bundle';
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Error response data:', data);
            errorMessage = data.error || data.details || errorMessage;
          } else {
            const text = await response.text();
            console.log('Error response text:', text.substring(0, 500));
            errorMessage = text ? `Server error: ${response.status}` : `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage,
          url,
          method
        });
        
        throw new Error(errorMessage);
      }

      console.log('Bundle saved successfully');
      setDialogOpen(false);
      fetchBundles();
    } catch (error) {
      console.error('Error saving bundle:', error);
      alert(error instanceof Error ? error.message : 'Failed to save bundle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bundleId: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/voucher-bundles/${bundleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bundle');
      }

      fetchBundles();
    } catch (error) {
      console.error('Error deleting bundle:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete bundle');
    }
  };

  const handleToggleActive = async (bundleId: string, isActive: boolean) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/voucher-bundles/${bundleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update bundle');
      }

      fetchBundles();
    } catch (error) {
      console.error('Error updating bundle:', error);
      alert(error instanceof Error ? error.message : 'Failed to update bundle');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-white/40 mx-auto mb-4" />
        <p className="text-white/60">Loading bundles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Voucher Bundles</h2>
          <p className="text-white/60">Manage voucher bundle offerings</p>
        </div>
        <Button onClick={handleCreate} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Bundle
        </Button>
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="py-12 text-center">
            <div className="text-red-400 mb-4">⚠️ Connection Error</div>
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Bundles</h3>
            <p className="text-white/60 mb-4">{error}</p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-w-2xl mx-auto text-left">
              <p className="text-sm text-white/70 mb-2">
                <strong>API URL:</strong> <code className="text-cyan-400">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}</code>
              </p>
              <p className="text-sm text-white/70 mb-2">
                <strong>Make sure:</strong>
              </p>
              <ul className="text-sm text-white/60 list-disc list-inside space-y-1">
                <li>bonus-galaxy-new is running on port 3000</li>
                <li>Run: <code className="text-cyan-400">cd bonus-galaxy-new && npm run dev</code></li>
                <li>NEXT_PUBLIC_API_URL is set correctly in mission-cms/.env</li>
                <li>The /api/voucher-bundles endpoint exists</li>
              </ul>
            </div>
            <Button onClick={fetchBundles} className="mt-6 bg-cyan-500 hover:bg-cyan-600">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bundles Grid */}
      {bundles.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Bundles Yet</h3>
            <p className="text-white/60 mb-6">Create your first voucher bundle to start selling</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Bundle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-white">{bundle.name}</CardTitle>
                      {bundle.isPopular && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-white/60 line-clamp-2">
                      {bundle.description}
                    </CardDescription>
                  </div>
                  <Badge className={bundle.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {bundle.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-400 text-xs mb-1">
                      <Euro className="h-3 w-3" />
                      Price
                    </div>
                    <p className="text-xl font-bold text-white">€{bundle.price}</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs mb-1">
                      <Coins className="h-3 w-3" />
                      Points
                    </div>
                    <p className="text-xl font-bold text-white">{bundle.pointsCost}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/60">Value</p>
                    <p className="text-white font-semibold">€{bundle.value}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Vouchers</p>
                    <p className="text-white font-semibold">{bundle.voucherCount}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Payment</p>
                    <p className="text-white font-semibold capitalize">{bundle.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Order</p>
                    <p className="text-white font-semibold">{bundle.displayOrder}</p>
                  </div>
                </div>

                {/* Features */}
                {bundle.features.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs mb-2">Features</p>
                    <ul className="space-y-1 text-sm">
                      {bundle.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-white/80 flex items-start gap-2">
                          <span className="text-cyan-400">•</span>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {bundle.features.length > 3 && (
                        <li className="text-white/60 text-xs">+{bundle.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(bundle)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(bundle.id, bundle.isActive)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {bundle.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(bundle.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingBundle ? 'Update bundle details' : 'Create a new voucher bundle'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name" className="text-white">
                  Bundle Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Premium Bundle"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the bundle..."
                  rows={3}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">
                  Cash Price (€) <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="40.00"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value" className="text-white">
                  Bundle Value (€) <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="400.00"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointsCost" className="text-white">
                  Points Cost <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="pointsCost"
                  type="number"
                  value={formData.pointsCost}
                  onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
                  placeholder="4000"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voucherCount" className="text-white">
                  Voucher Count
                </Label>
                <Input
                  id="voucherCount"
                  type="number"
                  value={formData.voucherCount}
                  onChange={(e) => setFormData({ ...formData, voucherCount: e.target.value })}
                  placeholder="10"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-white">
                  Payment Method
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    <SelectItem value="cash">Cash Only</SelectItem>
                    <SelectItem value="points">Points Only</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder" className="text-white">
                  Display Order
                </Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  placeholder="0"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="features" className="text-white">
                  Features (one per line)
                </Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="10 Gutscheine von Top-Partnern&#10;Sofortige digitale Zustellung&#10;Bis zu 30% Rabatt"
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="col-span-2 flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <Label htmlFor="isPopular" className="text-white">
                    Mark as Popular
                  </Label>
                  <p className="text-sm text-white/60">Show a "Popular" badge on this bundle</p>
                </div>
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1 border-white/10 text-white hover:bg-white/5"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingBundle ? 'Update Bundle' : 'Create Bundle'}</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
