'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Users, 
  Tag, 
  BarChart3, 
  Settings,
  MapPin,
  Mail,
  Phone,
  Globe,
  Wallet,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { EmployeesTab } from '@/components/shops/employees-tab';
import { OffersTab } from '@/components/shops/offers-tab';
import { AnalyticsTab } from '@/components/shops/analytics-tab';

interface Shop {
  id: string;
  name: string;
  description?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
  nequadaBalance: number;
  totalVouchersSold: number;
  totalVouchersRedeemed: number;
  isActive: boolean;
  employees: any[];
  voucherOffers: any[];
}

export default function ShopDetailsPage() {
  const params = useParams();
  const shopId = params.id as string;
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchShop();
  }, [shopId]);

  const fetchShop = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      console.log('Fetching shop from:', `${apiUrl}/shops/${shopId}`);
      
      const response = await fetch(`${apiUrl}/shops/${shopId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Failed to fetch shop:', response.status, response.statusText);
        setShop(null);
        return;
      }
      
      const data = await response.json();
      console.log('Shop data:', data);
      setShop(data.shop);
    } catch (error) {
      console.error('Error fetching shop:', error);
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading shop...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 max-w-md">
          <CardContent className="py-12 text-center">
            <Store className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Shop Not Found</h2>
            <p className="text-white/60 mb-6">The shop you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/shops">Back to Shops</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const redemptionRate = shop.totalVouchersSold > 0 
    ? ((shop.totalVouchersRedeemed / shop.totalVouchersSold) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-white/60 hover:text-white mb-4">
            <Link href="/shops">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shops
            </Link>
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {shop.logo && (
                <img src={shop.logo} alt={shop.name} className="h-20 w-20 rounded-lg object-cover border-2 border-white/10" />
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{shop.name}</h1>
                  <Badge className={shop.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {shop.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {shop.description && (
                  <p className="text-white/60 mb-3">{shop.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                  {shop.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {shop.address}
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {shop.email}
                    </div>
                  )}
                  {shop.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {shop.phone}
                    </div>
                  )}
                  {shop.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a href={shop.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {shop.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
              <Settings className="h-4 w-4 mr-2" />
              Edit Shop
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Nequada Balance</p>
                  <p className="text-3xl font-bold text-cyan-400">{shop.nequadaBalance}</p>
                </div>
                <Wallet className="h-10 w-10 text-cyan-400/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Vouchers Sold</p>
                  <p className="text-3xl font-bold text-white">{shop.totalVouchersSold}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-white/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Redeemed</p>
                  <p className="text-3xl font-bold text-white">{shop.totalVouchersRedeemed}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-white/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Redemption Rate</p>
                  <p className="text-3xl font-bold text-green-400">{redemptionRate}%</p>
                </div>
                <BarChart3 className="h-10 w-10 text-white/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/10 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              <Store className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-white/20">
              <Users className="h-4 w-4 mr-2" />
              Employees ({shop.employees.length})
            </TabsTrigger>
            <TabsTrigger value="offers" className="data-[state=active]:bg-white/20">
              <Tag className="h-4 w-4 mr-2" />
              Offers ({shop.voucherOffers.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-white/60">Latest voucher redemptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/40 text-sm">No recent activity</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-white/60">Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="ghost" onClick={() => setActiveTab('employees')}>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Employees
                  </Button>
                  <Button className="w-full justify-start" variant="ghost" onClick={() => setActiveTab('offers')}>
                    <Tag className="h-4 w-4 mr-2" />
                    Create Offer
                  </Button>
                  <Button className="w-full justify-start" variant="ghost" onClick={() => setActiveTab('analytics')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="mt-6">
            <EmployeesTab shopId={shopId} employees={shop.employees} onUpdate={fetchShop} />
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <OffersTab shopId={shopId} offers={shop.voucherOffers} onUpdate={fetchShop} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab shopId={shopId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
