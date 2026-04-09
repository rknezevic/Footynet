'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobAdDetailPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/club/applications');
  }, [router]);

  return <div className="p-8">Redirecting...</div>;
}
