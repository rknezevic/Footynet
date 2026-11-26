'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  // Number shown as a bubble next to the link (e.g. unread messages)
  badge?: number;
}

interface NavBarProps {
  links: NavLink[];
  homeHref: string;
  onLogout: () => void;
}

export default function NavBar({ links, homeHref, onLogout }: NavBarProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={homeHref} className="shrink-0"><Logo /></Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(link => (
            <NavItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            title={t('logout')}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Mobile: one equal-width column per link (icon above a short label), so all fit on a phone */}
      <div className={`grid border-t border-ink-100 md:hidden ${MOBILE_COLUMNS[links.length] ?? 'grid-cols-5'}`}>
        {links.map(link => (
          <MobileNavItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </div>
    </nav>
  );
}

const MOBILE_COLUMNS: Record<number, string> = { 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5' };

function MobileNavItem({ link, active }: { link: NavLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      aria-current={active ? 'page' : undefined}
      className={`relative flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
        active ? 'text-pitch-700' : 'text-ink-500 hover:text-ink-900'
      }`}
    >
      {active && <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-pitch-600" aria-hidden="true" />}
      <span className="relative">
        <Icon className="h-5 w-5" />
        {!!link.badge && (
          <span className="absolute -right-2.5 -top-1.5 min-w-[1.1rem] rounded-full bg-pitch-600 px-1 py-0.5 text-center text-[10px] font-bold leading-none text-white">
            {link.badge > 99 ? '99+' : link.badge}
          </span>
        )}
      </span>
      <span className="max-w-full truncate px-1">{link.label}</span>
    </Link>
  );
}

function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      className={`relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-pitch-50 text-pitch-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
      }`}
    >
      <Icon className="h-4 w-4" />
      {link.label}
      {!!link.badge && (
        <span className="ml-0.5 min-w-[1.25rem] rounded-full bg-pitch-600 px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white">
          {link.badge > 99 ? '99+' : link.badge}
        </span>
      )}
    </Link>
  );
}
