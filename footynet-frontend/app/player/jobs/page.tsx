'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobAdService } from '@/lib/jobAds';
import { lookupService, County, League, Position } from '@/lib/lookup';
import { JobAdDto } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';

export default function PlayerJobsPage() {
  const [jobs, setJobs] = useState<JobAdDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionId, setPositionId] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [countyId, setCountyId] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [counties, setCounties] = useState<County[]>([]);

  useEffect(() => {
    Promise.all([lookupService.getPositions(), lookupService.getLeagues(), lookupService.getCounties()])
      .then(([pos, lea, cou]) => { setPositions(pos); setLeagues(lea); setCounties(cou); })
      .catch(console.error);
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await jobAdService.getAll({
      page: 1, pageSize: 50, searchTerm,
      position: positionId || undefined,
      leagueId: leagueId || undefined,
      countyId: countyId || undefined
    });
    setJobs(data);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); loadJobs(); };
  const clearFilters = () => { setSearchTerm(''); setPositionId(''); setLeagueId(''); setCountyId(''); };

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">Job Opportunities</h1>
        <p className="text-sm text-neutral-500 mb-8">Browse and apply</p>

        <form onSubmit={handleSearch} className="bg-white border border-neutral-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Search</label>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title or description..." className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Position</label>
              <select value={positionId} onChange={(e) => setPositionId(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent">
                <option value="">All Positions</option>
                {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">League</label>
              <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent">
                <option value="">All Leagues</option>
                {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">County</label>
              <select value={countyId} onChange={(e) => setCountyId(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent">
                <option value="">All Counties</option>
                {counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="bg-neutral-900 text-white px-5 py-2 text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors">Apply Filters</button>
            <button type="button" onClick={clearFilters} className="border border-neutral-300 text-neutral-700 px-5 py-2 text-sm font-medium rounded-md hover:bg-neutral-50 transition-colors">Clear</button>
          </div>
        </form>

        <div className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-sm text-neutral-400">No jobs found. Try adjusting your filters.</p>
          ) : jobs.map((job) => (
            <div key={job.id} className="bg-white border border-neutral-200 rounded-lg p-6 hover-lift">
              <h3 className="text-xl font-semibold text-neutral-900 mb-1">{job.title}</h3>
              <p className="text-xs text-neutral-400 mb-3">{job.clubName} · {job.leagueName} · {job.requiredPosition}</p>
              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{job.description}</p>
              <Link href={`/player/jobs/${job.id}`} className="inline-block bg-neutral-900 text-white px-5 py-2 text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors">View & Apply</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
