import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, TrendingUp, Users, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function RedemptionsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  // Fetch all redeemed vouchers
  const redemptions = await prisma.voucherPurchase.findMany({
    where: {
      isRedeemed: true
    },
    orderBy: {
      redeemedAt: 'desc'
    },
    select: {
      id: true,
      userId: true,
      voucherId: true,
      amount: true,
      redeemedAt: true,
      redeemedBy: true,
      redeemedLocation: true,
      createdAt: true,
      pinCode: true
    }
  });

  // Calculate analytics
  const totalRedemptions = redemptions.length;
  const totalValue = redemptions.reduce((sum, r) => sum + r.amount, 0);
  
  const byLocation: Record<string, number> = {};
  const byEmployee: Record<string, number> = {};
  
  redemptions.forEach(r => {
    if (r.redeemedLocation) {
      byLocation[r.redeemedLocation] = (byLocation[r.redeemedLocation] || 0) + 1;
    }
    if (r.redeemedBy) {
      byEmployee[r.redeemedBy] = (byEmployee[r.redeemedBy] || 0) + 1;
    }
  });

  const topLocations = Object.entries(byLocation)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
    
  const topEmployees = Object.entries(byEmployee)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Voucher Redemptions</h1>
          <p className="text-sm md:text-base text-white/60">Overview of all redeemed vouchers</p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          CSV Export
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-white/5 border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs md:text-sm mb-1">Total Redemptions</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{totalRedemptions}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-white/5 border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs md:text-sm mb-1">Total Value</p>
              <p className="text-2xl md:text-3xl font-bold text-white">€{totalValue.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-white/5 border-white/10 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs md:text-sm mb-1">Locations</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{Object.keys(byLocation).length}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-white/5 border-white/10">
          <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />
            Top Locations
          </h3>
          <div className="space-y-3">
            {topLocations.length > 0 ? (
              topLocations.map(([location, count]) => (
                <div key={location} className="flex items-center justify-between gap-2">
                  <span className="text-sm md:text-base text-white/80 truncate">{location}</span>
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs whitespace-nowrap">
                    {count} redemption{count !== 1 ? 's' : ''}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-white/40 text-xs md:text-sm py-4 text-center">
                No redemptions yet
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-white/5 border-white/10">
          <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-emerald-400" />
            Top Employees
          </h3>
          <div className="space-y-3">
            {topEmployees.length > 0 ? (
              topEmployees.map(([employee, count]) => (
                <div key={employee} className="flex items-center justify-between gap-2">
                  <span className="text-sm md:text-base text-white/80 truncate">{employee}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs whitespace-nowrap">
                    {count} redemption{count !== 1 ? 's' : ''}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-white/40 text-xs md:text-sm py-4 text-center">
                No redemptions yet
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Redemptions Table */}
      <Card className="p-4 md:p-6 bg-white/5 border-white/10">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4">All Redemptions</h3>
        {redemptions.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/60 text-sm font-medium pb-3">PIN</th>
                    <th className="text-left text-white/60 text-sm font-medium pb-3">Bundle</th>
                    <th className="text-left text-white/60 text-sm font-medium pb-3">Value</th>
                    <th className="text-left text-white/60 text-sm font-medium pb-3">Redeemed At</th>
                    <th className="text-left text-white/60 text-sm font-medium pb-3">Employee</th>
                    <th className="text-left text-white/60 text-sm font-medium pb-3">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((redemption) => (
                    <tr key={redemption.id} className="border-b border-white/5">
                      <td className="py-3 text-white/80 font-mono text-sm">{redemption.pinCode}</td>
                      <td className="py-3 text-white/80 text-sm">{redemption.voucherId}</td>
                      <td className="py-3 text-white/80 text-sm">€{redemption.amount.toFixed(2)}</td>
                      <td className="py-3 text-white/80 text-sm">
                        {redemption.redeemedAt && format(new Date(redemption.redeemedAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="py-3 text-white/80 text-sm">{redemption.redeemedBy}</td>
                      <td className="py-3 text-white/80 text-sm">{redemption.redeemedLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {redemptions.map((redemption) => (
                <Card key={redemption.id} className="p-4 bg-white/5 border-white/10">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">PIN</span>
                      <span className="text-sm text-white/80 font-mono">{redemption.pinCode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Value</span>
                      <span className="text-sm font-semibold text-emerald-400">€{redemption.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Bundle</span>
                      <span className="text-sm text-white/80 truncate max-w-[60%] text-right">{redemption.voucherId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Redeemed At</span>
                      <span className="text-sm text-white/80">
                        {redemption.redeemedAt && format(new Date(redemption.redeemedAt), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                    {redemption.redeemedBy && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">Employee</span>
                        <span className="text-sm text-white/80 truncate max-w-[60%] text-right">{redemption.redeemedBy}</span>
                      </div>
                    )}
                    {redemption.redeemedLocation && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">Location</span>
                        <span className="text-sm text-white/80 truncate max-w-[60%] text-right">{redemption.redeemedLocation}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">No Redemptions Yet</h4>
            <p className="text-white/60 text-sm mb-4">
              Vouchers haven't been redeemed yet. Once partners start redeeming vouchers, they will appear here.
            </p>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-white/70">
                <strong>To test:</strong> Go to the partner portal at <code className="text-indigo-400">/partner/redeem</code> and redeem a voucher using a PIN code.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
