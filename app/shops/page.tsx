'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Package } from 'lucide-react';
import { BundlesTab } from '@/components/shops/bundles-tab';

export default function ShopsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shop Management</h1>
          <p className="text-white/60">Manage your shops, employees, voucher offers, and bundles</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bundles" className="space-y-6">
          <TabsList className="bg-white/10 border border-white/10">
            <TabsTrigger value="bundles" className="data-[state=active]:bg-white/20">
              <Package className="h-4 w-4 mr-2" />
              Voucher Bundles
            </TabsTrigger>
            <TabsTrigger value="shops" className="data-[state=active]:bg-white/20">
              <Store className="h-4 w-4 mr-2" />
              Shops (Coming Soon)
            </TabsTrigger>
          </TabsList>

          {/* Bundles Tab */}
          <TabsContent value="bundles">
            <BundlesTab shopId="" />
          </TabsContent>

          {/* Shops Tab - Future Implementation */}
          <TabsContent value="shops" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-16 text-center">
                <Store className="h-20 w-20 text-white/40 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-2">Shop Management</h2>
                <p className="text-white/60 mb-4">Coming Soon</p>
                <p className="text-sm text-white/50 max-w-md mx-auto">
                  Shop management features including shop creation, employee management, and voucher offers will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
