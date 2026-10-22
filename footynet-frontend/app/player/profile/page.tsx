'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil } from 'lucide-react';
import { playerService } from '@/lib/player';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { PlayerProfileDto, PreferredFootType } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';
import CityAutocomplete from '@/components/CityAutocomplete';
import Loading from '@/components/Loading';
import PlayerProfileDetails from '@/components/PlayerProfileDetails';
import PlayerExtrasFields, { PlayerExtras } from '@/components/PlayerExtrasFields';

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
  const [extras, setExtras] = useState<PlayerExtras | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const t = useTranslations('playerProfile');
  const tCommon = useTranslations('common');
  const labels = useEnumLabels();

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
    setExtras({ primaryPosition: data.primaryPosition, secondaryPosition: data.secondaryPosition, availability: data.availability, career: data.career });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extras) return;
    setError('');
    setSaving(true);
    try {
      await playerService.updateProfile({
        firstName, lastName, age, city, county, description,
        prefeeredFootType: preferredFootType,
        ...extras,
        career: extras.career.filter(c => c.clubName.trim() !== ''),
      });
      setEditing(false);
      await loadProfile();
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => { setEditing(false); setError(''); loadProfile(); };

  if (!profile || !extras) return <PageShell><Loading /></PageShell>;

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <PageShell width="medium">
      <PageHeader
        leading={<Avatar name={fullName} size="xl" tone="light" />}
        title={fullName}
        subtitle={t('subtitle', { age: profile.age })}
        actions={!editing && (
          <Button variant="secondary" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />{t('edit')}</Button>
        )}
      />

      {editing ? (
        <form onSubmit={handleSave} className="space-y-6">
          {error && <ErrorMessage message={error} />}
          <Card title={t('basicInfo')}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label={t('firstName')} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <FormInput label={t('lastName')} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label={t('age')} type="number" min={16} max={50} value={age} onChange={(e) => setAge(parseInt(e.target.value))} required />
                <FormSelect label={t('preferredFoot')} value={preferredFootType} onChange={(e) => setPreferredFootType(parseInt(e.target.value) as PreferredFootType)}>
                  <option value={PreferredFootType.Right}>{labels.foot('Right')}</option>
                  <option value={PreferredFootType.Left}>{labels.foot('Left')}</option>
                </FormSelect>
              </div>
              <div>
                <label className="field-label">{t('city')}</label>
                <CityAutocomplete value={city} county={county} onSelect={(c, co) => { setCity(c); setCounty(co); }} />
              </div>
              <FormTextarea label={t('description')} value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>
          </Card>
          <Card title={t('footballInfo')}>
            <PlayerExtrasFields value={extras} onChange={setExtras} />
          </Card>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={cancelEdit}>{tCommon('cancel')}</Button>
            <Button type="submit" disabled={saving}>{saving ? tCommon('saving') : tCommon('saveChanges')}</Button>
          </div>
        </form>
      ) : (
        <Card title={t('details')} action={<AvailabilityBadge status={profile.availability} />}>
          <PlayerProfileDetails profile={profile} />
        </Card>
      )}
    </PageShell>
  );
}
