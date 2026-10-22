'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { RoleType } from '@/types';

interface NavLink {
  href: string;
  // Key in the "nav" messages namespace
  labelKey: string;
}

export const NAV_CONFIG: Record<RoleType, NavLink[]> = {
  [RoleType.Player]: [
    { href: '/player/dashboard', labelKey: 'dashboard' },
    { href: '/player/jobs', labelKey: 'jobs' },
    { href: '/player/applications', labelKey: 'applications' },
    { href: '/messages', labelKey: 'messages' },
    { href: '/player/profile', labelKey: 'profile' },
  ],
  [RoleType.Club]: [
    { href: '/club/dashboard', labelKey: 'dashboard' },
    { href: '/club/applications', labelKey: 'applications' },
    { href: '/messages', labelKey: 'messages' },
    { href: '/club/profile', labelKey: 'profile' },
  ],
  [RoleType.Admin]: [
    { href: '/admin/dashboard', labelKey: 'dashboard' },
    { href: '/admin/clubs', labelKey: 'clubs' },
    { href: '/admin/users', labelKey: 'users' },
    { href: '/admin/job-ads', labelKey: 'jobAds' },
  ],
};

export default function UnifiedNavBar() {
  const { role, logout } = useAuth();
  const t = useTranslations('nav');

  if (role === null) return null;

  const links = (NAV_CONFIG[role] ?? []).map(l => ({ href: l.href, label: t(l.labelKey) }));

  return <NavBar links={links} onLogout={logout} />;
}
