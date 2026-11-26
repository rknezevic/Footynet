'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { parseDateOnly } from '@/lib/birthDate';

// "24 godine" and, when the player entered a date of birth, "24 godine (15. ožujka 2002.)".
// Profiles created before the date of birth existed only have the age.
export function useAgeLabel() {
  const t = useTranslations('age');
  const format = useFormatter();

  const birthDate = (dateOfBirth?: string | null) =>
    dateOfBirth ? format.dateTime(parseDateOnly(dateOfBirth), { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return {
    years: (age: number) => t('years', { age }),
    birthDate,
    full: (age: number, dateOfBirth?: string | null) => {
      const date = birthDate(dateOfBirth);
      return date ? t('withBirthDate', { years: t('years', { age }), date }) : t('years', { age });
    },
  };
}
