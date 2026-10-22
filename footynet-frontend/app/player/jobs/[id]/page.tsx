'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { jobAdService } from '@/lib/jobAds';
import { playerService } from '@/lib/player';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import FormTextarea from '@/components/FormTextarea';
import Loading from '@/components/Loading';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const t = useTranslations('jobDetail');
  const labels = useEnumLabels();

  useEffect(() => {
    jobAdService.getById(id).then(setJob);
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await playerService.applyToJob({ jobAdId: id, coverLetter });
      setSuccess(true);
      setTimeout(() => router.push('/player/applications'), 2000);
    } catch (err: any) {
      setError(err?.message || t('applyFailed'));
      setSubmitting(false);
    }
  };

  if (!job) return <PageShell><Loading /></PageShell>;

  return (
    <PageShell width="medium">
      <Link href="/player/jobs" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" />{t('back')}
      </Link>

      <PageHeader
        leading={<Avatar name={job.clubName} size="xl" tone="light" />}
        title={job.title}
        subtitle={`${job.clubName} · ${job.leagueName}`}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" title={t('aboutRole')}>
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge tone="green">{labels.position(job.requiredPositionName)}</Badge>
            <Badge>{job.leagueName}</Badge>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">{job.description}</p>
        </Card>

        <Card className="lg:col-span-2" title={t('applyTitle')}>
          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="mb-3 h-12 w-12 text-pitch-500" />
              <p className="font-semibold text-ink-900">{t('success')}</p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              {error && <ErrorMessage message={error} />}
              <FormTextarea
                label={t('coverLetter')}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={7}
                placeholder={t('coverLetterPlaceholder')}
              />
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                <Send className="h-4 w-4" />{t('submit')}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
