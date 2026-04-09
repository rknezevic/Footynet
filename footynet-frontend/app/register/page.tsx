'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { lookupService, County, League } from '@/lib/lookup';
import { RoleType, PreferredFootType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleType | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(18);
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [preferredFootType, setPreferredFootType] = useState<PreferredFootType>(PreferredFootType.Right);
  const [countyId, setCountyId] = useState('');

  // Club fields
  const [name, setName] = useState('');
  const [leagueId, setLeagueId] = useState('');

  // Lookups
  const [counties, setCounties] = useState<County[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [countiesData, leaguesData] = await Promise.all([
          lookupService.getCounties(),
          lookupService.getLeagues()
        ]);
        setCounties(countiesData);
        setLeagues(leaguesData);
      } catch (err) {
        console.error('Failed to load lookups:', err);
        setError('Failed to load form data. Please check your connection and try again.');
      }
    };
    loadLookups();
  }, []);

  const handleRoleSelect = (selectedRole: RoleType) => {
    setRole(selectedRole);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const registerData = {
        email,
        password,
        role: role!,
        ...(role === RoleType.Player ? {
          firstName, lastName, age, city, description, countyId,
          prefeeredFootType: preferredFootType
        } : {
          name, city, description, leagueId, countyId
        })
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
      const message = err?.message || 'Registration failed';
      if (message.toLowerCase().includes('already') || message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('exists')) {
        setError('An account with this email already exists. Please use a different email or log in.');
      } else {
        setError(message);
      }
    }
  };

  const inputClass = "w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent";

  return (
    <div className="min-h-screen bg-neutral-50 grid place-items-center py-12">
      <div className="w-full max-w-2xl px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">FootyNet</h1>
          <p className="text-sm text-neutral-500">Register · Step {step} of 2</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-6 text-sm text-red-700">{error}</div>}
        
        {step === 1 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-5">Choose Account Type</h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => handleRoleSelect(RoleType.Player)}
                className={`bg-white border-2 p-10 rounded-lg transition-all ${
                  role === RoleType.Player ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">⚽</div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-1">Player</h3>
                  <p className="text-sm text-neutral-500">Find opportunities and apply to clubs</p>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect(RoleType.Club)}
                className={`bg-white border-2 p-10 rounded-lg transition-all ${
                  role === RoleType.Club ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-1">Club</h3>
                  <p className="text-sm text-neutral-500">Post jobs and recruit players</p>
                </div>
              </button>
            </div>
            {role !== null && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
                </div>
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
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} min={16} max={50} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">County</label>
                  <select value={countyId} onChange={(e) => setCountyId(e.target.value)} required
                    className={`${inputClass} bg-white`}>
                    <option value="">Select County</option>
                    {counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Preferred Foot</label>
                  <select value={preferredFootType} onChange={(e) => setPreferredFootType(parseInt(e.target.value) as PreferredFootType)}
                    className={`${inputClass} bg-white`}>
                    <option value={PreferredFootType.Right}>Right</option>
                    <option value={PreferredFootType.Left}>Left</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    className={inputClass} rows={3} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Club Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">League</label>
                  <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)} required
                    className={`${inputClass} bg-white`}>
                    <option value="">Select League</option>
                    {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">County</label>
                  <select value={countyId} onChange={(e) => setCountyId(e.target.value)} required
                    className={`${inputClass} bg-white`}>
                    <option value="">Select County</option>
                    {counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell players about your club..."
                    className={inputClass} rows={3} />
                </div>
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
