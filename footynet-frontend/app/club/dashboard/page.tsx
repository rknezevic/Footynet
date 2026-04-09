'use client';

import { useEffect, useState } from 'react';
import { clubService } from '@/lib/club';
import { lookupService, Position } from '@/lib/lookup';
import { ClubProfileDto, CreateJobAdDto } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClubDashboard() {
  const [profile, setProfile] = useState<ClubProfileDto | null>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPositionId, setEditPositionId] = useState('');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, adsData, positionsData] = await Promise.all([
          clubService.getProfile(),
          clubService.getMyAds(),
          lookupService.getPositions()
        ]);
        setProfile(profileData);
        setAds(adsData);
        setPositions(positionsData);
      } catch (err: any) {
        const status = err?.response?.status ?? err?.status;
        if (status === 401 || status === 403) router.push('/login');
        else router.push('/club/profile/setup');
      }
    };
    loadData();
  }, [router]);

  const openEditModal = (ad: any) => {
    setEditingAd(ad);
    setEditTitle(ad.title);
    setEditDescription(ad.description);
    const pos = positions.find(p => p.name === ad.requiredPosition);
    setEditPositionId(pos ? String(pos.id) : '');
    setEditError('');
  };

  const closeEditModal = () => { setEditingAd(null); setEditError(''); };

  const handleSaveEdit = async () => {
    if (!editingAd) return;
    setSaving(true);
    setEditError('');
    try {
      await clubService.updateJobAd(editingAd.id, {
        title: editTitle,
        description: editDescription,
        requiredPosition: parseInt(editPositionId),
      });
      setAds(await clubService.getMyAds());
      closeEditModal();
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update job ad');
    } finally { setSaving(false); }
  };

  const handleCloseAd = async (adId: string) => {
    await clubService.closeJobAd(adId);
    setAds(await clubService.getMyAds());
  };

  const handleReopenAd = async (adId: string) => {
    await clubService.reopenJobAd(adId);
    setAds(await clubService.getMyAds());
  };

  if (!profile) return <div className="p-8 text-sm text-neutral-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title={profile.city ? `${profile.name} ${profile.city}` : profile.name} subtitle="Club Dashboard" />

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <Card hover>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">Club Info</h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">{profile.description}</p>
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">League</p>
                  <p className="text-sm font-medium text-neutral-900">{profile.leagueName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">County</p>
                  <p className="text-sm font-medium text-neutral-900">{profile.countyName}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-8">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Your Job Ads</h3>
                <Link href="/club/job-ads/create"><Button>Create New</Button></Link>
              </div>
              <div className="space-y-5">
                {ads.length === 0 ? (
                  <p className="text-sm text-neutral-400">No job ads yet. Create one to start recruiting.</p>
                ) : ads.map((ad, i) => (
                  <div key={ad.id} className={`pb-5 ${i !== ads.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-lg font-semibold text-neutral-900">{ad.title}</h4>
                      {ad.adStatus === 'Closed' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">Closed</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{ad.description}</p>
                    <div className="flex gap-4">
                      {ad.adStatus !== 'Closed' ? (
                        <>
                          <button onClick={() => openEditModal(ad)} className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">Edit</button>
                          <button onClick={() => handleCloseAd(ad.id)} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">Close Ad</button>
                        </>
                      ) : (
                        <button onClick={() => handleReopenAd(ad.id)} className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">Reopen Ad</button>
                      )}
                      <Link href="/club/applications" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">View Applications</Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {editingAd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 relative shadow-xl">
            <button onClick={closeEditModal} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 text-lg" aria-label="Close">×</button>
            <h2 className="text-xl font-semibold text-neutral-900 mb-5">Edit Job Ad</h2>
            {editError && <div className="bg-red-50 border-l-2 border-red-500 px-3 py-2 mb-4 text-sm text-red-700 rounded-r">{editError}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Position</label>
                <select value={editPositionId} onChange={(e) => setEditPositionId(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent">
                  <option value="">Select Position</option>
                  {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" rows={4} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSaveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                <Button variant="secondary" onClick={closeEditModal}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
