'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clubService } from '@/lib/club';
import { lookupService, Position } from '@/lib/lookup';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';
import Button from '@/components/Button';

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
          <FormInput label="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <FormSelect label="Position" value={positionId} onChange={(e) => setPositionId(e.target.value)} required>
            <option value="">Select Position</option>
            {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </FormSelect>
          <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required />
          <Button type="submit" className="w-full">Create Job Ad</Button>
        </form>
      </div>
    </div>
  );
}
