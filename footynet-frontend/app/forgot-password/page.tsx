'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { KeyRound, MailCheck } from 'lucide-react';
import { authService } from '@/lib/auth';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import FormInput from '@/components/FormInput';

// Asks for the email and sends a reset link. The API answers the same whether or not the
// address has an account, so this page always shows "check your inbox".
export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || t('failed'));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="rounded-2xl border border-ink-200/70 bg-white p-8 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pitch-50 text-pitch-600">
            <MailCheck className="h-7 w-7" />
          </div>
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-ink-900">{t('sentTitle')}</h1>
          <p className="mb-4 break-all font-semibold text-ink-900">{email}</p>
          <p className="mb-8 text-sm leading-relaxed text-ink-600">{t('sentText')}</p>
          <Link href="/login"><Button variant="secondary" className="w-full">{t('backToLogin')}</Button></Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mb-8 mt-2 text-ink-500">{t('subtitle')}</p>

      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput label={t('email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          <KeyRound className="h-4 w-4" />
          {loading ? t('sending') : t('send')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-500">
        <Link href="/login" className="font-semibold text-pitch-700 hover:text-pitch-800 hover:underline">{t('backToLogin')}</Link>
      </p>
    </AuthLayout>
  );
}
