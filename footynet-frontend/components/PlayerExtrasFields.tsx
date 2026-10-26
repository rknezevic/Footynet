'use client';

import { useTranslations } from 'next-intl';
import { Check, Star } from 'lucide-react';
import CareerEditor from '@/components/CareerEditor';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { AvailabilityStatus, CareerEntry, PositionType, POSITION_GROUPS, MAX_POSITIONS } from '@/types';

export interface PlayerExtras {
  // In the order the player picked them; the first one is the main position
  positions: PositionType[];
  availability: AvailabilityStatus;
  career: CareerEntry[];
}

const AVAILABILITY = [AvailabilityStatus.LookingForClub, AvailabilityStatus.OpenToOffers, AvailabilityStatus.NotAvailable];

// Positions, availability and career; used on the profile page and in the post-registration step
export default function PlayerExtrasFields({ value, onChange }: { value: PlayerExtras; onChange: (v: PlayerExtras) => void }) {
  const t = useTranslations('playerExtras');
  const labels = useEnumLabels();
  const set = (patch: Partial<PlayerExtras>) => onChange({ ...value, ...patch });

  const togglePosition = (p: PositionType) => {
    if (value.positions.includes(p)) set({ positions: value.positions.filter(x => x !== p) });
    else if (value.positions.length < MAX_POSITIONS) set({ positions: [...value.positions, p] });
  };
  const full = value.positions.length >= MAX_POSITIONS;

  return (
    <div className="space-y-5">
      <fieldset>
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <legend className="field-label mb-0">{t('positions')}</legend>
          <span className="text-xs text-ink-500">{t('positionsHint', { max: MAX_POSITIONS })}</span>
        </div>
        <div className="space-y-3 rounded-xl border border-ink-200 p-3">
          {POSITION_GROUPS.map(group => (
            <div key={group.key}>
              <div className="mb-1.5 text-xs font-medium text-ink-500">{t(`groups.${group.key}`)}</div>
              <div className="flex flex-wrap gap-2">
                {group.positions.map(p => {
                  const index = value.positions.indexOf(p);
                  const selected = index >= 0;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePosition(p)}
                      disabled={!selected && full}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        selected
                          ? 'border-pitch-600 bg-pitch-50 text-pitch-800'
                          : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300'
                      }`}
                    >
                      {selected && (index === 0
                        ? <Star className="h-3.5 w-3.5 fill-current" aria-label={t('main')} />
                        : <Check className="h-3.5 w-3.5" aria-hidden="true" />)}
                      {labels.position(p)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {value.positions.length > 0 && (
          <p className="mt-1.5 text-xs text-ink-500">
            {t('mainPosition', { position: labels.position(value.positions[0]) })}
          </p>
        )}
      </fieldset>

      <div>
        <span className="field-label">{t('availability')}</span>
        <div className="grid gap-2 sm:grid-cols-3">
          {AVAILABILITY.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => set({ availability: a })}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                value.availability === a
                  ? 'border-pitch-500 bg-pitch-50 text-pitch-800 ring-4 ring-pitch-500/10'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
              }`}
              aria-pressed={value.availability === a}
            >
              {labels.availability(a)}
            </button>
          ))}
        </div>
      </div>

      <CareerEditor value={value.career} onChange={career => set({ career })} />
    </div>
  );
}
