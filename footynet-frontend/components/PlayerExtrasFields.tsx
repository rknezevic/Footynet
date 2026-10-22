'use client';

import { useTranslations } from 'next-intl';
import FormSelect from '@/components/FormSelect';
import CareerEditor from '@/components/CareerEditor';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { AvailabilityStatus, CareerEntry, PositionType } from '@/types';

export interface PlayerExtras {
  primaryPosition: PositionType | null;
  secondaryPosition: PositionType | null;
  availability: AvailabilityStatus;
  career: CareerEntry[];
}

const POSITIONS = [PositionType.Goalkeeper, PositionType.Defender, PositionType.Midfielder, PositionType.Forward];
const AVAILABILITY = [AvailabilityStatus.LookingForClub, AvailabilityStatus.OpenToOffers, AvailabilityStatus.NotAvailable];

const parsePosition = (v: string) => (v === '' ? null : (parseInt(v, 10) as PositionType));

// Positions, availability and career; used on the profile page and in the post-registration step
export default function PlayerExtrasFields({ value, onChange }: { value: PlayerExtras; onChange: (v: PlayerExtras) => void }) {
  const t = useTranslations('playerExtras');
  const labels = useEnumLabels();
  const set = (patch: Partial<PlayerExtras>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect label={t('primaryPosition')} value={value.primaryPosition ?? ''} onChange={e => set({ primaryPosition: parsePosition(e.target.value) })}>
          <option value="">{t('notSet')}</option>
          {POSITIONS.map(p => <option key={p} value={p}>{labels.position(p)}</option>)}
        </FormSelect>
        <FormSelect label={t('secondaryPosition')} value={value.secondaryPosition ?? ''} onChange={e => set({ secondaryPosition: parsePosition(e.target.value) })}>
          <option value="">{t('notSet')}</option>
          {POSITIONS.filter(p => p !== value.primaryPosition).map(p => <option key={p} value={p}>{labels.position(p)}</option>)}
        </FormSelect>
      </div>

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
