'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useConfirm } from '@/components/ConfirmDialog';

// Bottom of the player and club profile pages; logs the user out once the account is deactivated
export default function DeactivateAccountCard({ onDeactivate }: { onDeactivate: () => Promise<void> }) {
  const t = useTranslations('deactivateAccount');
  const { logout } = useAuth();
  const { confirm, dialog } = useConfirm();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    if (!(await confirm({ title: t('confirmTitle'), message: t('confirmText'), confirmLabel: t('confirm') }))) return;
    setBusy(true);
    setError('');
    try {
      await onDeactivate();
      logout();
    } catch {
      setError(t('failed'));
      setBusy(false);
    }
  };

  return (
    <Card title={t('title')} className="mt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-relaxed text-ink-600">{t('text')}</p>
        <Button variant="danger" onClick={handleClick} disabled={busy} className="shrink-0">
          <UserX className="h-4 w-4" />{t('button')}
        </Button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {dialog}
    </Card>
  );
}
