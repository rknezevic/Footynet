import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { SearchX } from 'lucide-react';
import Logo from '@/components/Logo';

export async function generateMetadata() {
  const t = await getTranslations('notFound');
  return { title: t('title') };
}

// Shown for any address that doesn't exist, in the visitor's language
export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-4 text-center">
      <Link href="/" className="mb-10"><Logo size="lg" /></Link>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pitch-50 text-pitch-600">
        <SearchX className="h-7 w-7" />
      </div>
      <p className="mt-6 font-display text-5xl font-bold text-ink-900">404</p>
      <h1 className="mt-2 text-xl font-semibold text-ink-900">{t('title')}</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">{t('text')}</p>
      <Link href="/" className="mt-8 inline-flex items-center rounded-xl bg-pitch-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pitch-800">
        {t('home')}
      </Link>
    </main>
  );
}
