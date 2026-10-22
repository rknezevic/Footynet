'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { playerService } from '@/lib/player';
import { AvailabilityStatus, PlayerProfileDto } from '@/types';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import PlayerExtrasFields, { PlayerExtras } from '@/components/PlayerExtrasFields';

// Optional step right after registration: positions, availability and previous clubs
export default function CompleteProfilePage() {
  const t = useTranslations('completeProfile');
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfileDto | null>(null);
  const [extras, setExtras] = useState<PlayerExtras>({
    primaryPosition: null, secondaryPosition: null, availability: AvailabilityStatus.LookingForClub, career: [],
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    playerService.getProfile().then(p => {
      setProfile(p);
      setExtras({ primaryPosition: p.primaryPosition, secondaryPosition: p.secondaryPosition, availability: p.availability, career: p.career });
    }).catch(() => router.push('/login'));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError('');
    setSaving(true);
    try {
      await playerService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        description: profile.description,
        prefeeredFootType: profile.prefeeredFootType,
        city: profile.city,
        county: profile.county,
        ...extras,
        career: extras.career.filter(c => c.clubName.trim() !== ''),
      });
      router.push('/player/jobs');
    } catch (err: any) {
      setError(err?.message);
      setSaving(false);
    }
  };

  if (!profile) return <Loading fullScreen />;

  return (
    <AuthLayout wide>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-pitch-50 px-3 py-1 text-xs font-semibold text-pitch-700">
        <Sparkles className="h-3.5 w-3.5" />{t('badge')}
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">{t('title', { name: profile.firstName })}</h1>
      <p className="mb-8 mt-2 text-ink-500">{t('subtitle')}</p>

      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <form onSubmit={handleSave} className="space-y-6">
        <PlayerExtrasFields value={extras} onChange={setExtras} />
        <div className="flex flex-col-reverse gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:justify-end">
          <Button variant="ghost" size="lg" onClick={() => router.push('/player/jobs')}>{t('skip')}</Button>
          <Button type="submit" size="lg" disabled={saving}>{saving ? t('saving') : t('save')}</Button>
        </div>
      </form>
    </AuthLayout>
  );
}
