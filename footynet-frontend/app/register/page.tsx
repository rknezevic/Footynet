'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';
import { lookupService, League } from '@/lib/lookup';
import { RoleType, PreferredFootType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';
import CityAutocomplete from '@/components/CityAutocomplete';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleType | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { refreshAuth } = useAuth();

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

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.get('/Auth/check-email', { params: { email } });
      if (res.data.exists) {
        setError('An account with this email already exists.');
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
    try {
      const registerData = {
        email, password, role: role!,
        city, county, description,
        ...(role === RoleType.Player
          ? { firstName, lastName, age, prefeeredFootType: preferredFootType }
          : { name, leagueId })
      };
      const response = await authService.register(registerData);
      authService.saveAuth(response);
      refreshAuth();
      if (response.role === RoleType.Club) {
        router.push(response.isApproved === false ? '/pending-approval' : '/club/dashboard');
      } else {
        router.push('/player/jobs');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed';
      setError(msg);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent";

  return (
    <div className="min-h-screen bg-neutral-50 grid place-items-center py-12">
      <div className="w-full max-w-2xl px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">⚽ FootyNet</h1>
          <p className="text-sm text-neutral-500">Register · Step {step} of 2</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-6 text-sm text-red-700">{error}</div>}

        {step === 1 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-5">Choose Account Type</h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <button onClick={() => setRole(RoleType.Player)}
                className={`bg-white border-2 p-10 rounded-lg transition-all ${role === RoleType.Player ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'}`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">⚽</div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-1">Player</h3>
                  <p className="text-sm text-neutral-500">Find opportunities and apply to clubs</p>
                </div>
              </button>
              <button onClick={() => setRole(RoleType.Club)}
                className={`bg-white border-2 p-10 rounded-lg transition-all ${role === RoleType.Club ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'}`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-1">Club</h3>
                  <p className="text-sm text-neutral-500">Post jobs and recruit players</p>
                </div>
              </button>
            </div>
            {role !== null && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" className="w-full">Continue</Button>
              </form>
            )}
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            {role === RoleType.Player ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  <FormInput label="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <FormInput label="Age" type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} min={16} max={50} required />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                  <CityAutocomplete value={city} county={county} onSelect={(c, co) => { setCity(c); setCounty(co); }} className={inputClass} />
                </div>
                <FormSelect label="Preferred Foot" value={preferredFootType} onChange={(e) => setPreferredFootType(parseInt(e.target.value) as PreferredFootType)}>
                  <option value={PreferredFootType.Right}>Right</option>
                  <option value={PreferredFootType.Left}>Left</option>
                </FormSelect>
                <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </>
            ) : (
              <>
                <FormInput label="Club Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                  <CityAutocomplete value={city} county={county} onSelect={(c, co) => { setCity(c); setCounty(co); }} className={inputClass} />
                </div>
                <FormSelect label="League" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} required>
                  <option value="">Select League</option>
                  {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </FormSelect>
                <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell players about your club..." rows={3} />
              </>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="button" onClick={() => { setStep(1); setRole(null); }} variant="secondary" className="flex-1">Back</Button>
              <Button type="submit" className="flex-1">Register</Button>
            </div>
          </form>
        )}

        <div className="mt-10 pt-6 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">
            Have an account? <Link href="/login" className="font-medium text-neutral-900 hover:text-neutral-600 transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
