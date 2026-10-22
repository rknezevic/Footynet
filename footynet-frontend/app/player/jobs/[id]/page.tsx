'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobAdService } from '@/lib/jobAds';
import { playerService } from '@/lib/player';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import FormTextarea from '@/components/FormTextarea';
import { useTranslations } from 'next-intl';
import { useEnumLabels } from '@/i18n/useEnumLabels';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const t = useTranslations('jobDetail');
  const tCommon = useTranslations('common');
  const labels = useEnumLabels();

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    const data = await jobAdService.getById(id);
    setJob(data);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await playerService.applyToJob({ jobAdId: id, coverLetter });
      setSuccess(true);
      setTimeout(() => router.push('/player/applications'), 2000);
    } catch (err: any) {
      setError(err?.message || t('applyFailed'));
    }
  };

  if (!job) return <div className="p-8 text-sm text-neutral-400">{tCommon('loading')}</div>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />

      <div className="max-w-4xl mx-auto px-8 py-12">
        <Card className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">{job.title}</h1>
          <p className="text-sm text-neutral-500 mb-6">{job.clubName} · {job.leagueName} · {labels.position(job.requiredPositionName)}</p>
          <p className="text-sm text-neutral-600 leading-relaxed">{job.description}</p>
        </Card>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 text-sm text-green-700">
            {t('success')}
          </div>
        ) : (
          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-5">{t('applyTitle')}</h2>
            {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleApply}>
              <FormTextarea
                label={t('coverLetter')}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                placeholder={t('coverLetterPlaceholder')}
              />
              <Button type="submit" className="w-full mt-4">{t('submit')}</Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
