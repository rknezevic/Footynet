'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { locales, LOCALE_COOKIE } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const changeLocale = (next: string) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // Re-render server components (layout) with the new locale's messages
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-neutral-300">|</span>}
          <button
            onClick={() => changeLocale(l)}
            className={l === locale ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-900 transition-colors'}
            aria-pressed={l === locale}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
