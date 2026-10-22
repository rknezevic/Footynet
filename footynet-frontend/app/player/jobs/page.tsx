'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Search, SearchX, X } from 'lucide-react';
import { jobAdService } from '@/lib/jobAds';
import LeagueOptions from '@/components/LeagueOptions';
import { lookupService, League, Position } from '@/lib/lookup';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { JobAdDto } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';

export default function PlayerJobsPage() {
  const [jobs, setJobs] = useState<JobAdDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionId, setPositionId] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const t = useTranslations('playerJobs');
  const labels = useEnumLabels();

  useEffect(() => {
    Promise.all([lookupService.getPositions(), lookupService.getLeagues()])
      .then(([pos, lea]) => { setPositions(pos); setLeagues(lea); })
      .catch(console.error);
    loadJobs();
    // Initial load only; later loads are triggered by the filter form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadJobs = async (filters = { searchTerm, positionId, leagueId }) => {
    const data = await jobAdService.getAll({
      page: 1, pageSize: 50, searchTerm: filters.searchTerm,
      position: filters.positionId || undefined,
      leagueId: filters.leagueId || undefined,
    });
    setJobs(data);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); loadJobs(); };
  const clearFilters = () => {
    setSearchTerm(''); setPositionId(''); setLeagueId('');
    loadJobs({ searchTerm: '', positionId: '', leagueId: '' });
  };
  const hasFilters = searchTerm || positionId || leagueId;

  return (
    <PageShell>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Card className="mb-6">
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
          <div>
            <label className="field-label" htmlFor="job-search">{t('search')}</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input id="job-search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('searchPlaceholder')} className="field pl-9" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="job-position">{t('position')}</label>
            <select id="job-position" value={positionId} onChange={(e) => setPositionId(e.target.value)} className="field">
              <option value="">{t('allPositions')}</option>
              {positions.map(p => <option key={p.id} value={p.id}>{labels.position(p.name)}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="job-league">{t('league')}</label>
            <select id="job-league" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} className="field">
              <option value="">{t('allLeagues')}</option>
              <LeagueOptions leagues={leagues} />
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{t('applyFilters')}</Button>
            {hasFilters && <Button variant="ghost" onClick={clearFilters}><X className="h-4 w-4" />{t('clear')}</Button>}
          </div>
        </form>
      </Card>

      <p className="mb-4 text-sm text-ink-500">{t('resultCount', { count: jobs.length })}</p>

      {jobs.length === 0 ? (
        <Card><EmptyState icon={SearchX} title={t('noJobs')} /></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <Link key={job.id} href={`/player/jobs/${job.id}`} className="group">
              <Card hover className="flex h-full flex-col">
                <div className="mb-4 flex items-start gap-3">
                  <Avatar name={job.clubName} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-ink-900 group-hover:text-pitch-700">{job.title}</h3>
                    <p className="truncate text-sm text-ink-500">{job.clubName}</p>
                  </div>
                </div>
                <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-600">{job.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="green">{labels.position(job.requiredPositionName)}</Badge>
                  <Badge>{job.leagueName}</Badge>
                  <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-pitch-700">
                    {t('viewAndApply')}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
