'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, User, Shield, TrendingUp, Key } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  canCreateVoucher: boolean;
  canRedeemVoucher: boolean;
  canViewAnalytics: boolean;
  isManager: boolean;
  totalRedemptions: number;
  totalOffersCreated: number;
  isActive: boolean;
}

interface EmployeesTabProps {
  shopId: string;
  employees: Employee[];
  onUpdate: () => void;
}

export function EmployeesTab({ shopId, employees, onUpdate }: EmployeesTabProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    phone: '',
    redemptionPin: '',
    confirmPin: '',
    canCreateVoucher: false,
    canRedeemVoucher: true,
    canViewAnalytics: false,
    isManager: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.redemptionPin !== formData.confirmPin) {
      alert('PINs do not match');
      return;
    }

    if (formData.redemptionPin.length < 4 || formData.redemptionPin.length > 6) {
      alert('PIN must be 4-6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${shopId}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId || `emp_${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          redemptionPin: formData.redemptionPin,
          canCreateVoucher: formData.canCreateVoucher,
          canRedeemVoucher: formData.canRedeemVoucher,
          canViewAnalytics: formData.canViewAnalytics,
          isManager: formData.isManager,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Employee added successfully!');
        setShowAddDialog(false);
        setFormData({
          userId: '',
          name: '',
          email: '',
          phone: '',
          redemptionPin: '',
          confirmPin: '',
          canCreateVoucher: false,
          canRedeemVoucher: true,
          canViewAnalytics: false,
          isManager: false,
        });
        onUpdate();
      } else {
        alert(data.error || 'Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Employees</h2>
          <p className="text-white/60">Manage shop employees and their permissions</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Employee</DialogTitle>
              <DialogDescription className="text-white/60">
                Create a new employee account with redemption PIN
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-white">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="userId" className="text-white">User ID (optional)</Label>
                  <Input
                    id="userId"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pin" className="text-white">Redemption PIN (4-6 digits) *</Label>
                  <Input
                    id="pin"
                    type="password"
                    value={formData.redemptionPin}
                    onChange={(e) => setFormData({ ...formData, redemptionPin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    required
                    maxLength={6}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPin" className="text-white">Confirm PIN *</Label>
                  <Input
                    id="confirmPin"
                    type="password"
                    value={formData.confirmPin}
                    onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    required
                    maxLength={6}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-semibold text-sm">Permissions</p>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canRedeem" className="text-white/80">Can Redeem Vouchers</Label>
                  <Switch
                    id="canRedeem"
                    checked={formData.canRedeemVoucher}
                    onCheckedChange={(checked) => setFormData({ ...formData, canRedeemVoucher: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="canCreate" className="text-white/80">Can Create Offers</Label>
                  <Switch
                    id="canCreate"
                    checked={formData.canCreateVoucher}
                    onCheckedChange={(checked) => setFormData({ ...formData, canCreateVoucher: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="canView" className="text-white/80">Can View Analytics</Label>
                  <Switch
                    id="canView"
                    checked={formData.canViewAnalytics}
                    onCheckedChange={(checked) => setFormData({ ...formData, canViewAnalytics: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isManager" className="text-white/80">Is Manager</Label>
                  <Switch
                    id="isManager"
                    checked={formData.isManager}
                    onCheckedChange={(checked) => setFormData({ ...formData, isManager: checked })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500">
                  {loading ? 'Adding...' : 'Add Employee'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="bg-white/10 border-white/20 text-white">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees List */}
      {employees.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center">
            <User className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Employees Yet</h3>
            <p className="text-white/60 mb-6">Add your first employee to start managing vouchers</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Add First Employee
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map(employee => (
            <Card key={employee.id} className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white flex items-center gap-2">
                      {employee.name}
                      {employee.isManager && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Manager
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/60">{employee.email}</CardDescription>
                  </div>
                  <Badge className={employee.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                      <TrendingUp className="h-3 w-3" />
                      Redemptions
                    </div>
                    <p className="text-white font-semibold">{employee.totalRedemptions}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                      <Key className="h-3 w-3" />
                      Offers Created
                    </div>
                    <p className="text-white font-semibold">{employee.totalOffersCreated}</p>
                  </div>
                </div>

                {/* Permissions */}
                <div className="flex flex-wrap gap-2">
                  {employee.canRedeemVoucher && (
                    <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
                      Can Redeem
                    </Badge>
                  )}
                  {employee.canCreateVoucher && (
                    <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
                      Can Create
                    </Badge>
                  )}
                  {employee.canViewAnalytics && (
                    <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
                      Can View Analytics
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    Reset PIN
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
