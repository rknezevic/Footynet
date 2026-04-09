'use client';

import { useEffect, useState } from 'react';
import { clubService } from '@/lib/club';
import { JobApplication, StatusType, PlayerProfileDto } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function ClubApplications() {
  const [jobAds, setJobAds] = useState<any[]>([]);
  const [selectedAdId, setSelectedAdId] = useState<string>('all');
  const [allApplications, setAllApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState<PlayerProfileDto | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    clubService.getMyAds().then(setJobAds).catch(console.error);
  }, []);

  useEffect(() => {
    if (jobAds.length === 0) return;
    setPage(1);
  }, [selectedAdId, jobAds]);

  useEffect(() => {
    if (jobAds.length === 0) return;
    loadApplications();
  }, [jobAds, selectedAdId, page]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      if (selectedAdId === 'all') {
        const results = await Promise.all(jobAds.map(ad => clubService.getApplications(ad.id, undefined, 1, 100)));
        const flat = results.flatMap(r => r.items);
        const start = (page - 1) * pageSize;
        setAllApplications(flat.slice(start, start + pageSize));
        setTotalPages(Math.max(1, Math.ceil(flat.length / pageSize)));
      } else {
        const result = await clubService.getApplications(selectedAdId, undefined, page, pageSize);
        setAllApplications(result.items);
        setTotalPages(result.totalPages || 1);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAccept = async (appId: string) => {
    await clubService.acceptApplication(appId);
    setAllApplications(prev => prev.map(a => a.id === appId ? { ...a, status: StatusType.Accepted } : a));
  };

  const handleReject = async (appId: string) => {
    await clubService.rejectApplication(appId);
    setAllApplications(prev => prev.map(a => a.id === appId ? { ...a, status: StatusType.Rejected } : a));
  };

  const statusBadge = (status: number) => {
    const cfg: Record<number, { bg: string; label: string }> = {
      0: { bg: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Pending' },
      1: { bg: 'bg-green-50 text-green-700 border-green-200', label: 'Accepted' },
      2: { bg: 'bg-red-50 text-red-700 border-red-200', label: 'Rejected' },
    };
    const c = cfg[status] || { bg: 'bg-neutral-50 text-neutral-500 border-neutral-200', label: 'Unknown' };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded border ${c.bg}`}>{c.label}</span>;
  };

  const getAdTitle = (jobAdId: string) => jobAds.find(a => a.id === jobAdId)?.title || '';
  const footLabel = (ft: number) => ft === 0 ? 'Right' : ft === 1 ? 'Left' : 'Unknown';

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title="Applications" subtitle="Review player applications" />

        <div className="mb-8">
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Filter by Job Ad</label>
          <select
            value={selectedAdId}
            onChange={(e) => setSelectedAdId(e.target.value)}
            className="w-full max-w-md px-3 py-2.5 border border-neutral-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          >
            <option value="all">All Job Ads</option>
            {jobAds.map(ad => (
              <option key={ad.id} value={ad.id}>
                {ad.title} ({ad.requiredPosition}){ad.adStatus === 'Closed' ? ' — Inactive' : ''}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-neutral-400 text-sm">Loading...</div>
        ) : allApplications.length === 0 ? (
          <Card><p className="text-center text-sm text-neutral-400">No applications found</p></Card>
        ) : (
          <div className="space-y-4">
            {allApplications.map(app => (
              <Card key={app.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-neutral-900">{app.player.firstName} {app.player.lastName}</h3>
                      <button onClick={() => setViewingPlayer(app.player)} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline transition-colors">View Profile</button>
                    </div>
                    {selectedAdId === 'all' && <p className="text-xs text-neutral-500 mb-1">Applied for: {getAdTitle(app.jobAdId)}</p>}
                    <p className="text-xs text-neutral-400 mb-3">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                    {app.coverLetter && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-neutral-500 mb-1">Cover Letter</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{app.coverLetter}</p>
                      </div>
                    )}
                    <div>{statusBadge(app.status)}</div>
                  </div>
                  {app.status === StatusType.Pending && (
                    <div className="flex gap-2 ml-4">
                      <Button variant="primary" onClick={() => handleAccept(app.id)}>Accept</Button>
                      <Button variant="danger" onClick={() => handleReject(app.id)}>Reject</Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="secondary" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>Previous</Button>
            <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
            <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next</Button>
          </div>
        )}
      </div>

      {viewingPlayer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative shadow-xl">
            <button onClick={() => setViewingPlayer(null)} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 text-lg" aria-label="Close">×</button>
            <h2 className="text-xl font-semibold text-neutral-900 mb-5">{viewingPlayer.firstName} {viewingPlayer.lastName}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">Age</p>
                  <p className="text-lg font-semibold text-neutral-900">{viewingPlayer.age}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">City</p>
                  <p className="text-sm font-medium text-neutral-900">{viewingPlayer.city}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">Preferred Foot</p>
                <p className="text-sm text-neutral-900">{footLabel(viewingPlayer.prefeeredFootType as unknown as number)}</p>
              </div>
              {viewingPlayer.description && (
                <div className="pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400 mb-0.5">About</p>
                  <p className="text-sm text-neutral-600 leading-relaxed">{viewingPlayer.description}</p>
                </div>
              )}
            </div>
            <div className="mt-5"><Button variant="secondary" onClick={() => setViewingPlayer(null)}>Close</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}
