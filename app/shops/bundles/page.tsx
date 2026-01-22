'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export default function BundlesPage() {
  const [bundles, setBundles] = useState<VoucherBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<VoucherBundle | null>(null);

  // Form state
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
      const response = await fetch(`${apiUrl}/voucher-bundles`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bundles');
      }
      
      const data = await response.json();
      setBundles(data.bundles || []);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const url = editingBundle
        ? `${apiUrl}/voucher-bundles/${editingBundle.id}`
        : `${apiUrl}/voucher-bundles`;
      
      const method = editingBundle ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: formData.features.split('\n').filter(f => f.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save bundle');
      }

      await fetchBundles();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving bundle:', error);
      alert('Failed to save bundle');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/voucher-bundles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bundle');
      }

      await fetchBundles();
    } catch (error) {
      console.error('Error deleting bundle:', error);
      alert('Failed to delete bundle');
    }
  };

  const resetForm = () => {
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
  };

  const savings = (bundle: VoucherBundle) => {
    return ((bundle.value - bundle.price) / bundle.value * 100).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/shops" className="inline-flex items-center text-white/60 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shops
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Voucher Bundles</h1>
            <p className="text-white/60">Manage voucher bundles for the mobile shop</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  {editingBundle ? 'Update bundle details' : 'Add a new voucher bundle to the shop'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Bundle Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-white">Price (EUR)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="value" className="text-white">Total Value (EUR)</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pointsCost" className="text-white">Points Cost</Label>
                    <Input
                      id="pointsCost"
                      type="number"
                      value={formData.pointsCost}
                      onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="voucherCount" className="text-white">Voucher Count</Label>
                    <Input
                      id="voucherCount"
                      type="number"
                      value={formData.voucherCount}
                      onChange={(e) => setFormData({ ...formData, voucherCount: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentMethod" className="text-white">Payment Method</Label>
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

                <div>
                  <Label htmlFor="features" className="text-white">Features (one per line)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    rows={4}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPopular"
                      checked={formData.isPopular}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                    />
                    <Label htmlFor="isPopular" className="text-white">Mark as Popular</Label>
                  </div>

                  <div>
                    <Label htmlFor="displayOrder" className="text-white">Display Order</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDialogOpen(false)}
                    className="text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                    {editingBundle ? 'Update' : 'Create'} Bundle
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white/60 mt-4">Loading bundles...</p>
          </div>
        ) : bundles.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No Bundles Yet</h2>
              <p className="text-white/60 mb-6">Create your first voucher bundle</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <Card key={bundle.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white">{bundle.name}</CardTitle>
                        {bundle.isPopular && (
                          <Badge className="bg-cyan-500">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-white/60">
                        {bundle.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-white">€{bundle.price}</span>
                      <span className="text-white/60 line-through">€{bundle.value}</span>
                    </div>
                    <p className="text-cyan-400 text-sm">Save {savings(bundle)}%</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/60">
                      <span>Points Cost:</span>
                      <span className="text-white font-semibold">{bundle.pointsCost}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Vouchers:</span>
                      <span className="text-white font-semibold">{bundle.voucherCount}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Payment:</span>
                      <Badge variant="outline" className="text-white border-white/20">
                        {bundle.paymentMethod}
                      </Badge>
                    </div>
                  </div>

                  {/* Features */}
                  {bundle.features.length > 0 && (
                    <div className="space-y-1">
                      {bundle.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-white/60">
                          <span className="text-green-400">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(bundle)}
                      className="flex-1 text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(bundle.id)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
