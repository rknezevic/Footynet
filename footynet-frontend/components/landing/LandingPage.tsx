'use client';

import { KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowRight, ArrowUpRight, CalendarCheck, ChevronDown, ClipboardList, Languages, Mail, Menu, MessageCircle,
  Plus, Send, ShieldCheck, Smartphone, UserRound, Wallet, X,
} from 'lucide-react';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Avatar from '@/components/Avatar';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import { NAV_CONFIG } from '@/components/UnifiedNavBar';
import { useAuth } from '@/contexts/AuthContext';
import { locales, LOCALE_COOKIE } from '@/i18n/config';
import { AvailabilityStatus } from '@/types';
import { installReferenceReveals } from './reveal';
import {
  ChatThread, ClubApplicantsCard, ClubApprovalCard, ClubPostCard, CareerTimelineCard, EmailPreviewRow, EXAMPLE,
  HeroApplicants, HeroJobBoard, Illustration, PlayerBrowseTile, PlayerProfileTile, PreviewProfileCard, RoleChoicePanel,
} from './Vignettes';

const PITCH = 'bg-[#052E22]';
const NIGHT = 'bg-[#03140F]';

// Shared control styles (44px minimum hit area everywhere)
const btnPrimary =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-pitch-700 px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 fine-hover:bg-pitch-800 active:translate-y-px focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600 focus-visible:ring-offset-2';
const focusDark = 'focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03140F]';
// Link look without a display or height class, so callers never combine conflicting ones
// (e.g. "inline-flex" + "flex" or "min-h-11" + "min-h-9", where the CSS order, not the class order, wins)
const navLinkBase =
  'items-center text-[15px] text-ink-900 transition-colors duration-150 fine-hover:text-pitch-700 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600 rounded';
const navLink = `inline-flex min-h-11 ${navLinkBase}`;
// One link per line, for the stacked lists in the hero rail and the mobile menu
const navLinkStacked = `flex w-fit min-h-9 ${navLinkBase}`;

function useLocaleSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const change = (next: string) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh(); // keeps the current URL and #anchor
  };
  return { locale, change };
}

const LOCALE_NAMES: Record<string, string> = { hr: 'Hrvatski', en: 'English' };

