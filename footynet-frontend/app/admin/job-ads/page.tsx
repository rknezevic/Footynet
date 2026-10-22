'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useFormatter } from 'next-intl';
import { Eye, Megaphone, Search, Trash2 } from 'lucide-react';
import { adminService } from '@/lib/admin';
import { jobAdService } from '@/lib/jobAds';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { AdminJobAdDto, PaginatedResult } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

export default function AdminJobAds() {
  const [data, setData] = useState<PaginatedResult<AdminJobAdDto> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const router = useRouter();
  const t = useTranslations('adminJobAds');
  const tCommon = useTranslations('common');
  const labels = useEnumLabels();
  const format = useFormatter();

  const loadJobAds = useCallback(async (p: number, s: string) => {
    try {
      setError('');
      setData(await adminService.getJobAds(s || undefined, p, PAGE_SIZE));
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403) router.push('/login');
      else setError(t('loadFailed'));
    }
  }, [router, t]);

  useEffect(() => {
    loadJobAds(page, search);
  }, [page, search, loadJobAds]);

  const handleDelete = async (id: string) => {
    setActioningId(id);
    try {
      await adminService.deleteJobAd(id);
      await loadJobAds(page, search);
    } catch {
      setError(t('deleteFailed'));
    } finally {
      setActioningId(null);
    }
  };

  const handleViewDetails = async (id: string) => {
    setLoadingDetail(true);
    try {
      setSelectedJob(await jobAdService.getById(id));
    } catch {
      setError(t('detailFailed'));
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = (value: string) => format.dateTime(new Date(value), { dateStyle: 'medium' });
  const statusName = (s: string | number) => (s === 0 ? 'Open' : s === 1 ? 'Closed' : String(s));

  if (error && !data) return <PageShell><ErrorMessage message={error} /></PageShell>;
  if (!data) return <PageShell><Loading /></PageShell>;

  return (
    <PageShell>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <Card>
        <div className="relative mb-5 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="field pl-9"
          />
        </div>

        {data.items.length === 0 ? (
          <EmptyState icon={Megaphone} title={t('empty')} />
        ) : (
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wider text-ink-500">
                  <th className="px-6 pb-3 font-semibold">{t('adTitle')}</th>
                  <th className="px-6 pb-3 font-semibold">{t('club')}</th>
                  <th className="px-6 pb-3 font-semibold">{t('createdAt')}</th>
                  <th className="px-6 pb-3 font-semibold">{t('status')}</th>
                  <th className="px-6 pb-3 text-right font-semibold">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.items.map(ad => (
                  <tr key={ad.id} className="transition-colors hover:bg-ink-50/60">
                    <td className="px-6 py-3 font-semibold text-ink-900">{ad.title}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2"><Avatar name={ad.clubName} size="sm" /><span className="text-ink-600">{ad.clubName}</span></div>
                    </td>
                    <td className="px-6 py-3 text-ink-600">{formatDate(ad.createdAt)}</td>
                    <td className="px-6 py-3"><Badge tone={ad.adStatus === 'Open' ? 'green' : 'gray'} dot>{labels.adStatus(ad.adStatus)}</Badge></td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleViewDetails(ad.id)} disabled={loadingDetail}><Eye className="h-3.5 w-3.5" />{t('view')}</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(ad.id)} disabled={actioningId === ad.id}><Trash2 className="h-3.5 w-3.5" />{t('delete')}</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />

      {selectedJob && (
        <Modal
          title={selectedJob.title}
          onClose={() => setSelectedJob(null)}
          footer={<Button variant="secondary" onClick={() => setSelectedJob(null)}>{tCommon('close')}</Button>}
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tone="green">{labels.position(selectedJob.requiredPositionName)}</Badge>
            <Badge>{selectedJob.leagueName}</Badge>
            <Badge tone={statusName(selectedJob.adStatus) === 'Open' ? 'green' : 'gray'} dot>{labels.adStatus(statusName(selectedJob.adStatus))}</Badge>
          </div>
          <p className="mb-2 text-sm font-medium text-ink-700">{selectedJob.clubName}</p>
          <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-ink-600">{selectedJob.description}</p>
          <p className="text-xs text-ink-400">{t('posted', { date: formatDate(selectedJob.createdAt) })}</p>
        </Modal>
      )}
    </PageShell>
  );
}
