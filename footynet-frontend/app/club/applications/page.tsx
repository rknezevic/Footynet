'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useFormatter } from 'next-intl';
import { Check, FileText, MessageCircle, UserRound, X } from 'lucide-react';
import { clubService } from '@/lib/club';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { JobApplication, StatusType, PlayerProfileDto } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import Badge, { statusTone } from '@/components/Badge';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import PlayerProfileDetails from '@/components/PlayerProfileDetails';

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
    setPage(1);
  }, [selectedAdId]);

  useEffect(() => {
    if (jobAds.length === 0) return;
    const loadApplications = async () => {
      setLoading(true);
      try {
        if (selectedAdId === 'all') {
          const results = await Promise.all(jobAds.map(ad => clubService.getApplications(ad.id, undefined, 1, 100)));
          const flat = results.flatMap(r => r.items).sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
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
    loadApplications();
  }, [jobAds, selectedAdId, page]);

  const setStatus = (appId: string, status: StatusType) =>
    setAllApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));

  const handleAccept = async (appId: string) => {
    await clubService.acceptApplication(appId);
    setStatus(appId, StatusType.Accepted);
  };

  const handleReject = async (appId: string) => {
    await clubService.rejectApplication(appId);
    setStatus(appId, StatusType.Rejected);
  };

  const getAdTitle = (jobAdId: string) => jobAds.find(a => a.id === jobAdId)?.title || '';
  const fullName = (p: PlayerProfileDto) => `${p.firstName} ${p.lastName}`;
  const messageLink = (p: PlayerProfileDto) => `/messages?user=${p.id}&name=${encodeURIComponent(fullName(p))}`;

  return (
    <PageShell>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <div className="mb-6 max-w-md">
        <label className="field-label" htmlFor="ad-filter">{t('filterByAd')}</label>
        <select id="ad-filter" value={selectedAdId} onChange={(e) => setSelectedAdId(e.target.value)} className="field">
          <option value="all">{t('allAds')}</option>
          {jobAds.map(ad => (
            <option key={ad.id} value={ad.id}>
              {ad.title} ({labels.position(ad.requiredPosition)}){ad.adStatus === 'Closed' ? ` — ${t('inactive')}` : ''}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : allApplications.length === 0 ? (
        <Card><EmptyState icon={FileText} title={t('empty')} /></Card>
      ) : (
        <div className="space-y-4">
          {allApplications.map(app => (
            <Card key={app.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar name={fullName(app.player)} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-ink-900">{fullName(app.player)}</h3>
                    <Badge tone={statusTone(app.status)} dot>{labels.status(app.status)}</Badge>
                    <AvailabilityBadge status={app.player.availability} />
                  </div>
                  <p className="mb-3 text-sm text-ink-500">
                    {[
                      selectedAdId === 'all' && t('appliedFor', { title: getAdTitle(app.jobAdId) }),
                      t('appliedOn', { date: format.dateTime(new Date(app.appliedAt), { dateStyle: 'medium' }) }),
                    ].filter(Boolean).join(' · ')}
                  </p>
                  {app.coverLetter && (
                    <blockquote className="mb-3 rounded-xl border-l-4 border-pitch-200 bg-ink-50 px-4 py-3 text-sm leading-relaxed text-ink-700">
                      {app.coverLetter}
                    </blockquote>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setViewingPlayer(app.player)}><UserRound className="h-3.5 w-3.5" />{t('viewProfile')}</Button>
                    {app.status === StatusType.Accepted && (
                      <Link href={messageLink(app.player)}><Button variant="secondary" size="sm"><MessageCircle className="h-3.5 w-3.5" />{t('message')}</Button></Link>
                    )}
                  </div>
                </div>
                {app.status === StatusType.Pending && (
                  <div className="flex gap-2 sm:flex-col">
                    <Button size="sm" onClick={() => handleAccept(app.id)}><Check className="h-4 w-4" />{t('accept')}</Button>
                    <Button variant="danger" size="sm" onClick={() => handleReject(app.id)}><X className="h-4 w-4" />{t('reject')}</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {viewingPlayer && (
        <Modal
          size="lg"
          title={<span className="flex items-center gap-3"><Avatar name={fullName(viewingPlayer)} />{fullName(viewingPlayer)}</span>}
          onClose={() => setViewingPlayer(null)}
          footer={<Button variant="secondary" onClick={() => setViewingPlayer(null)}>{tCommon('close')}</Button>}
        >
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <AvailabilityBadge status={viewingPlayer.availability} />
            <Badge>{t('ageYears', { age: viewingPlayer.age })}</Badge>
          </div>
          <PlayerProfileDetails profile={viewingPlayer} />
        </Modal>
      )}
    </PageShell>
  );
}
