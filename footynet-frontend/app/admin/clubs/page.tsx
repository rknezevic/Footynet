'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { adminService } from '@/lib/admin';
import { PendingClubDto, PaginatedResult } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import PendingClubsTable from '@/components/admin/PendingClubsTable';

const PAGE_SIZE = 10;

export default function AdminClubs() {
  const [data, setData] = useState<PaginatedResult<PendingClubDto> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('adminClubs');

  const loadClubs = useCallback(async (p: number) => {
    try {
      setError('');
      setData(await adminService.getPendingClubs(p, PAGE_SIZE));
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403) router.push('/login');
      else setError(t('loadFailed'));
    }
  }, [router, t]);

  useEffect(() => {
    loadClubs(page);
  }, [page, loadClubs]);

  const runAction = async (id: string, action: (id: string) => Promise<unknown>, failedKey: string) => {
    setActioningId(id);
    try {
      await action(id);
      await loadClubs(page);
    } catch {
      setError(t(failedKey));
    } finally {
      setActioningId(null);
    }
  };

  if (error && !data) return <PageShell><ErrorMessage message={error} /></PageShell>;
  if (!data) return <PageShell><Loading /></PageShell>;

  return (
    <PageShell>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <Card>
        {data.items.length === 0 ? (
          <EmptyState icon={CheckCircle2} title={t('noPending')} />
        ) : (
          <PendingClubsTable
            clubs={data.items}
            actioningId={actioningId}
            onApprove={id => runAction(id, adminService.approveClub, 'approveFailed')}
            onReject={id => runAction(id, adminService.rejectClub, 'rejectFailed')}
          />
        )}
      </Card>

      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
    </PageShell>
  );
}
