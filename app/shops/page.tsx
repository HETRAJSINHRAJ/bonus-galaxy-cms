'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Store, Users, Tag, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Shop {
  id: string;
  name: string;
  description?: string;
  address?: string;
  logo?: string;
  nequadaBalance: number;
  totalVouchersSold: number;
  totalVouchersRedeemed: number;
  isActive: boolean;
  _count: {
    employees: number;
    voucherOffers: number;
  };
}

export default function ShopsPage() {
  const { user } = useUser();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      console.log('Fetching shops from:', `${apiUrl}/shops`);
      
      const response = await fetch(`${apiUrl}/shops`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Failed to fetch shops:', response.status, response.statusText);
        setError(`Failed to fetch shops: ${response.status} ${response.statusText}`);
        setShops([]);
        return;
      }
      
      const data = await response.json();
      console.log('Shops data:', data);
      setShops(data.shops || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to API');
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const redemptionRate = (shop: Shop) => {
    if (shop.totalVouchersSold === 0) return 0;
    return ((shop.totalVouchersRedeemed / shop.totalVouchersSold) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Shop Management</h1>
            <p className="text-white/60">Manage your shops, employees, and voucher offers</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Shop
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white/60 mt-4">Loading shops...</p>
          </div>
        ) : error ? (
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="py-12 text-center">
              <div className="text-red-400 mb-4">⚠️ Connection Error</div>
              <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Shops</h2>
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
                  <li>NEXT_PUBLIC_API_URL is set correctly in .env</li>
                  <li>The /api/shops endpoint exists</li>
                </ul>
              </div>
              <Button onClick={fetchShops} className="mt-6 bg-cyan-500 hover:bg-cyan-600">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : shops.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <Store className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No Shops Yet</h2>
              <p className="text-white/60 mb-6">Create your first shop to start managing vouchers</p>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Shop
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map(shop => (
              <Link key={shop.id} href={`/shops/${shop.id}`}>
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-white">{shop.name}</CardTitle>
                        {shop.address && (
                          <CardDescription className="text-white/60 mt-1">
                            {shop.address}
                          </CardDescription>
                        )}
                      </div>
                      {shop.logo && (
                        <img src={shop.logo} alt={shop.name} className="h-12 w-12 rounded-lg object-cover" />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Balance */}
                    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
                      <p className="text-white/60 text-sm">Nequada Balance</p>
                      <p className="text-2xl font-bold text-cyan-400">{shop.nequadaBalance}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                          <Users className="h-3 w-3" />
                          Employees
                        </div>
                        <p className="text-white font-semibold">{shop._count.employees}</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                          <Tag className="h-3 w-3" />
                          Offers
                        </div>
                        <p className="text-white font-semibold">{shop._count.voucherOffers}</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                          <TrendingUp className="h-3 w-3" />
                          Sold
                        </div>
                        <p className="text-white font-semibold">{shop.totalVouchersSold}</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                          <TrendingUp className="h-3 w-3" />
                          Redeemed
                        </div>
                        <p className="text-white font-semibold">{shop.totalVouchersRedeemed}</p>
                      </div>
                    </div>

                    {/* Redemption Rate */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Redemption Rate</span>
                      <span className="text-green-400 font-semibold">{redemptionRate(shop)}%</span>
                    </div>

                    {/* View Details Button */}
                    <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
