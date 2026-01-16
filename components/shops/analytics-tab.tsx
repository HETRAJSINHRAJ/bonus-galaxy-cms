'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface AnalyticsTabProps {
  shopId: string;
}

export function AnalyticsTab({ shopId }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-white/60">View shop performance and insights</p>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-16 w-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Analytics Coming Soon</h3>
          <p className="text-white/60">Detailed analytics and charts will be available here</p>
        </CardContent>
      </Card>
    </div>
  );
}
