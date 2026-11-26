import { pageTitle } from '@/i18n/pageMetadata';

export const generateMetadata = pageTitle('adminJobAds');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
