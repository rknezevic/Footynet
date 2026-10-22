'use client';

import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';

export default function PendingApprovalPage() {
  const { logout } = useAuth();
  const t = useTranslations('pendingApproval');

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-ink-200/70 bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Clock className="h-7 w-7" />
        </div>
        <p className="mb-1 text-sm font-semibold text-pitch-700">{t('subtitle')}</p>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-ink-900">{t('title')}</h1>
        <p className="mb-8 text-sm leading-relaxed text-ink-600">{t('message')}</p>
        <Button onClick={logout} variant="secondary" className="w-full">{t('backToLogin')}</Button>
      </div>
    </AuthLayout>
  );
}
