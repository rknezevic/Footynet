'use client';

import { useTranslations } from 'next-intl';
import { Footprints, History, MapPin, Shirt } from 'lucide-react';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { PlayerProfileDto, PreferredFootType } from '@/types';

// Read-only player details, shared by the player's own profile and the club's applicant view
export default function PlayerProfileDetails({ profile }: { profile: PlayerProfileDto }) {
  const t = useTranslations('playerDetails');
  const labels = useEnumLabels();

  const positions = [profile.primaryPosition, profile.secondaryPosition]
    .filter(p => p !== null && p !== undefined)
    .map(p => labels.position(p));

  const facts = [
    { icon: Shirt, label: t('positions'), value: positions.length ? positions.join(' · ') : '—' },
    { icon: Footprints, label: t('preferredFoot'), value: labels.foot(profile.prefeeredFootType === PreferredFootType.Left ? 'Left' : 'Right') },
    { icon: MapPin, label: t('location'), value: [profile.city, profile.county].filter(Boolean).join(', ') || '—' },
  ];

  return (
    <div className="space-y-6">
      <dl className="grid gap-3 sm:grid-cols-3">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-ink-50 p-4">
            <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-ink-500">
              <Icon className="h-3.5 w-3.5" />{label}
            </dt>
            <dd className="text-sm font-semibold text-ink-900">{value}</dd>
          </div>
        ))}
      </dl>

      {profile.description && (
        <div>
          <h4 className="eyebrow mb-2">{t('about')}</h4>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">{profile.description}</p>
        </div>
      )}

      <div>
        <h4 className="eyebrow mb-3 flex items-center gap-1.5"><History className="h-3.5 w-3.5" />{t('career')}</h4>
        {profile.career.length === 0 ? (
          <p className="text-sm text-ink-500">{t('noCareer')}</p>
        ) : (
          <ol className="relative space-y-3 border-l-2 border-pitch-100 pl-5">
            {profile.career.map((c, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-pitch-500 ring-4 ring-white" />
                <p className="text-sm font-semibold text-ink-900">{c.clubName}</p>
                {(c.fromYear || c.toYear) && (
                  <p className="text-xs text-ink-500">
                    {c.fromYear ?? '?'} – {c.toYear ?? (c.fromYear ? t('present') : '?')}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
