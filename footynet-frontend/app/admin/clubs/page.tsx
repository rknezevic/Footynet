'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/lib/admin';
import { PendingClubDto, PaginatedResult } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10;

export default function AdminClubs() {
  const [data, setData] = useState<PaginatedResult<PendingClubDto> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const router = useRouter();

  const loadClubs = useCallback(async (p: number) => {
    try {
      setError('');
      const result = await adminService.getPendingClubs(p, PAGE_SIZE);
      setData(result);
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403) {
        router.push('/login');
      } else {
        setError('Failed to load pending clubs.');
      }
    }
  }, [router]);

  useEffect(() => {
    loadClubs(page);
  }, [page, loadClubs]);

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      await adminService.approveClub(id);
      await loadClubs(page);
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
      await loadClubs(page);
    } catch {
      setError('Failed to reject club.');
    } finally {
      setActioningId(null);
    }
  };

  if (error && !data) {
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

  if (!data) return <div className="p-8 text-sm text-neutral-400">Loading...</div>;

  const { items, totalPages } = data;

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title="Pending Clubs" subtitle="Review and approve or reject club registrations" />

        {error && (
          <div className="bg-red-50 border-l-2 border-red-500 px-3 py-2 text-sm text-red-700 rounded-r mb-6">
            {error}
          </div>
        )}

        <Card>
          {items.length === 0 ? (
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
                  {items.map((club) => (
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-neutral-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
