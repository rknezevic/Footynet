'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/lib/admin';
import { jobAdService } from '@/lib/jobAds';
import { AdminJobAdDto, PaginatedResult } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10;

export default function AdminJobAds() {
  const [data, setData] = useState<PaginatedResult<AdminJobAdDto> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const router = useRouter();

  const loadJobAds = useCallback(async (p: number, s: string) => {
    try {
      setError('');
      const result = await adminService.getJobAds(s || undefined, p, PAGE_SIZE);
      setData(result);
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403) {
        router.push('/login');
      } else {
        setError('Failed to load job ads.');
      }
    }
  }, [router]);

  useEffect(() => {
    loadJobAds(page, search);
  }, [page, search, loadJobAds]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    setActioningId(id);
    try {
      await adminService.deleteJobAd(id);
      await loadJobAds(page, search);
    } catch {
      setError('Failed to delete job ad.');
    } finally {
      setActioningId(null);
    }
  };

  const handleViewDetails = async (id: string) => {
    setLoadingDetail(true);
    try {
      const detail = await jobAdService.getById(id);
      setSelectedJob(detail);
    } catch {
      setError('Failed to load job ad details.');
    } finally {
      setLoadingDetail(false);
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
        <PageHeader title="Job Ad Moderation" subtitle="View and manage all job advertisements" />

        {error && (
          <div className="bg-red-50 border-l-2 border-red-500 px-3 py-2 text-sm text-red-700 rounded-r mb-6">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 max-w-xs px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white text-neutral-900 placeholder-neutral-400"
          />
        </div>

        <Card>
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">No job ads found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Title</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Club</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Created At</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Status</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((ad) => (
                    <tr key={ad.id} className="border-b border-neutral-100 last:border-0">
                      <td className="py-4 text-neutral-900 font-medium">{ad.title}</td>
                      <td className="py-4 text-neutral-600">{ad.clubName}</td>
                      <td className="py-4 text-neutral-600">{new Date(ad.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          ad.adStatus === 'Open' ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {ad.adStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => handleViewDetails(ad.id)}
                            disabled={loadingDetail}
                            className="px-3 py-1.5 text-xs"
                          >
                            View
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(ad.id)}
                            disabled={actioningId === ad.id}
                            className="px-3 py-1.5 text-xs"
                          >
                            Delete
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

      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">{selectedJob.title}</h2>
              <button onClick={() => setSelectedJob(null)} className="text-neutral-400 hover:text-neutral-600 text-lg">✕</button>
            </div>
            <p className="text-sm text-neutral-500 mb-4">
              {selectedJob.clubName} · {selectedJob.leagueName} · {selectedJob.requiredPosition}
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">{selectedJob.description}</p>
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span>Posted {new Date(selectedJob.createdAt).toLocaleDateString()}</span>
              <span className={`px-2 py-0.5 font-medium rounded-full ${
                selectedJob.adStatus === 'Open' || selectedJob.adStatus === 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-neutral-100 text-neutral-500'
              }`}>
                {selectedJob.adStatus === 0 ? 'Open' : selectedJob.adStatus === 1 ? 'Closed' : selectedJob.adStatus}
              </span>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedJob(null)} className="px-4 py-2 text-sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
