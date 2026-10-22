'use client';

import { useEffect, useState } from 'react';
import { clubService } from '@/lib/club';
import { JobApplication, StatusType, PlayerProfileDto } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTranslations, useFormatter } from 'next-intl';
import { useEnumLabels } from '@/i18n/useEnumLabels';

export default function ClubApplications() {
  const [jobAds, setJobAds] = useState<any[]>([]);
  const [selectedAdId, setSelectedAdId] = useState<string>('all');
  const [allApplications, setAllApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState<PlayerProfileDto | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const t = useTranslations('clubApplications');
  const tCommon = useTranslations('common');
  const labels = useEnumLabels();
  const format = useFormatter();

  useEffect(() => {
    clubService.getMyAds().then(setJobAds).catch(console.error);
  }, []);

  useEffect(() => {
    if (jobAds.length === 0) return;
    setPage(1);
  }, [selectedAdId, jobAds]);

  useEffect(() => {
    if (jobAds.length === 0) return;
    loadApplications();
  }, [jobAds, selectedAdId, page]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      if (selectedAdId === 'all') {
        const results = await Promise.all(jobAds.map(ad => clubService.getApplications(ad.id, undefined, 1, 100)));
        const flat = results.flatMap(r => r.items);
        const start = (page - 1) * pageSize;
        setAllApplications(flat.slice(start, start + pageSize));
        setTotalPages(Math.max(1, Math.ceil(flat.length / pageSize)));
      } else {
        const result = await clubService.getApplications(selectedAdId, undefined, page, pageSize);
        setAllApplications(result.items);
        setTotalPages(result.totalPages || 1);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAccept = async (appId: string) => {
    await clubService.acceptApplication(appId);
    setAllApplications(prev => prev.map(a => a.id === appId ? { ...a, status: StatusType.Accepted } : a));
  };

  const handleReject = async (appId: string) => {
    await clubService.rejectApplication(appId);
    setAllApplications(prev => prev.map(a => a.id === appId ? { ...a, status: StatusType.Rejected } : a));
  };

  const statusBadge = (status: number) => {
    const cfg: Record<number, string> = {
      0: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      1: 'bg-green-50 text-green-700 border-green-200',
      2: 'bg-red-50 text-red-700 border-red-200',
    };
    const bg = cfg[status] || 'bg-neutral-50 text-neutral-500 border-neutral-200';
    return <span className={`text-xs font-medium px-2 py-0.5 rounded border ${bg}`}>{labels.status(status)}</span>;
  };

  const getAdTitle = (jobAdId: string) => jobAds.find(a => a.id === jobAdId)?.title || '';
  const footLabel = (ft: number) => ft === 1 ? labels.foot('Left') : labels.foot('Right');

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title={t('title')} subtitle={t('subtitle')} />

        <div className="mb-8">
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('filterByAd')}</label>
          <select
            value={selectedAdId}
            onChange={(e) => setSelectedAdId(e.target.value)}
            className="w-full max-w-md px-3 py-2.5 border border-neutral-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          >
            <option value="all">{t('allAds')}</option>
            {jobAds.map(ad => (
              <option key={ad.id} value={ad.id}>
                {ad.title} ({labels.position(ad.requiredPosition)}){ad.adStatus === 'Closed' ? ` — ${t('inactive')}` : ''}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-neutral-400 text-sm">{tCommon('loading')}</div>
        ) : allApplications.length === 0 ? (
          <Card><p className="text-center text-sm text-neutral-400">{t('empty')}</p></Card>
        ) : (
          <div className="space-y-4">
            {allApplications.map(app => (
              <Card key={app.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-neutral-900">{app.player.firstName} {app.player.lastName}</h3>
                      <button onClick={() => setViewingPlayer(app.player)} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline transition-colors">{t('viewProfile')}</button>
                    </div>
                    {selectedAdId === 'all' && <p className="text-xs text-neutral-500 mb-1">{t('appliedFor', { title: getAdTitle(app.jobAdId) })}</p>}
                    <p className="text-xs text-neutral-400 mb-3">{t('appliedOn', { date: format.dateTime(new Date(app.appliedAt), { dateStyle: 'medium' }) })}</p>
                    {app.coverLetter && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-neutral-500 mb-1">{t('coverLetter')}</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{app.coverLetter}</p>
                      </div>
                    )}
                    <div>{statusBadge(app.status)}</div>
                  </div>
                  {app.status === StatusType.Pending && (
                    <div className="flex gap-2 ml-4">
                      <Button variant="primary" onClick={() => handleAccept(app.id)}>{t('accept')}</Button>
                      <Button variant="danger" onClick={() => handleReject(app.id)}>{t('reject')}</Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="secondary" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>{tCommon('previous')}</Button>
            <span className="text-sm text-neutral-500">{tCommon('pageOf', { page, totalPages })}</span>
            <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>{tCommon('next')}</Button>
          </div>
        )}
      </div>

      {viewingPlayer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative shadow-xl">
            <button onClick={() => setViewingPlayer(null)} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 text-lg" aria-label={tCommon('close')}>×</button>
            <h2 className="text-xl font-semibold text-neutral-900 mb-5">{viewingPlayer.firstName} {viewingPlayer.lastName}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">{t('age')}</p>
                  <p className="text-lg font-semibold text-neutral-900">{viewingPlayer.age}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">{t('city')}</p>
                  <p className="text-sm font-medium text-neutral-900">{viewingPlayer.city}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">{t('preferredFoot')}</p>
                <p className="text-sm text-neutral-900">{footLabel(viewingPlayer.prefeeredFootType as unknown as number)}</p>
              </div>
              {viewingPlayer.description && (
                <div className="pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400 mb-0.5">{t('about')}</p>
                  <p className="text-sm text-neutral-600 leading-relaxed">{viewingPlayer.description}</p>
                </div>
              )}
            </div>
            <div className="mt-5"><Button variant="secondary" onClick={() => setViewingPlayer(null)}>{tCommon('close')}</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}
