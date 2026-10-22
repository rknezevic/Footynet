'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Pencil, Phone, Trophy } from 'lucide-react';
import { clubService } from '@/lib/club';
import LeagueOptions from '@/components/LeagueOptions';
import { lookupService, League } from '@/lib/lookup';
import { ClubProfileDto } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';
import CityAutocomplete from '@/components/CityAutocomplete';
import Loading from '@/components/Loading';

export default function ClubProfilePage() {
  const [profile, setProfile] = useState<ClubProfileDto | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [phone, setPhone] = useState('');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const t = useTranslations('clubProfile');
  const tCommon = useTranslations('common');

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
    setPhone(data.phone || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await clubService.updateProfile({ name, description, city, county, leagueId, phone: phone || null });
      setEditing(false);
      await loadProfile();
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => { setEditing(false); setError(''); loadProfile(); };

  if (!profile) return <PageShell><Loading /></PageShell>;

  const facts = [
    { icon: MapPin, label: t('location'), value: [profile.city, profile.county].filter(Boolean).join(', ') || '—' },
    { icon: Trophy, label: t('league'), value: profile.leagueName || '—' },
    { icon: Phone, label: t('phone'), value: profile.phone || '—', href: profile.phone ? `tel:${profile.phone}` : undefined },
  ];

  return (
    <PageShell width="medium">
      <PageHeader
        leading={<Avatar name={profile.name} size="xl" tone="light" />}
        title={profile.name}
        subtitle={t('subtitle')}
        actions={!editing && <Button variant="secondary" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />{tCommon('edit')}</Button>}
      />

      {editing ? (
        <form onSubmit={handleSave}>
          <Card title={t('details')}>
            <div className="space-y-4">
              {error && <ErrorMessage message={error} />}
              <FormInput label={t('clubName')} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <div>
                <label className="field-label">{t('city')}</label>
                <CityAutocomplete value={city} county={county} onSelect={(c, co) => { setCity(c); setCounty(co); }} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormSelect label={t('league')} value={leagueId} onChange={(e) => setLeagueId(e.target.value)} required>
                  <option value="">{t('selectLeague')}</option>
                  <LeagueOptions leagues={leagues} />
                </FormSelect>
                <FormInput label={t('phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+385 91 123 4567" hint={t('phoneHint')} />
              </div>
              <FormTextarea label={t('description')} value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-ink-100 pt-5">
              <Button variant="secondary" onClick={cancelEdit}>{tCommon('cancel')}</Button>
              <Button type="submit" disabled={saving}>{saving ? tCommon('saving') : tCommon('saveChanges')}</Button>
            </div>
          </Card>
        </form>
      ) : (
        <Card title={t('details')}>
          <dl className="mb-6 grid gap-3 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="rounded-xl bg-ink-50 p-4">
                <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-ink-500"><Icon className="h-3.5 w-3.5" />{label}</dt>
                <dd className="text-sm font-semibold text-ink-900">
                  {href ? <a href={href} className="text-pitch-700 hover:underline">{value}</a> : value}
                </dd>
              </div>
            ))}
          </dl>
          <h4 className="eyebrow mb-2">{t('about')}</h4>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">{profile.description || '—'}</p>
        </Card>
      )}
    </PageShell>
  );
}
