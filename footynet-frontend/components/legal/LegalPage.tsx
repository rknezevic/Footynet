'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import { isLocale, defaultLocale } from '@/i18n/config';
import { LAST_UPDATED, LegalDocument } from '@/components/legal/content';

// Shared layout for the Privacy Policy and Terms of Use; the document is picked by the current language
export default function LegalPage({ documents, other }: {
  documents: Record<'hr' | 'en', LegalDocument>;
  other: { href: string; label: 'privacy' | 'terms' };
}) {
  const t = useTranslations('legal');
  const current = useLocale();
  const locale = isLocale(current) ? current : defaultLocale;
  const doc = documents[locale];

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200/70 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" aria-label={t('home')}><Logo /></Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-pitch-700 hover:underline">
          <ArrowLeft className="h-4 w-4" />{t('home')}
        </Link>

        <article className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-card sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900">{doc.title}</h1>
          <p className="mt-2 text-sm text-ink-500">{t('lastUpdated', { date: LAST_UPDATED[locale] })}</p>
          <p className="mt-6 leading-relaxed text-ink-700">{doc.intro}</p>

          {doc.sections.map(section => (
            <section key={section.heading} className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-ink-900">{section.heading}</h2>
              {section.paragraphs?.map(p => (
                <p key={p} className="mb-3 leading-relaxed text-ink-700">{p}</p>
              ))}
              {section.items && (
                <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-ink-700 marker:text-pitch-500">
                  {section.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </article>

        <p className="mt-6 text-center text-sm text-ink-500">
          <Link href={other.href} className="font-semibold text-pitch-700 hover:underline">{t(other.label)}</Link>
        </p>
      </main>
    </div>
  );
}
