'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';
import LeagueOptions from '@/components/LeagueOptions';
import { lookupService, League } from '@/lib/lookup';
import { RoleType, PreferredFootType } from '@/types';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';
import CityAutocomplete from '@/components/CityAutocomplete';

export default function RegisterPage() {
  const t = useTranslations('register');
  const tEnums = useTranslations('enums');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleType | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Shared
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [description, setDescription] = useState('');

  // Player fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(18);
  const [preferredFootType, setPreferredFootType] = useState<PreferredFootType>(PreferredFootType.Right);

  // Club fields
  const [name, setName] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    lookupService.getLeagues().then(setLeagues);
  }, []);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.get('/Auth/check-email', { params: { email } });
      if (res.data.exists) {
        setError(t('emailExists'));
        return;
      }
      setStep(2);
    } catch {
      setStep(2);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const registerData = {
        email, password, role: role!,
        city, county, description,
        ...(role === RoleType.Player
          ? { firstName, lastName, age, prefeeredFootType: preferredFootType }
          : { name, leagueId })
      };
      await authService.register(registerData);
      // The account is usable only after the email is confirmed; the link in the email signs the
      // user in and continues to the complete-profile step (players) or pending approval (clubs)
      router.push(`/check-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err?.message || t('failed'));
      setSubmitting(false);
    }
  };

  const roleCard = (value: RoleType, emoji: string, title: string, desc: string) => {
    const selected = role === value;
    return (
      <button
        type="button"
        onClick={() => setRole(value)}
        className={`relative rounded-2xl border-2 bg-white p-6 text-left transition ${
          selected ? 'border-pitch-500 shadow-lift ring-4 ring-pitch-500/10' : 'border-ink-200 hover:border-ink-300 hover:shadow-card'
        }`}
        aria-pressed={selected}
      >
        {selected && (
          <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-pitch-600 text-white">
            <Check className="h-4 w-4" />
          </span>
        )}
        <div className="mb-3 text-4xl" aria-hidden="true">{emoji}</div>
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mt-1 text-sm text-ink-500">{desc}</p>
      </button>
    );
  };

  return (
    <AuthLayout wide>
      <p className="mb-2 text-sm font-semibold text-pitch-700">{t('step', { step })}</p>
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">{step === 1 ? t('chooseType') : t('details')}</h1>
      {/* Two-segment progress bar */}
      <div className="mb-8 mt-4 flex gap-2">
        {[1, 2].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-pitch-500' : 'bg-ink-200'}`} />)}
      </div>

      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      {step === 1 && (
        <div>
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {roleCard(RoleType.Player, '⚽', t('player'), t('playerDescription'))}
            {roleCard(RoleType.Club, '🏆', t('club'), t('clubDescription'))}
          </div>
          {role !== null && (
            <form onSubmit={handleStep1Submit} className="space-y-4 animate-fade-in-up">
              <FormInput label={t('email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              <FormInput label={t('password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={6} hint={t('passwordHint')} required />
              <Button type="submit" size="lg" className="w-full">{t('continue')}<ArrowRight className="h-4 w-4" /></Button>
            </form>
          )}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          {role === RoleType.Player ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label={t('firstName')} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <FormInput label={t('lastName')} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label={t('age')} type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} min={16} max={50} required />
                <FormSelect label={t('preferredFoot')} value={preferredFootType} onChange={(e) => setPreferredFootType(parseInt(e.target.value) as PreferredFootType)}>
                  <option value={PreferredFootType.Right}>{tEnums('foot.Right')}</option>
                  <option value={PreferredFootType.Left}>{tEnums('foot.Left')}</option>
                </FormSelect>
              </div>
              <div>
                <label className="field-label">{t('city')}</label>
                <CityAutocomplete value={city} county={county} onSelect={(c, co) => { setCity(c); setCounty(co); }} />
              </div>
              <FormTextarea label={t('description')} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('playerDescriptionPlaceholder')} rows={3} />
            </>
          ) : (
            <>
              <FormInput label={t('clubName')} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <div>
                <label className="field-label">{t('city')}</label>
                <CityAutocomplete value={city} county={county} onSelect={(c, co) => { setCity(c); setCounty(co); }} />
              </div>
              <FormSelect label={t('league')} value={leagueId} onChange={(e) => setLeagueId(e.target.value)} required>
                <option value="">{t('selectLeague')}</option>
                <LeagueOptions leagues={leagues} />
              </FormSelect>
              <FormTextarea label={t('description')} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('clubDescriptionPlaceholder')} rows={3} />
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={() => { setStep(1); setError(''); }} variant="secondary" size="lg" className="flex-1">
              <ArrowLeft className="h-4 w-4" />{t('back')}
            </Button>
            <Button type="submit" size="lg" className="flex-1" disabled={submitting}>{t('submit')}</Button>
          </div>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-ink-500">
        {t('haveAccount')} <Link href="/login" className="font-semibold text-pitch-700 hover:text-pitch-800 hover:underline">{t('login')}</Link>
      </p>
    </AuthLayout>
  );
}
