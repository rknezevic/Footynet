'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { RoleType } from '@/types';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import Loading from '@/components/Loading';

// Target of the link in the confirmation email: /verify-email?token=...
export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailView />
    </Suspense>
  );
}

function VerifyEmailView() {
  const t = useTranslations('verifyEmail');
  const token = useSearchParams().get('token') ?? '';
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [state, setState] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  // The token works only once; React Strict Mode runs effects twice in development
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    authService.verifyEmail(token)
      .then(response => {
        authService.saveAuth(response);
        refreshAuth();
        setState('success');
        const next = response.role === RoleType.Player
          ? '/player/complete-profile'
          : response.isApproved === false ? '/pending-approval' : '/club/dashboard';
        setTimeout(() => router.push(next), 1500);
      })
      .catch((err: Error) => {
        setError(err.message);
        setState('error');
      });
  }, [token, router, refreshAuth]);

  if (state === 'verifying') return <AuthLayout><Loading /></AuthLayout>;

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-ink-200/70 bg-white p-8 text-center shadow-card">
        {state === 'success' ? (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-pitch-500" />
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-ink-900">{t('successTitle')}</h1>
            <p className="text-sm text-ink-600">{t('successText')}</p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-ink-900">{t('errorTitle')}</h1>
            <p className="mb-6 text-sm text-ink-600">{error}</p>
            <Link href="/login"><Button variant="secondary" className="w-full">{t('backToLogin')}</Button></Link>
            <p className="mt-4 text-xs text-ink-500">{t('errorHint')}</p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
