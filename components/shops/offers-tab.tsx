'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Tag } from 'lucide-react';

interface OffersTabProps {
  shopId: string;
  offers: any[];
  onUpdate: () => void;
}

export function OffersTab({ shopId, offers, onUpdate }: OffersTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Voucher Offers</h2>
          <p className="text-white/60">Create and manage your voucher offers</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {offers.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center">
            <Tag className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Offers Yet</h3>
            <p className="text-white/60 mb-6">Create your first voucher offer to start selling</p>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Create First Offer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="text-white">Offers list coming soon...</div>
      )}
    </div>
  );
}
