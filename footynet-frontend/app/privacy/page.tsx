import LegalPage from '@/components/legal/LegalPage';
import { PRIVACY } from '@/components/legal/content';

export default function PrivacyPage() {
  return <LegalPage documents={PRIVACY} other={{ href: '/terms', label: 'terms' }} />;
}
