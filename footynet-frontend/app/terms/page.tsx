import LegalPage from '@/components/legal/LegalPage';
import { TERMS } from '@/components/legal/content';

export default function TermsPage() {
  return <LegalPage documents={TERMS} other={{ href: '/privacy', label: 'privacy' }} />;
}
