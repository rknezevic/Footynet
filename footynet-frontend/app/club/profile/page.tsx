'use client';

import { useEffect, useState } from 'react';
import { clubService } from '@/lib/club';
import { lookupService, League } from '@/lib/lookup';
import { ClubProfileDto } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';
import CityAutocomplete from '@/components/CityAutocomplete';

export default function ClubProfilePage() {
  const [profile, setProfile] = useState<ClubProfileDto | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    loadProfile();
    lookupService.getLeagues().then(setLeagues);
  }, []);

  const loadProfile = async () => {
    const data = await clubService.getProfile();
    setProfile(data);
    setName(data.name);
    setDescription(data.description);
    setCity(data.city || '');
    setCounty(data.county || '');
    setLeagueId(data.leagueId || '');
  };

  const handleSave = async () => {
    await clubService.updateProfile({ name, description, city, county, leagueId });
    setEditing(false);
    loadProfile();
  };

  if (!profile) return <div className="p-8 text-sm text-neutral-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-2xl mx-auto px-8 py-12">
        <PageHeader title="Club Profile" subtitle="Club Information" />
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Profile Details</h3>
            <Button onClick={() => editing ? handleSave() : setEditing(true)}>
              {editing ? 'Save' : 'Edit'}
            </Button>
          </div>
          {editing ? (
            <div className="space-y-4">
              <FormInput label="Club Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                <CityAutocomplete value={city} county={county} onSelect={(c, co) => { setCity(c); setCounty(co); }} />
              </div>
              <FormSelect label="League" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} required>
                <option value="">Select League</option>
                {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </FormSelect>
              <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">Club Name</p>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900">{profile.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">City</p>
                  <p className="text-sm font-medium text-neutral-900">{profile.city}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">County</p>
                  <p className="text-sm font-medium text-neutral-900">{profile.county}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">League</p>
                  <p className="text-sm font-medium text-neutral-900">{profile.leagueName}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">About</p>
                <p className="text-sm text-neutral-600 leading-relaxed">{profile.description}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
