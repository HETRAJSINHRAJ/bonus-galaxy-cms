'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ActiveLinkProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  className?: string;
  activeClassName?: string;
}

export function ActiveLink({ href, children, icon, className, activeClassName }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
        isActive 
          ? activeClassName || 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
          : className || 'text-gray-300 hover:bg-gray-800/50'
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
}
