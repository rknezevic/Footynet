'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/lib/admin';
import { AdminDashboardDto, PendingClubDto, PaginatedResult } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardDto | null>(null);
  const [pendingClubs, setPendingClubs] = useState<PaginatedResult<PendingClubDto> | null>(null);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const router = useRouter();

  const loadData = async () => {
    try {
      const [dashboardData, clubsData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getPendingClubs(1, 10),
      ]);
      setStats(dashboardData);
      setPendingClubs(clubsData);
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403) {
        router.push('/login');
      } else {
        setError('Failed to load dashboard.');
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      await adminService.approveClub(id);
      await loadData();
    } catch {
      setError('Failed to approve club.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    try {
      await adminService.rejectClub(id);
      await loadData();
    } catch {
      setError('Failed to reject club.');
    } finally {
      setActioningId(null);
    }
  };

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <UnifiedNavBar />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="bg-red-50 border-l-2 border-red-500 px-3 py-2 text-sm text-red-700 rounded-r">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-sm text-neutral-400">Loading...</div>;

  const statCards = [
    { label: 'Players', value: stats.playerCount },
    { label: 'Clubs', value: stats.clubCount },
    { label: 'Job Ads', value: stats.jobAdCount },
    { label: 'Pending Clubs', value: stats.pendingClubCount },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title="Admin Dashboard" subtitle="Platform overview and statistics" />

        {error && (
          <div className="bg-red-50 border-l-2 border-red-500 px-3 py-2 text-sm text-red-700 rounded-r mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-12 gap-8 mb-10">
          {statCards.map((stat) => (
            <div key={stat.label} className="col-span-12 sm:col-span-6 md:col-span-3">
              <Card hover>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">
                  {stat.label}
                </h3>
                <p className="text-3xl font-bold tracking-tight text-neutral-900">
                  {stat.value}
                </p>
              </Card>
            </div>
          ))}
        </div>

        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">Pending Club Registrations</h2>
        <Card>
          {!pendingClubs || pendingClubs.items.length === 0 ? (
            <p className="text-sm text-neutral-500">No pending club registrations.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Name</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Email</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">League</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">City</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingClubs.items.map((club) => (
                    <tr key={club.id} className="border-b border-neutral-100 last:border-0">
                      <td className="py-4 text-neutral-900 font-medium">{club.name}</td>
                      <td className="py-4 text-neutral-600">{club.email}</td>
                      <td className="py-4 text-neutral-600">{club.leagueName}</td>
                      <td className="py-4 text-neutral-600">{club.city}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="primary"
                            onClick={() => handleApprove(club.id)}
                            disabled={actioningId === club.id}
                            className="px-3 py-1.5 text-xs"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleReject(club.id)}
                            disabled={actioningId === club.id}
                            className="px-3 py-1.5 text-xs"
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
