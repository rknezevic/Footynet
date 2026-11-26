import { getLocale } from 'next-intl/server';
import LegalPage from '@/components/legal/LegalPage';
import { isLocale, defaultLocale } from '@/i18n/config';
import { PRIVACY } from '@/components/legal/content';

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: PRIVACY[isLocale(locale) ? locale : defaultLocale].title };
}

export default function PrivacyPage() {
  return <LegalPage documents={PRIVACY} other={{ href: '/terms', label: 'terms' }} />;
}
