'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Briefcase, MapPin, Pencil } from 'lucide-react';
import { playerService } from '@/lib/player';
import { jobAdService } from '@/lib/jobAds';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { PlayerProfileDto, JobAdDto } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import EmptyState from '@/components/EmptyState';
import Loading from '@/components/Loading';

export default function PlayerDashboard() {
  const [profile, setProfile] = useState<PlayerProfileDto | null>(null);
  const [jobs, setJobs] = useState<JobAdDto[]>([]);
  const router = useRouter();
  const t = useTranslations('playerDashboard');
  const labels = useEnumLabels();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, jobsData] = await Promise.all([
          playerService.getProfile(),
          jobAdService.getAll({ page: 1, pageSize: 5 })
        ]);
        setProfile(profileData);
        setJobs(jobsData);
      } catch (err: any) {
        const status = err?.response?.status ?? err?.status;
        if (status === 401 || status === 403) router.push('/login');
      }
    };
    loadData();
  }, [router]);

  if (!profile) return <PageShell><Loading /></PageShell>;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const positions = [profile.primaryPosition, profile.secondaryPosition].filter(p => p !== null).map(p => labels.position(p));

  return (
    <PageShell>
      <PageHeader
        leading={<Avatar name={fullName} size="xl" tone="light" />}
        title={t('welcome', { name: profile.firstName })}
        subtitle={t('subtitle')}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title={t('profile')}
          action={<Link href="/player/profile" className="inline-flex items-center gap-1 text-sm font-medium text-pitch-700 hover:text-pitch-800"><Pencil className="h-3.5 w-3.5" />{t('edit')}</Link>}
        >
          <div className="mb-4 flex items-center gap-3">
            <Avatar name={fullName} size="lg" />
            <div>
              <p className="font-display text-lg font-semibold text-ink-900">{fullName}</p>
              <p className="flex items-center gap-1 text-sm text-ink-500"><MapPin className="h-3.5 w-3.5" />{profile.city || '—'}</p>
            </div>
          </div>
          <div className="mb-4"><AvailabilityBadge status={profile.availability} /></div>
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-ink-50 p-3">
              <dt className="text-xs text-ink-500">{t('age')}</dt>
              <dd className="font-display text-2xl font-bold text-ink-900">{profile.age}</dd>
            </div>
            <div className="rounded-xl bg-ink-50 p-3">
              <dt className="text-xs text-ink-500">{t('clubs')}</dt>
              <dd className="font-display text-2xl font-bold text-ink-900">{profile.career.length}</dd>
            </div>
          </dl>
          {positions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">{positions.map(p => <Badge key={p} tone="green">{p}</Badge>)}</div>
          )}
        </Card>

        <Card
          className="lg:col-span-2"
          title={t('latestOpportunities')}
          action={<Link href="/player/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-pitch-700 hover:text-pitch-800">{t('viewAll')}<ArrowRight className="h-3.5 w-3.5" /></Link>}
        >
          {jobs.length === 0 ? (
            <EmptyState icon={Briefcase} title={t('noJobs')} />
          ) : (
            <ul className="-mx-2 divide-y divide-ink-100">
              {jobs.map(job => (
                <li key={job.id}>
                  <Link href={`/player/jobs/${job.id}`} className="group flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-ink-50">
                    <Avatar name={job.clubName} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink-900 group-hover:text-pitch-700">{job.title}</p>
                      <p className="truncate text-sm text-ink-500">{job.clubName} · {job.leagueName}</p>
                    </div>
                    <Badge tone="green">{labels.position(job.requiredPositionName)}</Badge>
                    <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-pitch-600" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
