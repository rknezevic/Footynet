'use client';

import { useTranslations } from 'next-intl';
import { Check, Circle } from 'lucide-react';
import FormInput from '@/components/FormInput';
import { PASSWORD_RULES } from '@/lib/password';

interface PasswordFieldsProps {
  password: string;
  confirm: string;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  passwordLabel: string;
}

// New password + confirmation, with a live checklist of the password rules
export default function PasswordFields({ password, confirm, onPasswordChange, onConfirmChange, passwordLabel }: PasswordFieldsProps) {
  const t = useTranslations('passwordRules');
  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <div className="space-y-4">
      <div>
        <FormInput
          label={passwordLabel}
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          autoComplete="new-password"
          aria-describedby="password-rules"
          required
        />
        <ul id="password-rules" className="mt-2 grid gap-1 text-xs sm:grid-cols-3" aria-live="polite">
          {PASSWORD_RULES.map(rule => {
            const ok = rule.test(password);
            return (
              <li key={rule.key} className={`flex items-center gap-1.5 ${ok ? 'text-pitch-700' : 'text-ink-500'}`}>
                {ok ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Circle className="h-3 w-3" aria-hidden="true" />}
                <span>{t(rule.key)}</span>
                <span className="sr-only">{ok ? t('met') : t('notMet')}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <FormInput
          label={t('confirmLabel')}
          type="password"
          value={confirm}
          onChange={(e) => onConfirmChange(e.target.value)}
          autoComplete="new-password"
          aria-invalid={mismatch}
          required
        />
        {mismatch && <p className="mt-1 text-xs text-red-600" role="alert">{t('mismatch')}</p>}
      </div>
    </div>
  );
}
