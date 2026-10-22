'use client';

import { useTranslations } from 'next-intl';
import { Briefcase, Building2, FileText, LayoutDashboard, Megaphone, MessageCircle, UserRound, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import NavBar from '@/components/NavBar';
import { RoleType } from '@/types';

interface NavConfigItem {
  href: string;
  // Key in the "nav" messages namespace
  labelKey: string;
  icon: LucideIcon;
}

export const NAV_CONFIG: Record<RoleType, NavConfigItem[]> = {
  [RoleType.Player]: [
    { href: '/player/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/player/jobs', labelKey: 'jobs', icon: Briefcase },
    { href: '/player/applications', labelKey: 'applications', icon: FileText },
    { href: '/messages', labelKey: 'messages', icon: MessageCircle },
    { href: '/player/profile', labelKey: 'profile', icon: UserRound },
  ],
  [RoleType.Club]: [
    { href: '/club/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/club/applications', labelKey: 'applications', icon: FileText },
    { href: '/messages', labelKey: 'messages', icon: MessageCircle },
    { href: '/club/profile', labelKey: 'profile', icon: Building2 },
  ],
  [RoleType.Admin]: [
    { href: '/admin/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/admin/clubs', labelKey: 'clubs', icon: Building2 },
    { href: '/admin/users', labelKey: 'users', icon: Users },
    { href: '/admin/job-ads', labelKey: 'jobAds', icon: Megaphone },
  ],
};

export default function UnifiedNavBar() {
  const { role, logout } = useAuth();
  const { unreadCount } = useChat();
  const t = useTranslations('nav');

  if (role === null) return null;

  const items = NAV_CONFIG[role] ?? [];
  const links = items.map(l => ({
    href: l.href,
    label: t(l.labelKey),
    icon: l.icon,
    badge: l.href === '/messages' ? unreadCount : undefined,
  }));

  return <NavBar links={links} homeHref={items[0]?.href ?? '/'} onLogout={logout} />;
}
