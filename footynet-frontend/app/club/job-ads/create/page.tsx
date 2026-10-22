'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Megaphone } from 'lucide-react';
import { clubService } from '@/lib/club';
import { lookupService, Position } from '@/lib/lookup';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';

export default function CreateJobAdPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [positionId, setPositionId] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const t = useTranslations('createJobAd');
  const labels = useEnumLabels();

  useEffect(() => {
    lookupService.getPositions().then(setPositions).catch(() => setError(t('positionsFailed')));
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await clubService.createJobAd({ title, description, requiredPosition: parseInt(positionId) });
      router.push('/club/dashboard');
    } catch (err: any) {
      setError(err?.message || t('failed'));
      setSubmitting(false);
    }
  };

  return (
    <PageShell width="narrow">
      <Link href="/club/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" />{t('back')}
      </Link>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <ErrorMessage message={error} />}
          <FormInput label={t('adTitle')} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('titlePlaceholder')} maxLength={100} required />
          <FormSelect label={t('position')} value={positionId} onChange={(e) => setPositionId(e.target.value)} required>
            <option value="">{t('selectPosition')}</option>
            {positions.map(p => <option key={p.id} value={p.id}>{labels.position(p.name)}</option>)}
          </FormSelect>
          <FormTextarea label={t('description')} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('descriptionPlaceholder')} rows={7} required />
          <Button type="submit" size="lg" className="w-full" disabled={submitting}><Megaphone className="h-4 w-4" />{t('submit')}</Button>
        </form>
      </Card>
    </PageShell>
  );
}
