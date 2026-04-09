'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clubService } from '@/lib/club';
import { lookupService, Position } from '@/lib/lookup';
import UnifiedNavBar from '@/components/UnifiedNavBar';

export default function CreateJobAdPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [positionId, setPositionId] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    lookupService.getPositions().then(setPositions).catch(() => setError('Failed to load positions.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await clubService.createJobAd({ title, description, requiredPosition: parseInt(positionId) });
      router.push('/club/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to create job ad');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-1">Create Job Ad</h2>
        <p className="text-sm text-neutral-500 mb-8">New advertisement</p>
        {error && <div className="bg-red-50 border-l-2 border-red-500 px-4 py-2 mb-6 text-sm text-red-700 rounded-r">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Position</label>
            <select value={positionId} onChange={(e) => setPositionId(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" required>
              <option value="">Select Position</option>
              {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" rows={5} required />
          </div>
          <button type="submit" className="w-full bg-neutral-900 text-white py-2.5 text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors">Create Job Ad</button>
        </form>
      </div>
    </div>
  );
}
