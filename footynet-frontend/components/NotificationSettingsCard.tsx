'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
import { notificationService } from '@/lib/notifications';
import Card from '@/components/Card';

// Email notification preferences; shown on the player and club profile pages
export default function NotificationSettingsCard() {
  const t = useTranslations('notificationSettings');
  const [messageEmails, setMessageEmails] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    notificationService.get().then(s => setMessageEmails(s.messageEmails)).catch(() => setError(t('loadFailed')));
  }, [t]);

  const toggle = async () => {
    if (messageEmails === null) return;
    const next = !messageEmails;
    setSaving(true);
    setError('');
    setMessageEmails(next);
    try {
      await notificationService.update({ messageEmails: next });
    } catch {
      setMessageEmails(!next);
      setError(t('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title={t('title')} className="mt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pitch-50 text-pitch-700" aria-hidden="true">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <p id="message-emails-label" className="text-sm font-semibold text-ink-900">{t('messageEmails')}</p>
            <p className="mt-0.5 text-sm text-ink-500">{t('messageEmailsHint')}</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={messageEmails ?? false}
          aria-labelledby="message-emails-label"
          onClick={toggle}
          disabled={messageEmails === null || saving}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-pitch-500/30 disabled:opacity-50 ${
            messageEmails ? 'bg-pitch-600' : 'bg-ink-300'
          }`}
        >
          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${messageEmails ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </Card>
  );
}
