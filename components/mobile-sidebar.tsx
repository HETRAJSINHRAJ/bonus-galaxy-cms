'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AppSidebar } from './app-sidebar';
import { Role } from '@/lib/roles';

interface MobileSidebarProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    emailAddresses: { emailAddress: string }[];
  };
  userRole: Role;
  onSignOut: () => void;
}

export function MobileSidebar({ user, userRole, onSignOut }: MobileSidebarProps) {
  const [open, setOpen] = React.useState(false);

  const handleNavigate = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-gray-800/50"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 p-0 bg-gray-900/95 backdrop-blur-xl border-gray-700/50"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <AppSidebar user={user} userRole={userRole} onSignOut={onSignOut} onNavigate={handleNavigate} />
      </SheetContent>
    </Sheet>
  );
}
