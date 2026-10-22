'use client';

import { useTranslations } from 'next-intl';
import { StatusType } from '@/types';

// The API returns enum names in English (e.g. "Goalkeeper", "Open", "Player");
// this maps them to the current language and falls back to the raw value for unknown ones
export function useEnumLabels() {
  const t = useTranslations('enums');

  const label = (group: string, value: string | undefined | null) => {
    if (!value) return '';
    const key = `${group}.${value}`;
    return t.has(key) ? t(key) : value;
  };

  return {
    position: (name: string | undefined | null) => label('positions', name),
    status: (status: StatusType) => label('status', StatusType[status]),
    role: (name: string) => label('roles', name),
    adStatus: (name: string) => label('adStatus', name),
    foot: (name: 'Right' | 'Left') => label('foot', name),
  };
}
