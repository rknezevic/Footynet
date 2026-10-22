'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';

// Split screen for login / register / onboarding: green brand panel + form
export default function AuthLayout({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const t = useTranslations('auth');
  const points = [t('point1'), t('point2'), t('point3')];

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-pitch-800 via-pitch-700 to-pitch-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pitch-pattern pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative"><Logo variant="light" size="lg" /></div>
        <div className="relative">
          <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-balance">{t('headline')}</h2>
          <p className="mb-8 max-w-md text-pitch-50/90">{t('subline')}</p>
          <ul className="space-y-3">
            {points.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm text-pitch-50">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-pitch-200" />{p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-pitch-100/70">© {new Date().getFullYear()} FootyNet</p>
      </aside>

      <main className="flex flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between lg:justify-end">
          <span className="lg:hidden"><Logo /></span>
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className={`w-full animate-fade-in-up ${wide ? 'max-w-2xl' : 'max-w-md'}`}>{children}</div>
        </div>
      </main>
    </div>
  );
}
