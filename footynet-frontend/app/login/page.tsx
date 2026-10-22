'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LogIn } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { RoleType } from '@/types';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import FormInput from '@/components/FormInput';

export default function LoginPage() {
  const t = useTranslations('login');
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
      setError(err?.message || t('failed'));
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mb-8 mt-2 text-ink-500">{t('subtitle')}</p>

      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput label={t('email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} autoComplete="email" required />
        <FormInput label={t('password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          <LogIn className="h-4 w-4" />
          {loading ? t('signingIn') : t('signIn')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-500">
        {t('noAccount')}{' '}
        <Link href="/register" className="font-semibold text-pitch-700 hover:text-pitch-800 hover:underline">{t('register')}</Link>
      </p>
    </AuthLayout>
  );
}
