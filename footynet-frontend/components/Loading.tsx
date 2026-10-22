'use client';

import { useTranslations } from 'next-intl';

// fullScreen for whole-page loading; inline inside cards and lists
export default function Loading({ fullScreen = false }: { fullScreen?: boolean }) {
  const t = useTranslations('common');
  return (
    <div className={`grid place-items-center ${fullScreen ? 'min-h-screen' : 'py-16'}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pitch-100 border-t-pitch-600" />
        <p className="text-sm text-ink-500">{t('loading')}</p>
      </div>
    </div>
  );
}
