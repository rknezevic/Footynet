'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { authService } from '@/lib/auth';
import { isPasswordValid } from '@/lib/password';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import PasswordFields from '@/components/PasswordFields';

// Target of the link in the password reset email: /reset-password?token=...
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordView />
    </Suspense>
  );
}

function ResetPasswordView() {
  const t = useTranslations('resetPassword');
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isPasswordValid(password)) { setError(t('passwordInvalid')); return; }
    if (password !== confirm) { setError(t('passwordMismatch')); return; }
    setLoading(true);
    try {
      await authService.resetPassword({ token, password, confirmPassword: confirm });
      setDone(true);
    } catch (err: any) {
      setError(err?.message || t('failed'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout>
        <div className="rounded-2xl border border-ink-200/70 bg-white p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-pitch-500" />
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-ink-900">{t('successTitle')}</h1>
          <p className="mb-6 text-sm text-ink-600">{t('successText')}</p>
          <Link href="/login"><Button className="w-full">{t('signIn')}</Button></Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mb-8 mt-2 text-ink-500">{t('subtitle')}</p>

      {error && (
        <div className="mb-6 space-y-2">
          <ErrorMessage message={error} />
          <Link href="/forgot-password" className="inline-block text-sm font-semibold text-pitch-700 hover:underline">{t('requestNew')}</Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordFields
          password={password}
          confirm={confirm}
          onPasswordChange={setPassword}
          onConfirmChange={setConfirm}
          passwordLabel={t('newPassword')}
        />
        <Button type="submit" size="lg" className="w-full" disabled={loading || !token}>
          {loading ? t('saving') : t('save')}
        </Button>
      </form>
    </AuthLayout>
  );
}
