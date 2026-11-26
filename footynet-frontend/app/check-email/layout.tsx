import { pageTitle } from '@/i18n/pageMetadata';

export const generateMetadata = pageTitle('checkEmail');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
