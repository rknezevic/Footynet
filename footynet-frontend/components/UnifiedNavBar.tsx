'use client';

import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { RoleType } from '@/types';

interface NavLink {
  href: string;
  label: string;
}

export const NAV_CONFIG: Record<RoleType, NavLink[]> = {
  [RoleType.Player]: [
    { href: '/player/dashboard', label: 'Dashboard' },
    { href: '/player/jobs', label: 'Jobs' },
    { href: '/player/applications', label: 'Applications' },
    { href: '/messages', label: 'Messages' },
    { href: '/player/profile', label: 'Profile' },
  ],
  [RoleType.Club]: [
    { href: '/club/dashboard', label: 'Dashboard' },
    { href: '/club/applications', label: 'Applications' },
    { href: '/messages', label: 'Messages' },
    { href: '/club/profile', label: 'Profile' },
  ],
  [RoleType.Admin]: [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/clubs', label: 'Clubs' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/job-ads', label: 'Job Ads' },
  ],
};

export default function UnifiedNavBar() {
  const { role, logout } = useAuth();

  if (role === null) return null;

  const links = NAV_CONFIG[role] ?? [];

  return <NavBar links={links} onLogout={logout} />;
}
