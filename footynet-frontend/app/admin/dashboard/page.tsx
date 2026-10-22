'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Building2, Clock, Megaphone, UserRound, CheckCircle2 } from 'lucide-react';
import { adminService } from '@/lib/admin';
import { AdminDashboardDto, PendingClubDto, PaginatedResult } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import PendingClubsTable from '@/components/admin/PendingClubsTable';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardDto | null>(null);
  const [pendingClubs, setPendingClubs] = useState<PaginatedResult<PendingClubDto> | null>(null);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('adminDashboard');

  const loadData = async () => {
    try {
      const [dashboardData, clubsData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getPendingClubs(1, 10),
      ]);
      setStats(dashboardData);
      setPendingClubs(clubsData);
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403) router.push('/login');
      else setError(t('loadFailed'));
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAction = async (id: string, action: (id: string) => Promise<unknown>, failedKey: string) => {
    setActioningId(id);
    try {
      await action(id);
      await loadData();
    } catch {
      setError(t(failedKey));
    } finally {
      setActioningId(null);
    }
  };

  if (error && !stats) return <PageShell><ErrorMessage message={error} /></PageShell>;
  if (!stats) return <PageShell><Loading /></PageShell>;

  const statCards = [
    { label: t('players'), value: stats.playerCount, icon: UserRound, tone: 'bg-pitch-50 text-pitch-600' },
    { label: t('clubs'), value: stats.clubCount, icon: Building2, tone: 'bg-sky-50 text-sky-600' },
    { label: t('jobAds'), value: stats.jobAdCount, icon: Megaphone, tone: 'bg-violet-50 text-violet-600' },
    { label: t('pendingClubs'), value: stats.pendingClubCount, icon: Clock, tone: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <PageShell>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(stat => (
          <Card key={stat.label} hover className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.tone}`}><stat.icon className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-ink-500">{stat.label}</p>
              <p className="font-display text-3xl font-bold text-ink-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card title={t('pendingRegistrations')}>
        {!pendingClubs || pendingClubs.items.length === 0 ? (
          <EmptyState icon={CheckCircle2} title={t('noPending')} />
        ) : (
          <PendingClubsTable
            clubs={pendingClubs.items}
            actioningId={actioningId}
            onApprove={id => runAction(id, adminService.approveClub, 'approveFailed')}
            onReject={id => runAction(id, adminService.rejectClub, 'rejectFailed')}
          />
        )}
      </Card>
    </PageShell>
  );
}
