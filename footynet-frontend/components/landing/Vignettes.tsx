'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Mail, Send, Shield, ShieldCheck, UserRound } from 'lucide-react';
import Avatar from '@/components/Avatar';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import { AvailabilityStatus } from '@/types';

// Illustrative product UI for the landing page. Everything here is example data:
// the visual is hidden from assistive tech and inert, and a one-sentence description is announced instead.

// Example clubs and players (proper names, the same in both languages)
export const EXAMPLE = {
  clubs: ['NK Example', 'HNK Primjer', 'NK Uzor'],
  players: ['Luka M.', 'Ivan K.', 'Marko P.'],
  winger: 'Ivana K.',
};

export function Illustration({ description, children, className = '' }: { description: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="sr-only">{description}</p>
      <div aria-hidden="true" inert className="pointer-events-none h-full select-none">
        {children}
      </div>
    </div>
  );
}

// Looks like a button inside an illustration, but is a plain element
function FakeButton({ children, tone = 'primary', className = '' }: { children: ReactNode; tone?: 'primary' | 'secondary'; className?: string }) {
  const cls = tone === 'primary' ? 'bg-pitch-700 text-white' : 'border border-ink-200 bg-white text-ink-700';
  return <span className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${cls} ${className}`}>{children}</span>;
}

function FakeField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium text-ink-500">{label}</div>
      <div className="break-words rounded-md border border-ink-200 bg-white px-2.5 py-1.5 text-xs leading-snug text-ink-900">{value}</div>
    </div>
  );
}

/* ---------- Hero ---------- */

export function HeroJobBoard() {
  const th = useTranslations('landing.hero');
  const rows = [
    { title: th('job1Title'), meta: th('job1Meta'), club: EXAMPLE.clubs[0] },
    { title: th('job2Title'), meta: th('job2Meta'), club: EXAMPLE.clubs[1] },
    { title: th('job3Title'), meta: th('job3Meta'), club: EXAMPLE.clubs[2] },
  ];
  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-lift sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-display text-sm font-semibold text-ink-900 sm:text-base">{th('boardTitle')}</span>
        <span className="h-2 w-2 rounded-full bg-pitch-600" />
      </div>
      <ul className="divide-y divide-ink-100">
        {rows.map((r, i) => (
          <li key={r.club} className="hero-fade flex items-center gap-3 py-2.5 sm:py-3" style={{ animationDelay: `${420 + i * 70}ms` }}>
            <Avatar name={r.club} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-snug text-ink-900">{r.title}<span className="font-normal text-ink-500"> · {r.club}</span></div>
              <div className="text-xs leading-snug text-ink-500">{r.meta}</div>
            </div>
            <span className="hidden rounded-full bg-pitch-50 px-2 py-0.5 text-[11px] font-medium text-pitch-800 sm:inline">{th('open')}</span>
            <FakeButton>{th('apply')}</FakeButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroApplicants() {
  const th = useTranslations('landing.hero');
  const rows = [
    { name: EXAMPLE.players[0], meta: th('app1Meta'), status: AvailabilityStatus.LookingForClub },
    { name: EXAMPLE.players[1], meta: th('app2Meta'), status: AvailabilityStatus.OpenToOffers },
    { name: EXAMPLE.players[2], meta: th('app3Meta'), status: AvailabilityStatus.LookingForClub },
  ];
  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-lift sm:p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="font-display text-sm font-semibold text-ink-900 sm:text-base">{th('applicantsTitle')}</span>
        <span className="text-xs text-ink-500">{th('applicantsFor')}</span>
      </div>
      <ul className="divide-y divide-ink-100">
        {rows.map(r => (
          <li key={r.name} className="flex items-center gap-3 py-2.5 sm:py-3">
            <Avatar name={r.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-snug text-ink-900">{r.name}</div>
              <div className="text-xs leading-snug text-ink-500">{r.meta}</div>
            </div>
            <span className="hidden md:inline"><AvailabilityBadge status={r.status} /></span>
            <FakeButton tone="secondary"><Send className="h-3 w-3" />{th('message')}</FakeButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Player steps ---------- */

export function PlayerProfileTile() {
  const tp = useTranslations('landing.players');
  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2.5">
        <Avatar name={EXAMPLE.players[0]} size="sm" />
        <span className="font-display text-sm font-semibold text-ink-900">{EXAMPLE.players[0]}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <FakeField label={tp('labelPosition')} value={tp('valuePosition')} />
        <FakeField label={tp('labelFoot')} value={tp('valueFoot')} />
      </div>
      <div className="mt-2 hidden sm:block lg:hidden xl:block">
        <div className="mb-1 text-[11px] font-medium text-ink-500">{tp('labelCareer')}</div>
        <ul className="space-y-1 text-xs text-ink-700">
          <li className="rounded-md bg-ink-50 px-2.5 py-1.5">{tp('season1')}</li>
          <li className="rounded-md bg-ink-50 px-2.5 py-1.5">{tp('season2')}</li>
        </ul>
      </div>
    </div>
  );
}

export function PlayerBrowseTile() {
  const th = useTranslations('landing.hero');
  const tp = useTranslations('landing.players');
  return (
    <div className="w-full space-y-2">
      {[
        { title: th('job1Title'), meta: th('job1Meta'), club: EXAMPLE.clubs[0], applied: true },
        { title: th('job2Title'), meta: th('job2Meta'), club: EXAMPLE.clubs[1], applied: false },
      ].map(j => (
        <div key={j.club} className="rounded-xl bg-white p-3 shadow-card">
          <div className="flex items-center gap-2.5">
            <Avatar name={j.club} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-snug text-ink-900">{j.title}</div>
              <div className="text-[11px] leading-snug text-ink-500">{j.meta}</div>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            {j.applied
              ? <span className="inline-flex items-center gap-1 rounded-md bg-pitch-50 px-3 py-1.5 text-xs font-semibold text-pitch-800"><Check className="h-3 w-3" />{tp('applied')}</span>
              : <FakeButton>{th('apply')}</FakeButton>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatThread({ compact = false }: { compact?: boolean }) {
  const tp = useTranslations('landing.players');
  return (
    <div className="w-full rounded-xl bg-white p-3 shadow-card">
      <div className="mb-2 flex items-center gap-2 border-b border-ink-100 pb-2">
        <Avatar name={EXAMPLE.clubs[0]} size="sm" />
        <span className="text-xs font-semibold text-ink-900">{EXAMPLE.clubs[0]}</span>
      </div>
      <div className="space-y-2">
        <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-ink-100 px-3 py-2 text-xs text-ink-800">{tp('chatClub')}</p>
        <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-pitch-700 px-3 py-2 text-xs text-white">{tp('chatPlayer')}</p>
      </div>
      {!compact && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-ink-200 px-2.5 py-1.5">
          <span className="flex-1 text-xs text-ink-400">{tp('writeMessage')}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-pitch-700 text-white"><Send className="h-3 w-3" /></span>
        </div>
      )}
    </div>
  );
}

/* ---------- Club steps ---------- */

export function ClubApprovalCard() {
  const tClubs = useTranslations('landing.clubs');
  const steps = [tClubs('progress1'), tClubs('progress2'), tClubs('progress3')];
  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lift">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pitch-50 text-pitch-800"><ShieldCheck className="h-5 w-5" /></span>
        <div className="min-w-0">
          <div className="text-[11px] text-ink-500">{tClubs('statusLabel')}</div>
          <div className="truncate text-sm font-semibold text-ink-900">{tClubs('statusValue')}</div>
        </div>
      </div>
      <ol className="mt-3 flex gap-1.5">
        {steps.map((s, i) => (
          <li key={s} className="min-w-0 flex-1">
            <div className={`h-1.5 rounded-full ${i < 2 ? 'bg-pitch-700' : 'bg-amber-400'}`} />
            <div className="mt-1 text-[11px] leading-tight text-ink-600">{s}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ClubPostCard() {
  const tClubs = useTranslations('landing.clubs');
  const tp = useTranslations('landing.players');
  const th = useTranslations('landing.hero');
  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lift">
      <div className="grid grid-cols-3 gap-2">
        <FakeField label={tp('labelPosition')} value={th('job1Title')} />
        <FakeField label={tClubs('labelLeague')} value={tClubs('valueLeague')} />
        <FakeField label={tp('labelCity')} value={tClubs('valueCity')} />
      </div>
      <div className="mt-3 flex justify-end"><FakeButton>{tClubs('publish')}</FakeButton></div>
    </div>
  );
}

export function ClubApplicantsCard() {
  const th = useTranslations('landing.hero');
  const rows = [
    { name: EXAMPLE.players[0], meta: th('app1Meta'), status: AvailabilityStatus.LookingForClub },
    { name: EXAMPLE.players[1], meta: th('app2Meta'), status: AvailabilityStatus.OpenToOffers },
    { name: EXAMPLE.players[2], meta: th('app3Meta'), status: AvailabilityStatus.NotAvailable },
  ];
  return (
    <div className="w-full max-w-sm rounded-xl bg-white px-4 py-2 shadow-lift">
      <ul className="divide-y divide-ink-100">
        {rows.map(r => (
          <li key={r.name} className="flex items-center gap-2.5 py-2">
            <Avatar name={r.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-ink-900">{r.name}</div>
              <div className="truncate text-[11px] text-ink-500">{r.meta}</div>
            </div>
            <span className="hidden sm:inline"><AvailabilityBadge status={r.status} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Product preview ---------- */

export function PreviewProfileCard() {
  const tPrev = useTranslations('landing.preview');
  const tp = useTranslations('landing.players');
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-lift">
      <div className="flex items-center gap-4">
        <Avatar name={EXAMPLE.players[0]} size="xl" />
        <div className="min-w-0">
          <div className="font-display text-xl font-semibold text-ink-900">{EXAMPLE.players[0]}</div>
          <div className="text-sm leading-snug text-ink-500">{tp('valuePosition')} · {tp('valueCity')}</div>
          <div className="mt-1.5"><AvailabilityBadge status={AvailabilityStatus.LookingForClub} /></div>
        </div>
      </div>
      <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-ink-500">{tp('labelCareer')}</div>
      <ul className="mt-2 space-y-1.5 text-sm text-ink-800">
        {[tPrev('career1'), tPrev('career2'), tPrev('career3')].map(c => (
          <li key={c} className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pitch-600" /><span className="leading-snug">{c}</span></li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Features ---------- */

export function CareerTimelineCard() {
  const tFeat = useTranslations('landing.features');
  const seasons = [tFeat('s1'), tFeat('s2'), tFeat('s3'), tFeat('s4')];
  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-5 shadow-lift">
      <div className="flex items-center gap-3">
        <Avatar name={EXAMPLE.winger} size="lg" />
        <div className="min-w-0">
          <div className="font-display text-lg font-semibold text-ink-900">{EXAMPLE.winger}</div>
          <div className="truncate text-sm text-ink-500">{tFeat('careerCardMeta')}</div>
        </div>
      </div>
      <div className="mt-3"><AvailabilityBadge status={AvailabilityStatus.OpenToOffers} /></div>
      <ol className="relative mt-5 space-y-4 border-l-2 border-pitch-300 pl-4">
        {seasons.map(s => (
          <li key={s} className="relative text-sm text-ink-800">
            <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-pitch-700" />
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function EmailPreviewRow() {
  const tFeat = useTranslations('landing.features');
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pitch-100 text-pitch-800"><Mail className="h-4 w-4" /></span>
      <span className="text-sm leading-snug text-ink-800">{tFeat('emailPreview')}</span>
    </div>
  );
}

/* ---------- Role split ---------- */

export function RoleChoicePanel() {
  const tRoles = useTranslations('landing.roles');
  const options = [
    { icon: UserRound, label: tRoles('choicePlayer'), hint: tRoles('choicePlayerHint'), selected: true },
    { icon: Shield, label: tRoles('choiceClub'), hint: tRoles('choiceClubHint'), selected: false },
  ];
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lift">
      <div className="mb-3 font-display text-base font-semibold text-ink-900">{tRoles('choiceTitle')}</div>
      <div className="grid grid-cols-2 gap-3">
        {options.map(o => (
          <div key={o.label} className={`relative rounded-xl border-2 p-3 ${o.selected ? 'role-choice-selected border-pitch-700 bg-pitch-50' : 'border-ink-200 bg-white'}`}>
            {o.selected && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pitch-700 text-white"><Check className="h-3 w-3" /></span>}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pitch-100 text-pitch-800"><o.icon className="h-4 w-4" /></span>
            <div className="mt-2 text-sm font-semibold text-ink-900">{o.label}</div>
            <div className="truncate text-xs text-ink-500">{o.hint}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-pitch-700 py-2.5 text-center text-sm font-semibold text-white">{tRoles('choiceContinue')}</div>
    </div>
  );
}
