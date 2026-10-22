'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { locales, LOCALE_COOKIE } from '@/i18n/config';

export default function LanguageSwitcher({ tone = 'default' }: { tone?: 'default' | 'light' }) {
  const locale = useLocale();
  const router = useRouter();

  const changeLocale = (next: string) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // Re-render server components (layout) with the new locale's messages
    router.refresh();
  };

  const track = tone === 'light' ? 'bg-white/15' : 'bg-ink-100';
  const activeCls = tone === 'light' ? 'bg-white text-pitch-700' : 'bg-white text-ink-900 shadow-sm';
  const idleCls = tone === 'light' ? 'text-white/80 hover:text-white' : 'text-ink-500 hover:text-ink-900';

  return (
    <div className={`flex items-center rounded-lg p-0.5 text-xs font-semibold ${track}`}>
      {locales.map(l => (
        <button
          key={l}
          onClick={() => changeLocale(l)}
          className={`rounded-md px-2 py-1 transition-colors ${l === locale ? activeCls : idleCls}`}
          aria-pressed={l === locale}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
