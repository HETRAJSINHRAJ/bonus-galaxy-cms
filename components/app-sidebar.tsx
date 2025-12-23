'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Clipboard,
  BarChart3,
  Plus,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Role } from '@/lib/roles';

interface AppSidebarProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    emailAddresses: { emailAddress: string }[];
  };
  userRole: Role;
  onSignOut: () => void;
  onNavigate?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: Role[];
  variant?: 'default' | 'primary';
}

export function AppSidebar({ user, userRole, onSignOut, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Missions',
      href: '/dashboard/missions',
      icon: Clipboard,
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      badge: 'New',
    },
    {
      title: 'Create Mission',
      href: '/dashboard/missions/create',
      icon: Plus,
      variant: 'primary',
      roles: [Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN],
    },
    {
      title: 'Users',
      href: '/dashboard/users',
      icon: Users,
      roles: [Role.ADMIN, Role.SUPER_ADMIN],
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      roles: [Role.ADMIN, Role.SUPER_ADMIN],
    },
  ];

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <div className="flex h-full flex-col bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-700/50 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img 
            src="/images/bonus-galaxy-logo.png" 
            alt="Bonus Galaxy" 
            className="w-10 h-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Bonus Galaxy</span>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search for..."
            className="pl-9 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500/50"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        <div className="mb-2">
          <p className="px-3 text-xs font-semibold uppercase text-gray-500">
            Overview
          </p>
        </div>

        {filteredItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 px-3 py-2 h-auto',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
          );
        })}

        {filteredItems.some((item) => item.variant === 'primary') && (
          <>
            <div className="mb-2 mt-6">
              <p className="px-3 text-xs font-semibold uppercase text-gray-500">
                Actions
              </p>
            </div>
            {filteredItems
              .filter((item) => item.variant === 'primary')
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href} onClick={onNavigate}>
                    <Button
                      className={cn(
                        'w-full justify-start gap-3 px-3 py-2 h-auto',
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.title}</span>
                    </Button>
                  </Link>
                );
              })}
          </>
        )}

        {filteredItems.some(
          (item) =>
            item.roles &&
            [Role.ADMIN, Role.SUPER_ADMIN].some((r) => item.roles?.includes(r))
        ) && (
          <>
            <div className="mb-2 mt-6">
              <p className="px-3 text-xs font-semibold uppercase text-gray-500">
                Admin
              </p>
            </div>
            {filteredItems
              .filter(
                (item) =>
                  item.roles &&
                  [Role.ADMIN, Role.SUPER_ADMIN].some((r) =>
                    item.roles?.includes(r)
                  ) &&
                  item.variant !== 'primary'
              )
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href} onClick={onNavigate}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3 px-3 py-2 h-auto',
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.title}</span>
                    </Button>
                  </Link>
                );
              })}
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-700/50 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-2 py-2 h-auto hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.firstName || 'User'}
                    className="h-10 w-10 rounded-full border-2 border-cyan-500/50 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-semibold text-white">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-gray-800 border-gray-700"
          >
            <DropdownMenuItem
              onClick={onSignOut}
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
