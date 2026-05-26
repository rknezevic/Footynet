'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { playerService } from '@/lib/player';
import { PlayerProfileDto, PreferredFootType } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';
import CityAutocomplete from '@/components/CityAutocomplete';

export default function PlayerProfilePage() {
  const [profile, setProfile] = useState<PlayerProfileDto | null>(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(18);
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [description, setDescription] = useState('');
  const [preferredFootType, setPreferredFootType] = useState<PreferredFootType>(PreferredFootType.Right);
  const router = useRouter();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const data = await playerService.getProfile();
    setProfile(data);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setAge(data.age);
    setCity(data.city);
    setCounty(data.county);
    setDescription(data.description);
    setPreferredFootType(data.prefeeredFootType);
  };

  const handleSave = async () => {
    try {
      await playerService.updateProfile({
        firstName, lastName, age, city, county, description,
        prefeeredFootType: preferredFootType,
      });
      setEditing(false);
      loadProfile();
    } catch (err: any) { alert(err.message); }
  };

  if (!profile) return <div className="p-8 text-sm text-neutral-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-2xl mx-auto px-8 py-12">
        <PageHeader title="My Profile" subtitle="Player Information" />
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Profile Details</h3>
            <Button onClick={() => editing ? handleSave() : setEditing(true)}>
              {editing ? 'Save' : 'Edit'}
            </Button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <FormInput label="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <FormInput label="Age" type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                <CityAutocomplete value={city} county={county} onSelect={(c, co) => { setCity(c); setCounty(co); }} />
              </div>
              <FormSelect label="Preferred Foot" value={preferredFootType} onChange={(e) => setPreferredFootType(parseInt(e.target.value) as PreferredFootType)}>
                <option value={PreferredFootType.Right}>Right</option>
                <option value={PreferredFootType.Left}>Left</option>
              </FormSelect>
              <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">Name</p>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900">{profile.firstName} {profile.lastName}</h3>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">Age</p>
                  <p className="text-sm font-medium text-neutral-900">{profile.age}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">City</p>
                  <p className="text-sm font-medium text-neutral-900">{profile.city}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">County</p>
                  <p className="text-sm font-medium text-neutral-900">{profile.county}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">Preferred Foot</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {profile.prefeeredFootType === PreferredFootType.Left ? 'Left' : 'Right'}
                  </p>
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
