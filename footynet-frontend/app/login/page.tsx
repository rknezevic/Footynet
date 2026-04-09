'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { RoleType } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      authService.saveAuth(response);
      refreshAuth();

      let redirectPath = '/player/dashboard';
      if (response.role === RoleType.Admin) {
        redirectPath = '/admin/dashboard';
      } else if (response.role === RoleType.Club) {
        redirectPath = response.isApproved === false ? '/pending-approval' : '/club/dashboard';
      }
      router.push(redirectPath);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 grid place-items-center">
      <div className="w-full max-w-md px-8">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">⚽ FootyNet</h1>
            <p className="text-sm text-neutral-500">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-6 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder-neutral-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder-neutral-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-2.5 text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            No account?{' '}
            <Link href="/register" className="text-neutral-900 font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
