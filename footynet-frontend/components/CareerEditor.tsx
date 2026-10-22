'use client';

import { useTranslations } from 'next-intl';
import { Plus, Trash2 } from 'lucide-react';
import { CareerEntry } from '@/types';

interface CareerEditorProps {
  value: CareerEntry[];
  onChange: (career: CareerEntry[]) => void;
}

const MAX_CLUBS = 20;
const currentYear = new Date().getFullYear();

const parseYear = (v: string) => (v === '' ? null : parseInt(v, 10));

// Editable list of clubs the player has played for; years are optional
export default function CareerEditor({ value, onChange }: CareerEditorProps) {
  const t = useTranslations('career');

  const update = (index: number, patch: Partial<CareerEntry>) =>
    onChange(value.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const add = () => onChange([...value, { clubName: '', fromYear: null, toYear: null }]);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="field-label mb-0">{t('title')}</span>
        <span className="text-xs text-ink-500">{t('yearsOptional')}</span>
      </div>

      <div className="space-y-2">
        {value.map((entry, i) => (
          <div key={i} className="grid grid-cols-[1fr_5.5rem_5.5rem_auto] items-center gap-2">
            <input
              className="field"
              value={entry.clubName}
              onChange={e => update(i, { clubName: e.target.value })}
              placeholder={t('clubPlaceholder')}
              maxLength={100}
              aria-label={t('club')}
              required
            />
            <input
              className="field"
              type="number"
              min={1950}
              max={currentYear}
              value={entry.fromYear ?? ''}
              onChange={e => update(i, { fromYear: parseYear(e.target.value) })}
              placeholder={t('from')}
              aria-label={t('from')}
            />
            <input
              className="field"
              type="number"
              min={1950}
              max={currentYear}
              value={entry.toYear ?? ''}
              onChange={e => update(i, { toYear: parseYear(e.target.value) })}
              placeholder={t('to')}
              aria-label={t('to')}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={t('remove')}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {value.length < MAX_CLUBS && (
        <button
          type="button"
          onClick={add}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-pitch-300 px-3 py-2 text-sm font-medium text-pitch-700 transition-colors hover:border-pitch-500 hover:bg-pitch-50"
        >
          <Plus className="h-4 w-4" />
          {t('add')}
        </button>
      )}
    </div>
  );
}