function LocaleToggle({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { locale, change } = useLocaleSwitch();
  const active = tone === 'dark' ? 'text-white underline underline-offset-4' : 'text-ink-950 underline decoration-pitch-700 decoration-2 underline-offset-4';
  const idle = tone === 'dark' ? 'text-white/70 fine-hover:text-white' : 'text-ink-500 fine-hover:text-ink-900';
  return (
    <div className="flex flex-wrap gap-x-4">
      {locales.map(l => (
        <button
          key={l}
          type="button"
          onClick={() => change(l)}
          aria-pressed={l === locale}
          lang={l}
          className={`min-h-11 rounded text-[15px] transition-colors duration-150 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600 ${l === locale ? active : idle}`}
        >
          {LOCALE_NAMES[l]}
        </button>
      ))}
    </div>
  );
}

function ExampleTag({ className = '' }: { className?: string }) {
  const tc = useTranslations('landing.common');
  return <span className={`text-xs ${className}`}>{tc('exampleData')}</span>;
}

/* ---------- Navigation: mobile sheet + top bar ---------- */

function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tn = useTranslations('landing.nav');
  const tc = useTranslations('landing.common');
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.querySelector<HTMLElement>('button, a')?.focus();
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab' || !sheetRef.current) return;
    const items = [...sheetRef.current.querySelectorAll<HTMLElement>('a, button')];
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  if (!open) return null;
  const links = [
    { group: tn('groupPlayers'), items: [{ href: '#players', label: tn('forPlayers') }, { href: '#features', label: tn('features') }] },
    { group: tn('groupClubs'), items: [{ href: '#clubs', label: tn('forClubs') }, { href: '#faq', label: tn('faq') }] },
  ];
  return (
    <div ref={sheetRef} role="dialog" aria-modal="true" aria-label={tn('openMenu')} onKeyDown={onKeyDown} className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white px-6 pb-8">
      <div className="flex h-16 shrink-0 items-center justify-between">
        <Logo />
        <button type="button" onClick={onClose} aria-label={tn('closeMenu')} className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-ink-900 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="mt-6 space-y-8" aria-label={tn('home')}>
        {links.map(g => (
          <div key={g.group}>
            <div className="text-[15px] text-ink-500">{g.group}</div>
            {g.items.map(i => <a key={i.href} href={i.href} onClick={onClose} className={`${navLinkStacked} min-h-11 text-2xl font-display`}>{i.label}</a>)}
          </div>
        ))}
        <div>
          <div className="text-[15px] text-ink-500">{tn('language')}</div>
          <LocaleToggle />
        </div>
      </nav>
      <div className="mt-auto space-y-3 pt-10">
        <Link href="/login" className={`${navLink} w-full justify-center`}>{tc('signIn')}</Link>
        <Link href="/register" className={`${btnPrimary} w-full`}>{tc('register')}</Link>
      </div>
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const tn = useTranslations('landing.nav');
  const tc = useTranslations('landing.common');
  return (
    <div className="sticky top-0 z-40 border-b border-ink-200/80 bg-white/95 backdrop-blur">
      {/* Three columns so the section links sit in the true centre of the page */}
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 lg:px-10">
        <a href="#top" aria-label={tn('home')} className="justify-self-start rounded focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600"><Logo /></a>
        <nav className="hidden items-center gap-8 md:flex" aria-label={tn('home')}>
          <a href="#players" className={navLink}>{tn('forPlayers')}</a>
          <a href="#clubs" className={navLink}>{tn('forClubs')}</a>
          <a href="#features" className={navLink}>{tn('features')}</a>
          <a href="#faq" className={navLink}>{tn('faq')}</a>
        </nav>
        <div className="flex items-center justify-self-end gap-3">
          <div className="hidden lg:block"><LanguageSwitcher /></div>
          <Link href="/login" className={`${navLink} hidden px-2 sm:inline-flex`}>{tc('signIn')}</Link>
          {/* Hidden on the narrowest phones: the hero right below has a full-width register button */}
          <Link href="/register" className={`${btnPrimary} hidden min-h-11 whitespace-nowrap px-4 min-[400px]:inline-flex`}>{tc('register')}</Link>
          <button type="button" onClick={onMenu} aria-label={tn('openMenu')} className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-ink-900 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600 md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero: centred headline and actions, product frames below ---------- */

function Hero() {
  const th = useTranslations('landing.hero');
  const tc = useTranslations('landing.common');

  const frames = [
    { title: th('captionPlayersTitle'), meta: th('captionPlayersMeta'), description: th('boardDescription'), body: <HeroJobBoard />, pattern: true },
    { title: th('captionClubsTitle'), meta: th('captionClubsMeta'), description: th('applicantsDescription'), body: <HeroApplicants />, pattern: false },
  ];

  return (
    <header id="top" className="landing-anchor bg-white">
      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-14 lg:px-10 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="hero-in font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink-950 md:text-[56px] lg:text-[64px] text-balance">
            {th('title')}
          </h1>
          <p className="hero-in mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 md:text-xl" style={{ animationDelay: '80ms' }}>
            {th('heading')}
          </p>
          <div className="hero-in mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center" style={{ animationDelay: '160ms' }}>
            <Link href="/register" className={`${btnPrimary} min-h-12 px-7 text-base`}>{tc('register')}<ArrowRight className="h-4 w-4" /></Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-ink-300 bg-white px-7 text-base font-semibold text-ink-900 transition-colors duration-150 fine-hover:border-ink-400 fine-hover:bg-ink-50 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600 focus-visible:ring-offset-2"
            >
              {tc('signIn')}
            </Link>
          </div>
        </div>

        {/* Two product frames, side by side on large screens */}
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2">
          {frames.map((f, i) => (
            <figure key={f.title} className="hero-fade" style={{ animationDelay: `${240 + i * 120}ms` }}>
              <figcaption className="mb-4 text-center lg:text-left">
                <div className="font-display text-lg font-semibold text-ink-950">{f.title}</div>
                <div className="text-ink-500">{f.meta}</div>
              </figcaption>
              {/* No overflow-hidden: the 4:3 ratio is only a minimum, so a card with wrapped text grows the frame */}
              <div className={`relative flex items-center justify-center rounded-2xl px-6 pb-12 pt-8 sm:aspect-[4/3] ${PITCH} ${f.pattern ? 'pitch-pattern' : ''}`}>
                <Illustration description={f.description} className="w-full max-w-md">
                  {f.body}
                </Illustration>
                <ExampleTag className="absolute bottom-3 left-4 text-white/70" />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ---------- Players (meridian-04-services) ---------- */

function PlayersSteps() {
  const tp = useTranslations('landing.players');
  const steps = [
    { title: tp('step1Title'), body: tp('step1Body'), description: tp('tile1Description'), body2: <PlayerProfileTile />, pos: 'left-[7%] top-[7%] w-[74%]' },
    { title: tp('step2Title'), body: tp('step2Body'), description: tp('tile2Description'), body2: <PlayerBrowseTile />, pos: 'right-[7%] bottom-[7%] w-[74%]' },
    { title: tp('step3Title'), body: tp('step3Body'), description: tp('tile3Description'), body2: <ChatThread />, pos: 'left-[7%] bottom-[7%] w-[78%]' },
  ];
  return (
    <section id="players" aria-labelledby="players-title" className="landing-anchor bg-ink-50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <h2 id="players-title" data-reveal="rise" className="max-w-[18ch] font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] text-ink-950 md:text-[56px] lg:text-[clamp(56px,4.8vw,72px)]">
          {tp('heading')}
        </h2>
        <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {steps.map((s, i) => (
            <article key={s.title} data-reveal="rise" data-reveal-delay={i * 90} className={`group ${i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div className={`relative overflow-hidden rounded-lg bg-pitch-50 lg:rounded-none ${i === 2 ? 'aspect-[4/3] md:aspect-video lg:aspect-square' : 'aspect-[4/3] lg:aspect-square'}`}>
                <Illustration description={s.description} className={`absolute ${s.pos}`}>{s.body2}</Illustration>
                <Link
                  href="/register"
                  aria-label={`${tp('cta')}: ${s.title}`}
                  className="absolute right-4 top-4 hidden h-12 w-12 items-center justify-center rounded-full bg-[#052E22] text-white shadow-lift transition-transform duration-200 group-fine-hover:-translate-y-0.5 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600 focus-visible:ring-offset-2 md:flex"
                >
                  <ArrowUpRight className="h-6 w-6" />
                </Link>
              </div>
              <h3 className="mt-6 font-display text-[28px] font-semibold leading-tight tracking-tight text-ink-950 lg:text-[32px]">{s.title}</h3>
              <p className="mt-3 max-w-md text-base text-ink-600">{s.body}</p>
              <div className="mt-8 border-t border-ink-300" />
              {i === 0 && (
                <Link href="/register" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-pitch-700 underline-offset-4 fine-hover:underline md:hidden">
                  {tp('cta')}<ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/register" className="hidden min-h-11 items-center gap-1.5 font-semibold text-pitch-700 underline-offset-4 fine-hover:underline md:inline-flex">
            {tp('cta')}<ArrowRight className="h-4 w-4" />
          </Link>
          <ExampleTag className="text-ink-500" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Clubs (xodexdesign-03-projects) ---------- */

function ClubsSteps() {
  const tClubs = useTranslations('landing.clubs');
  const cards = [
    { title: tClubs('step1Title'), desc: tClubs('step1Desc'), description: tClubs('card1Description'), body: <ClubApprovalCard /> },
    { title: tClubs('step2Title'), desc: tClubs('step2Desc'), description: tClubs('card2Description'), body: <ClubPostCard /> },
    { title: tClubs('step3Title'), desc: tClubs('step3Desc'), description: tClubs('card3Description'), body: <ClubApplicantsCard /> },
    { title: tClubs('step4Title'), desc: tClubs('step4Desc'), description: tClubs('card4Description'), body: <div className="w-full max-w-sm"><ChatThread compact /></div> },
  ];
  return (
    <section id="clubs" aria-labelledby="clubs-title" className={`landing-anchor relative overflow-hidden ${NIGHT} py-20 text-white lg:py-28`}>
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <h2 id="clubs-title" className="sr-only">{tClubs('heading')}</h2>
        <div className="relative flex h-24 items-start justify-between lg:h-44">
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-0.12em] -translate-x-1/2 select-none whitespace-nowrap font-display text-[96px] font-bold leading-none text-white/[0.06] lg:text-[180px]">
            {tClubs('ghost')}
          </span>
          <span className="relative text-[13px] font-medium text-white/85">{tClubs('eyebrow')}</span>
          <span className="relative text-[13px] font-medium text-white/70">{tClubs('steps')}</span>
        </div>
        <div className="relative z-10 grid gap-4 md:grid-cols-2">
          {cards.map((c, i) => (
            <article
              key={c.title}
              data-reveal="rise"
              data-reveal-delay={(i % 2) * 80}
              className="group relative flex min-h-[440px] flex-col rounded-xl border border-white/10 bg-gradient-to-b from-[#064E3B] to-[#052E22] transition-[border-color] duration-200 fine-hover:border-white/25 md:min-h-[400px] lg:aspect-[139/100] lg:min-h-[auto]"
            >
              <div className="flex items-start justify-between gap-4 p-5 lg:p-6">
                <h3 className="font-display text-[30px] font-semibold leading-tight tracking-tight md:text-[32px] lg:text-[40px]">{c.title}</h3>
                <Link
                  href="/register?role=club"
                  aria-label={`${tClubs('cta')}: ${c.title}`}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-fine-hover:-translate-y-0.5 ${focusDark}`}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
              <Illustration description={c.description} className="flex flex-1 items-center justify-center px-5">
                <div className="flex h-full items-center justify-center">{c.body}</div>
              </Illustration>
              <div className="m-3.5 flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.12] px-4 py-3 text-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-white/90">{c.desc}</span>
                <span className="shrink-0 text-white/70">{tClubs('step', { n: i + 1 })}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex md:justify-end">
          <div className="max-w-sm">
            <p className="text-white/85">{tClubs('note')}</p>
            <Link href="/register?role=club" className={`mt-3 inline-flex min-h-11 items-center gap-1.5 rounded font-semibold text-pitch-300 underline underline-offset-4 ${focusDark}`}>
              {tClubs('cta')}<ArrowUpRight className="h-4 w-4" />
            </Link>
            <div><ExampleTag className="text-white/55" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Product preview (fabrica-10-case-study) ---------- */

function ProductPreview() {
  const tPrev = useTranslations('landing.preview');
  const tp = useTranslations('landing.players');
  const bars = [
    { day: tPrev('mon'), v: 1 }, { day: tPrev('tue'), v: 2 }, { day: tPrev('wed'), v: 1 },
    { day: tPrev('thu'), v: 3 }, { day: tPrev('fri'), v: 2 }, { day: tPrev('sat'), v: 6 },
  ];
  return (
    <section aria-labelledby="preview-title" className="bg-ink-100 py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <h2 id="preview-title" className="sr-only">{tPrev('heading')}</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:min-h-[clamp(480px,40vw,620px)] lg:grid-cols-[minmax(0,47fr)_minmax(0,22fr)_minmax(0,25fr)]">
          {/* Large dark card */}
          {/* No overflow-hidden, so md:aspect-video is a minimum height and the content is never clipped */}
          <div data-reveal="rise" className={`relative flex min-h-[560px] flex-col rounded-3xl ${PITCH} p-6 text-white md:col-span-2 md:min-h-[auto] md:aspect-video lg:col-span-1 lg:aspect-auto lg:p-8`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-lg font-medium">{tPrev('exampleProfile')}</div>
                <div className="text-sm text-white/70">{tPrev('profileMeta')}</div>
              </div>
              <Link href="/register?role=player" aria-label={tPrev('cta')} className={`-mr-2 -mt-2 flex h-11 w-11 items-center justify-center rounded-full ${focusDark}`}>
                <Plus className="h-6 w-6" />
              </Link>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-6 py-6 md:flex-row md:items-center">
              <div className="font-display text-[64px] font-bold leading-none tracking-[-0.03em] md:flex-1 md:text-[clamp(64px,6.4vw,104px)]" aria-hidden="true">FootyNet</div>
              <Illustration description={tPrev('profileDescription')} className="w-full md:w-[52%]">
                <PreviewProfileCard />
              </Illustration>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Link href="/register?role=player" className={`inline-flex min-h-11 items-center gap-1.5 rounded font-medium ${focusDark}`}>
                {tPrev('cta')}<ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="text-right">
                <div className="text-lg font-medium lg:text-xl">{tPrev('tagline')}</div>
                <ExampleTag className="text-white/60" />
              </div>
            </div>
          </div>

          {/* Job ad + chat */}
          <div data-reveal="slide" data-reveal-delay="80" className="flex min-h-[420px] flex-col rounded-3xl bg-white p-6 lg:min-h-0">
            <div className="text-sm text-ink-500">{tPrev('openJobAd')}</div>
            <div className="mt-2 font-display text-[30px] font-semibold leading-[1.1] tracking-tight text-ink-950 xl:text-[34px]">
              {tPrev('jobLine1')}<br />{tPrev('jobLine2')}
            </div>
            <div className="mt-6 text-sm text-ink-500">{tPrev('training')}</div>
            <div className="mt-1 font-display text-2xl font-semibold leading-tight text-ink-950 xl:text-[28px]">{tPrev('trainingValue')}</div>
            <div className="mt-auto flex items-start gap-3 pt-8">
              <Avatar name={EXAMPLE.clubs[0]} size="md" />
              <div className="min-w-0">
                <p className="text-[15px] text-ink-700">{tp('chatClub')}</p>
                <p className="mt-1 text-sm font-medium text-ink-950">{EXAMPLE.clubs[0]}</p>
              </div>
            </div>
          </div>

          {/* Availability + applicants */}
          <div className="flex flex-col gap-3">
            <div data-reveal="slide" data-reveal-delay="160" className="flex flex-[48] flex-col items-center justify-center rounded-3xl bg-white p-6 text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-pitch-700 bg-white">
                <Avatar name={EXAMPLE.players[0]} size="lg" />
              </div>
              <div className="mt-4"><AvailabilityBadge status={AvailabilityStatus.LookingForClub} /></div>
              <div className="mt-2 font-display text-lg font-semibold text-ink-950">{tPrev('availability')}</div>
              <p className="mt-1 max-w-[26ch] text-sm text-ink-500">{tPrev('availabilityBody')}</p>
            </div>
            <div className="flex flex-[52] flex-col rounded-3xl bg-white p-6">
              <div data-reveal="slide" data-reveal-delay="220" className="flex flex-wrap items-center gap-2">
                <span className="font-display text-xl font-semibold text-ink-950">{tPrev('applicants')}</span>
                <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">{tPrev('applicantsPill')}</span>
              </div>
              <div role="img" aria-label={tPrev('chartDescription')} className="mt-5 flex min-h-[150px] flex-1 items-end gap-2">
                {bars.map((b, i) => (
                  <div key={b.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <div
                      data-reveal="bars"
                      data-reveal-delay={300 + i * 40}
                      className={`bar-grow flex w-full items-start justify-center rounded-lg pt-1.5 text-xs font-semibold ${i === bars.length - 1 ? 'bg-pitch-700 text-white' : 'bg-ink-200 text-ink-700'}`}
                      style={{ height: `${(b.v / 6) * 100}%`, minHeight: '28px' }}
                    >
                      {b.v}
                    </div>
                    <span className="text-xs text-ink-500">{b.day}</span>
                  </div>
                ))}
              </div>
              <ExampleTag className="mt-3 text-ink-500" />
            </div>
          </div>
        </div>
        <p className="mt-5 text-sm text-ink-600">{tPrev('disclaimer')}</p>
      </div>
    </section>
  );
}

/* ---------- Features (fabrica-04-benefits) ---------- */

function Features() {
  const tFeat = useTranslations('landing.features');
  return (
    <section id="features" aria-labelledby="features-title" className="landing-anchor bg-ink-50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex items-center gap-2 text-[15px] font-medium text-ink-950 lg:col-span-3 lg:items-start lg:pt-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pitch-700 text-white"><Plus className="h-3.5 w-3.5" aria-hidden="true" /></span>
            {tFeat('eyebrow')}
          </div>
          <h2 id="features-title" className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink-950 md:text-[44px] lg:col-span-9 lg:text-[clamp(44px,3.8vw,56px)]">
            <span data-reveal="rise">{tFeat('headingStrong')}</span>{' '}
            <span data-reveal="rise" data-reveal-delay="150" className="ml-[0.15em] text-ink-500">{tFeat('headingMuted')}</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-[40fr_60fr] lg:mt-20 lg:grid-cols-[27fr_19fr_46fr] lg:gap-6">
          <div data-reveal="media" className={`flex aspect-[4/5] flex-col rounded-2xl ${PITCH} p-5 md:aspect-[3/5] md:self-start`}>
            <Illustration description={tFeat('careerCardDescription')} className="flex-1"><CareerTimelineCard /></Illustration>
            <ExampleTag className="mt-3 text-white/70" />
          </div>
          <div className="hidden lg:block" />
          <div>
            <p className="text-xl font-medium leading-snug text-ink-500 lg:text-[26px]">
              <strong className="font-semibold text-ink-950">{tFeat('leadStrong')}</strong> {tFeat('lead')}
            </p>
            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {[
                { title: tFeat('chatTitle'), body: tFeat('chatBody'), index: '01' },
                { title: tFeat('careerTitle'), body: tFeat('careerBody'), index: '02' },
              ].map((c, i) => (
                <div key={c.title} data-reveal="rise" data-reveal-delay={i * 70} className="rounded-2xl border border-ink-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-[32px] font-semibold leading-none tracking-tight text-ink-950 lg:text-[40px]">{c.title}</span>
                    <span className="text-xs text-ink-500">{c.index}</span>
                  </div>
                  <p className="mt-3 text-sm text-ink-600">{c.body}</p>
                </div>
              ))}
              <div data-reveal="rise" data-reveal-delay="140" className="flex min-h-[220px] flex-col rounded-2xl border border-ink-200 bg-white p-5 lg:min-h-[260px]">
                <div className="text-right">
                  <div className="text-lg font-medium text-ink-950">{tFeat('availabilityTitle')}</div>
                  <p className="text-sm text-ink-600">{tFeat('availabilityBody')}</p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <AvailabilityBadge status={AvailabilityStatus.LookingForClub} />
                  <AvailabilityBadge status={AvailabilityStatus.OpenToOffers} />
                  <AvailabilityBadge status={AvailabilityStatus.NotAvailable} />
                </div>
              </div>
              <div data-reveal="rise" data-reveal-delay="210" className="flex min-h-[220px] flex-col rounded-2xl border border-ink-200 bg-white p-5 lg:min-h-[260px]">
                <div className="text-right">
                  <div className="text-lg font-medium text-ink-950">{tFeat('emailTitle')}</div>
                  <p className="text-sm text-ink-600">{tFeat('emailBody')}</p>
                </div>
                <div className="mt-auto pt-6"><EmailPreviewRow /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Trust (ollef-04-values) ---------- */

function Trust() {
  const tTrust = useTranslations('landing.trust');
  const items = [
    { title: tTrust('item1Title'), body: tTrust('item1Body') },
    { title: tTrust('item2Title'), body: tTrust('item2Body') },
    { title: tTrust('item3Title'), body: tTrust('item3Body') },
  ];
  return (
    <section aria-labelledby="trust-title" className={`${PITCH} pitch-pattern-left py-20 text-white lg:py-28`}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid gap-10 border-t border-white/20 pt-12 lg:grid-cols-12 lg:gap-6 lg:pt-16">
          <h2 id="trust-title" className="text-xl font-medium lg:col-span-6">{tTrust('label')}</h2>
          <ul className="space-y-12 lg:col-span-4 lg:space-y-16">
            {items.map((item, i) => (
              <li key={item.title} data-reveal="rise" data-reveal-delay={i * 90}>
                <h3 className="font-display text-[26px] font-semibold leading-tight">{item.title}</h3>
                <p className="mt-3 max-w-[520px] text-lg text-white/70 lg:text-xl">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="lg:col-span-2 lg:text-right">
            <a href="#faq" className={`inline-flex min-h-11 items-center rounded text-lg underline underline-offset-4 ${focusDark}`}>{tTrust('faqLink')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Role split (cipher-security-02-about) ---------- */

function RoleSplit() {
  const tRoles = useTranslations('landing.roles');
  const choiceRef = useRef<HTMLDivElement>(null);

  // The selected border in the choice preview settles in once, when the panel is first seen
  useEffect(() => {
    const el = choiceRef.current;
    if (!el || typeof IntersectionObserver !== 'function') return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      el.dataset.revealedChoice = '';
      io.disconnect();
    }, { rootMargin: '0px 0px 96px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const strip = [
    { icon: UserRound, label: tRoles('strip1') }, { icon: ClipboardList, label: tRoles('strip2') }, { icon: Send, label: tRoles('strip3') },
    { icon: MessageCircle, label: tRoles('strip4') }, { icon: Mail, label: tRoles('strip5') }, { icon: ShieldCheck, label: tRoles('strip6') },
    { icon: Languages, label: tRoles('strip7') },
  ];
  const cards = [
    { title: tRoles('playersTitle'), body: tRoles('playersBody'), cta: tRoles('registerPlayer'), href: '/register?role=player', index: '01' },
    { title: tRoles('clubsTitle'), body: tRoles('clubsBody'), cta: tRoles('registerClub'), href: '/register?role=club', index: '02' },
  ];

  return (
    <section aria-labelledby="roles-title" className={`${NIGHT} py-20 text-white lg:py-28`}>
      <div className="mx-auto flex max-w-[1440px] flex-col px-6 lg:px-10">
        <div className="order-1 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_auto] lg:gap-12">
          <div>
            <p className="text-[13px] font-medium"><span className="text-pitch-300">/</span> {tRoles('eyebrow')}</p>
            <h2 id="roles-title" className="mt-5 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[52px] lg:text-[clamp(52px,4.4vw,64px)]">
              <span data-reveal="rise" className="block">{tRoles('headingA')}</span>{' '}
              <span data-reveal="rise" data-reveal-delay="70" className="block text-pitch-300">{tRoles('headingB')}</span>
            </h2>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
              <Link href="/register?role=player" className={`${btnPrimary} ring-1 ring-white focus-visible:ring-offset-[#03140F]`}>
                {tRoles('registerPlayer')}<ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register?role=club" className={`inline-flex min-h-12 items-center justify-center rounded-lg border border-white/80 px-5 text-sm font-semibold transition-colors duration-150 fine-hover:bg-white/10 ${focusDark}`}>
                {tRoles('registerClub')}
              </Link>
            </div>
          </div>
          <div ref={choiceRef} data-reveal="media" className="flex aspect-[5/4] items-center justify-center rounded-2xl bg-[#064E3B] p-[8%]">
            <Illustration description={tRoles('choiceDescription')} className="flex w-full justify-center"><RoleChoicePanel /></Illustration>
          </div>
          <div className="hidden text-xs leading-6 text-white/60 lg:block" aria-hidden="true">
            <div>{tRoles('side1')}</div><div>{tRoles('side2')}</div><div>{tRoles('side3')}</div>
            <div className="mt-2 h-0.5 w-6 bg-pitch-300" />
          </div>
        </div>

        <div className="order-3 mt-10 grid gap-4 md:grid-cols-2 lg:order-2 lg:mt-14">
          {cards.map((c, i) => (
            <article key={c.title} data-reveal="rise" data-reveal-delay={i * 90} className="flex flex-col rounded border border-pitch-300/30 p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-[30px] font-semibold leading-tight lg:text-[36px]"><span className="text-pitch-300">/</span> {c.title}</h3>
                <span className="text-sm text-white/50">{c.index}</span>
              </div>
              <p className="mt-5 text-lg text-white/75 lg:text-xl">{c.body}</p>
              <div className="mt-8 h-0.5 w-10 bg-pitch-300" />
              <Link href={c.href} className={`mt-4 inline-flex min-h-11 items-center gap-1.5 self-start rounded font-semibold text-pitch-300 underline underline-offset-4 ${focusDark}`}>
                {c.cta}<ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="order-2 mt-10 lg:order-3 lg:mt-12">
          <ul data-reveal="rise" className="grid grid-cols-3 border-y border-white/10 md:grid-cols-4 lg:grid-cols-7">
            {strip.map((s, i) => (
              <li key={s.label} className={`${i >= 3 ? 'hidden md:flex' : 'flex'} flex-col items-start gap-2 border-white/10 px-3 py-4 sm:flex-row sm:items-center sm:gap-3 ${i % 7 ? 'lg:border-l' : ''} ${i % 3 ? 'border-l md:border-l-0' : ''} ${i % 4 ? 'md:border-l lg:border-l-0' : ''}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-pitch-300/40 text-pitch-300"><s.icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="text-sm">{s.label}</span>
              </li>
            ))}
          </ul>
          <a href="#features" className={`mt-3 inline-flex min-h-11 items-center gap-1.5 rounded text-sm text-pitch-300 underline underline-offset-4 md:hidden ${focusDark}`}>
            {tRoles('moreFeatures')}<ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ (nubo-08-faq) ---------- */

function Faq() {
  const tFaq = useTranslations('landing.faq');
  const tc = useTranslations('landing.common');
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { q: tFaq('q1'), a: tFaq('a1'), icon: UserRound },
    { q: tFaq('q2'), a: tFaq('a2'), icon: ShieldCheck },
    { q: tFaq('q3'), a: tFaq('a3'), icon: Wallet },
    { q: tFaq('q4'), a: tFaq('a4'), icon: Languages },
    { q: tFaq('q5'), a: tFaq('a5'), icon: MessageCircle },
    { q: tFaq('q6'), a: tFaq('a6'), icon: CalendarCheck },
    { q: tFaq('q7'), a: tFaq('a7'), icon: Smartphone },
  ];
  return (
    <section id="faq" aria-labelledby="faq-title" className="landing-anchor bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 text-center lg:px-10">
        <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-pitch-800">{tFaq('eyebrow')}</p>
        <div className="mx-auto mt-4 h-px w-8 bg-pitch-700" />
        <h2 id="faq-title" className="mt-4 font-display text-[44px] font-medium leading-[1.05] tracking-tight text-ink-950 md:text-[56px] lg:text-[64px]">{tFaq('heading')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-600">{tFaq('intro')}</p>

        <ul className="mx-auto mt-10 max-w-[1080px] space-y-2 text-left md:w-[84%] lg:w-[72%]">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-reveal="rise" data-reveal-delay={i * 35} className="rounded-xl border border-ink-200 bg-white">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[72px] w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors duration-150 fine-hover:bg-ink-50 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-600 md:px-5"
                  >
                    <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-100 text-pitch-800 md:flex" aria-hidden="true"><item.icon className="h-5 w-5" /></span>
                    <span className="flex-1 font-display text-lg font-medium text-ink-950 md:text-2xl">{item.q}</span>
                    <Plus className={`hidden h-6 w-6 shrink-0 text-pitch-800 transition-transform duration-200 motion-reduce:transition-none md:block ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true" />
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-900 md:hidden" aria-hidden="true">
                      <ChevronDown className={`h-5 w-5 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-[240ms] ease-in-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="mx-4 border-t border-ink-200 pb-5 pt-4 text-ink-600 md:mx-0 md:border-0 md:pl-[84px] md:pr-16 md:pt-0">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-ink-300" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-600">{tFaq('still')}</span>
          <span className="h-px w-12 bg-ink-300" />
        </div>
        <Link href="/register" className={`${btnPrimary} mt-4 rounded-full px-7`}>{tc('register')}<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

/* ---------- Closing CTA (mitchy-11-cta) ---------- */

function ClosingCta() {
  const tClosing = useTranslations('landing.closing');
  const tc = useTranslations('landing.common');
  return (
    <section aria-labelledby="closing-title" className={`${PITCH} pitch-stripes px-6 py-24 text-center text-white lg:py-36`}>
      <h2 id="closing-title" className="mx-auto max-w-[1240px] font-display font-bold leading-[1.05] tracking-[-0.03em]">
        <span data-reveal="rise" className="block text-[44px] md:inline md:text-[56px] lg:text-[clamp(56px,5vw,80px)]">{tClosing('bright')}</span>{' '}
        <span data-reveal="rise" data-reveal-delay="120" className="mt-3 block text-[32px] text-white/50 md:ml-[0.2em] md:mt-0 md:inline md:text-[56px] lg:text-[clamp(56px,5vw,80px)]">{tClosing('muted')}</span>
      </h2>
      <div data-reveal="rise" data-reveal-delay="240" className="relative z-10 mt-10 lg:mt-12">
        <Link
          href="/register"
          className="inline-flex h-[72px] min-w-[240px] items-center justify-center gap-2 rounded-full border-2 border-white bg-pitch-700 px-10 text-xl font-semibold transition-[background-color,transform] duration-150 fine-hover:bg-pitch-800 active:translate-y-px focus:outline-none focus-visible:ring-[3px] focus-visible:ring-pitch-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#052E22]"
        >
          {tc('register')}
        </Link>
      </div>
    </section>
  );
}

/* ---------- Footer (obvia-13-footer) ---------- */

function Footer() {
  const tFooter = useTranslations('landing.footer');
  const tn = useTranslations('landing.nav');
  const tc = useTranslations('landing.common');
  const footLink = `inline-flex min-h-11 items-center rounded text-lg text-white/85 transition-colors duration-150 fine-hover:text-white ${focusDark}`;
  const label = 'text-[13px] font-medium uppercase tracking-[0.15em] text-white/50';
  return (
    <footer className="bg-[#020B08] pb-8 pt-20 text-white">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="font-display text-[28px] font-bold tracking-tight">Footy<span className="text-pitch-300">Net</span></div>
            <p className="mt-4 max-w-sm text-lg text-white/70 md:text-xl">{tFooter('description')}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5 lg:col-start-8">
            <nav aria-label={tFooter('explore')}>
              <div className={label}>{tFooter('explore')}</div>
              <ul className="mt-3">
                <li><a href="#players" className={footLink}>{tn('forPlayers')}</a></li>
                <li><a href="#clubs" className={footLink}>{tn('forClubs')}</a></li>
                <li><a href="#features" className={footLink}>{tn('features')}</a></li>
                <li><a href="#faq" className={footLink}>{tn('faq')}</a></li>
              </ul>
            </nav>
            <nav aria-label={tFooter('account')}>
              <div className={label}>{tFooter('account')}</div>
              <ul className="mt-3">
                <li><Link href="/register" className={footLink}>{tc('register')}</Link></li>
                <li><Link href="/login" className={footLink}>{tc('signIn')}</Link></li>
                <li><Link href="/privacy" className={footLink}>{tFooter('privacy')}</Link></li>
                <li><Link href="/terms" className={footLink}>{tFooter('terms')}</Link></li>
              </ul>
            </nav>
            <div>
              <div className={label}>{tFooter('language')}</div>
              <div className="mt-3"><LocaleToggle tone="dark" /></div>
            </div>
          </div>
        </div>

        {/* Monumental wordmark with the brand monogram in place of the reference badge */}
        <div className="mt-20 flex items-center gap-[2%] overflow-hidden lg:mt-32" aria-hidden="true">
          <span className="whitespace-nowrap font-display text-[clamp(48px,13.5vw,200px)] font-bold leading-[0.85] tracking-tight text-white/[0.12]">FOOTYNET</span>
          <span className="flex aspect-square h-[clamp(44px,11vw,180px)] shrink-0 items-center justify-center rounded-full bg-pitch-700 font-display text-[clamp(26px,6.5vw,110px)] font-bold leading-none">F</span>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-white/15 pt-4 text-[13px] uppercase tracking-[0.12em] text-white/60 md:flex-row md:items-center md:justify-between">
          <span className="py-3">{tFooter('copyright', { year: new Date().getFullYear() })}</span>
          <span className="py-3">Hrvatski · English</span>
          <a href="#top" className={`inline-flex min-h-11 items-center gap-1.5 rounded fine-hover:text-white ${focusDark}`}>{tFooter('backToTop')} <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

export default function LandingPage() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuOpener = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Signed-in visitors go straight to their dashboard
  useEffect(() => {
    if (isAuthenticated && role !== null) router.replace(NAV_CONFIG[role]?.[0]?.href ?? '/login');
  }, [isAuthenticated, role, router]);

  useEffect(() => (rootRef.current ? installReferenceReveals(rootRef.current) : undefined), []);

  const openMenu = useCallback(() => {
    menuOpener.current = document.activeElement as HTMLElement | null;
    setMenuOpen(true);
  }, []);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuOpener.current?.focus());
  }, []);

  return (
    <div ref={rootRef} className="bg-white">
      <TopBar onMenu={openMenu} />
      <MenuSheet open={menuOpen} onClose={closeMenu} />
      <Hero />
      <main>
        <PlayersSteps />
        <ClubsSteps />
        <ProductPreview />
        <Features />
        <Trust />
        <RoleSplit />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
