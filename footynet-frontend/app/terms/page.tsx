import { getLocale } from 'next-intl/server';
import LegalPage from '@/components/legal/LegalPage';
import { isLocale, defaultLocale } from '@/i18n/config';
import { TERMS } from '@/components/legal/content';

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: TERMS[isLocale(locale) ? locale : defaultLocale].title };
}

export default function TermsPage() {
  return <LegalPage documents={TERMS} other={{ href: '/privacy', label: 'privacy' }} />;
}
