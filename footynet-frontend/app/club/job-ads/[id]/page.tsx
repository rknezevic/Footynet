'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function JobAdDetailPage() {
  const router = useRouter();
  const tCommon = useTranslations('common');

  useEffect(() => {
    router.replace('/club/applications');
  }, [router]);

  return <div className="p-8">{tCommon('redirecting')}</div>;
}
