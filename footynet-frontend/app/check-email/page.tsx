'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MailCheck } from 'lucide-react';
import { authService } from '@/lib/auth';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';

const COOLDOWN_SECONDS = 60;

// Shown after registration (and from login when the email isn't confirmed yet)
export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailView />
    </Suspense>
  );
}

function CheckEmailView() {
  const t = useTranslations('checkEmail');
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  // Right after registration the email was just sent, so start with the cooldown the API enforces;
  // coming from login it may have been sent long ago, so allow resending immediately
  const [cooldown, setCooldown] = useState(searchParams.get('fromLogin') ? 0 : COOLDOWN_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const resend = async () => {
    await authService.resendVerification(email).catch(() => {});
    setResent(true);
    setCooldown(COOLDOWN_SECONDS);
  };

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-ink-200/70 bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pitch-50 text-pitch-600">
          <MailCheck className="h-7 w-7" />
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-ink-900">{t('title')}</h1>
        <p className="mb-1 text-sm text-ink-600">{t('sentTo')}</p>
        {email && <p className="mb-4 break-all font-semibold text-ink-900">{email}</p>}
        <p className="mb-8 text-sm leading-relaxed text-ink-600">{t('instructions')}</p>

        {resent && <p className="mb-4 rounded-lg bg-pitch-50 px-3 py-2 text-sm text-pitch-800">{t('resent')}</p>}
        {email && (
          <Button variant="secondary" className="w-full" onClick={resend} disabled={cooldown > 0}>
            {cooldown > 0 ? t('resendIn', { seconds: cooldown }) : t('resend')}
          </Button>
        )}
        <p className="mt-6 text-sm text-ink-500">
          {t('spamHint')}{' '}
          <Link href="/login" className="font-semibold text-pitch-700 hover:underline">{t('backToLogin')}</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
