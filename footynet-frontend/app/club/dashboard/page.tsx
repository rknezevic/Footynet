'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FileText, Lock, Megaphone, Pencil, Phone, Plus, RotateCcw, Trophy } from 'lucide-react';
import { clubService } from '@/lib/club';
import { lookupService, Position } from '@/lib/lookup';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { ClubProfileDto } from '@/types';
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

export default function ClubDashboard() {
  const [profile, setProfile] = useState<ClubProfileDto | null>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPositionId, setEditPositionId] = useState('');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const t = useTranslations('clubDashboard');
  const tCommon = useTranslations('common');
  const labels = useEnumLabels();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, adsData, positionsData] = await Promise.all([
          clubService.getProfile(),
          clubService.getMyAds(),
          lookupService.getPositions()
        ]);
        setProfile(profileData);
        setAds(adsData);
        setPositions(positionsData);
      } catch (err: any) {
        const status = err?.response?.status ?? err?.status;
        if (status === 401 || status === 403) router.push('/login');
        else router.push('/pending-approval');
      }
    };
    loadData();
  }, [router]);

  const openEditModal = (ad: any) => {
    setEditingAd(ad);
    setEditTitle(ad.title);
    setEditDescription(ad.description);
    const pos = positions.find(p => p.name === ad.requiredPosition);
    setEditPositionId(pos ? String(pos.id) : '');
    setEditError('');
  };

  const closeEditModal = () => { setEditingAd(null); setEditError(''); };

  const handleSaveEdit = async () => {
    if (!editingAd) return;
    setSaving(true);
    setEditError('');
    try {
      await clubService.updateJobAd(editingAd.id, {
        title: editTitle,
        description: editDescription,
        requiredPosition: parseInt(editPositionId),
      });
      setAds(await clubService.getMyAds());
      closeEditModal();
    } catch (err: any) {
      setEditError(err?.message || t('updateFailed'));
    } finally { setSaving(false); }
  };

  const handleCloseAd = async (adId: string) => {
    await clubService.closeJobAd(adId);
    setAds(await clubService.getMyAds());
  };

  const handleReopenAd = async (adId: string) => {
    await clubService.reopenJobAd(adId);
    setAds(await clubService.getMyAds());
  };

  if (!profile) return <PageShell><Loading /></PageShell>;

  const openAds = ads.filter(a => a.adStatus !== 'Closed').length;

  return (
    <PageShell>
      <PageHeader
        leading={<Avatar name={profile.name} size="xl" tone="light" />}
        title={profile.name}
        subtitle={[profile.city, profile.leagueName].filter(Boolean).join(' · ')}
        actions={<Link href="/club/job-ads/create"><Button variant="secondary"><Plus className="h-4 w-4" />{t('createNew')}</Button></Link>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: t('openAds'), value: openAds, icon: Megaphone },
          { label: t('closedAds'), value: ads.length - openAds, icon: Lock },
          { label: t('league'), value: profile.leagueName || '—', icon: Trophy, small: true },
        ].map(s => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pitch-50 text-pitch-600"><s.icon className="h-5 w-5" /></div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-ink-500">{s.label}</p>
              <p className={`truncate font-display font-bold text-ink-900 ${s.small ? 'text-sm' : 'text-2xl'}`}>{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title={t('clubInfo')} action={<Link href="/club/profile" className="inline-flex items-center gap-1 text-sm font-medium text-pitch-700 hover:text-pitch-800"><Pencil className="h-3.5 w-3.5" />{tCommon('edit')}</Link>}>
          <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-ink-600">{profile.description || '—'}</p>
          <dl className="space-y-3 border-t border-ink-100 pt-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-ink-500">{t('county')}</dt><dd className="text-right font-medium text-ink-900">{profile.county || '—'}</dd></div>
            {profile.phone && (
              <div className="flex justify-between gap-4"><dt className="text-ink-500">{t('phone')}</dt><dd><a href={`tel:${profile.phone}`} className="inline-flex items-center gap-1 font-medium text-pitch-700"><Phone className="h-3.5 w-3.5" />{profile.phone}</a></dd></div>
            )}
          </dl>
        </Card>

        <Card className="lg:col-span-2" title={t('yourJobAds')}>
          {ads.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title={t('noAds')}
              action={<Link href="/club/job-ads/create"><Button><Plus className="h-4 w-4" />{t('createNew')}</Button></Link>}
            />
          ) : (
            <ul className="divide-y divide-ink-100">
              {ads.map(ad => {
                const closed = ad.adStatus === 'Closed';
                return (
                  <li key={ad.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h4 className={`font-semibold ${closed ? 'text-ink-400' : 'text-ink-900'}`}>{ad.title}</h4>
                      <Badge tone="green">{labels.position(ad.requiredPosition)}</Badge>
                      <Badge tone={closed ? 'gray' : 'green'} dot>{labels.adStatus(closed ? 'Closed' : 'Open')}</Badge>
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm text-ink-500">{ad.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {!closed ? (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => openEditModal(ad)}><Pencil className="h-3.5 w-3.5" />{tCommon('edit')}</Button>
                          <Button variant="danger" size="sm" onClick={() => handleCloseAd(ad.id)}><Lock className="h-3.5 w-3.5" />{t('closeAd')}</Button>
                        </>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => handleReopenAd(ad.id)}><RotateCcw className="h-3.5 w-3.5" />{t('reopenAd')}</Button>
                      )}
                      <Link href="/club/applications"><Button variant="ghost" size="sm"><FileText className="h-3.5 w-3.5" />{t('viewApplications')}</Button></Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {editingAd && (
        <Modal
          title={t('editJobAd')}
          onClose={closeEditModal}
          footer={<>
            <Button variant="secondary" onClick={closeEditModal}>{tCommon('cancel')}</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>{saving ? tCommon('saving') : tCommon('saveChanges')}</Button>
          </>}
        >
          <div className="space-y-4">
            {editError && <ErrorMessage message={editError} />}
            <div>
              <label className="field-label" htmlFor="edit-title">{t('title')}</label>
              <input id="edit-title" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="field" />
            </div>
            <div>
              <label className="field-label" htmlFor="edit-position">{t('position')}</label>
              <select id="edit-position" value={editPositionId} onChange={(e) => setEditPositionId(e.target.value)} className="field">
                <option value="">{t('selectPosition')}</option>
                {positions.map(p => <option key={p.id} value={p.id}>{labels.position(p.name)}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="edit-description">{t('description')}</label>
              <textarea id="edit-description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="field" rows={5} />
            </div>
          </div>
        </Modal>
      )}
    </PageShell>
  );
}
