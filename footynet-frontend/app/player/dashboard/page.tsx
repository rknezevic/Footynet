'use client';

import { useEffect, useState } from 'react';
import { playerService } from '@/lib/player';
import { jobAdService } from '@/lib/jobAds';
import { PlayerProfileDto, JobAdDto } from '@/types';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UnifiedNavBar from '@/components/UnifiedNavBar';

export default function PlayerDashboard() {
  const [profile, setProfile] = useState<PlayerProfileDto | null>(null);
  const [jobs, setJobs] = useState<JobAdDto[]>([]);
  const router = useRouter();

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
        if (status === 401 || status === 403) {
          router.push('/login');
        } else {
          router.push('/player/profile/setup');
        }
      }
    };
    loadData();
  }, [router]);

  if (!profile) return <div className="p-8 text-sm text-neutral-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title={`${profile.firstName} ${profile.lastName}`} subtitle="Player Dashboard" />

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <Card hover>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">Profile</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">Age</p>
                  <p className="text-2xl font-bold tracking-tight text-neutral-900">{profile.age}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">Location</p>
                  <p className="text-sm text-neutral-900">{profile.city}, {profile.countyName}</p>
                </div>
                {profile.description && (
                  <div className="pt-3 border-t border-neutral-100">
                    <p className="text-sm leading-relaxed text-neutral-600">{profile.description}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-8">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Latest Opportunities</h3>
                <Link href="/player/jobs" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
                  View All →
                </Link>
              </div>
              <div className="space-y-5">
                {jobs.map((job, i) => (
                  <div key={job.id} className={`pb-5 ${i !== jobs.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-1">{job.title}</h4>
                    <p className="text-sm text-neutral-500 mb-2">{job.clubName} · {job.leagueName}</p>
                    <Link href={`/player/jobs/${job.id}`} className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
