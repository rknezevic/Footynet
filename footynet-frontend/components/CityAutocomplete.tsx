'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { locationService, LocationSuggestion } from '@/lib/location';

interface CityAutocompleteProps {
  value: string;
  county: string;
  onSelect: (city: string, county: string) => void;
  className?: string;
}

export default function CityAutocomplete({ value, county, onSelect, className }: CityAutocompleteProps) {
  const t = useTranslations('city');
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 2) { setSuggestions([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await locationService.suggest(val);
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch (err) {
        console.error('City suggestions failed', err);
        setSuggestions([]);
      }
      setLoading(false);
    }, 300);
  };

  const handleSelect = async (s: LocationSuggestion) => {
    setQuery(s.name);
    setOpen(false);
    try {
      const detail = await locationService.retrieve(s.mapboxId);
      onSelect(detail.name, detail.region);
    } catch {
      onSelect(s.name, s.region || '');
    }
  };

  const inputCls = className || 'field';

  return (
    <div ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={t('placeholder')}
          className={inputCls}
        />
        {open && (
          <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-ink-200 bg-white py-1 shadow-lift">
            {loading && <li className="px-3.5 py-2 text-sm text-ink-400">{t('searching')}</li>}
            {suggestions.map((s) => (
              <li
                key={s.mapboxId}
                onClick={() => handleSelect(s)}
                className="cursor-pointer px-3.5 py-2 text-sm text-ink-900 hover:bg-pitch-50"
              >
                <span className="font-medium">{s.name}</span> <span className="text-ink-400">· {s.region}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-2">
        <label className="mb-1 block text-xs font-medium text-ink-500">{t('countyAutoFilled')}</label>
        <input
          type="text"
          value={county}
          readOnly
          tabIndex={-1}
          className="w-full cursor-not-allowed rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-2 text-sm text-ink-600"
        />
      </div>
    </div>
  );
}
