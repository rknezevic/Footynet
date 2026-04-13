'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { locationService, LocationSuggestion } from '@/lib/location';

interface CityAutocompleteProps {
  value: string;
  county: string;
  onSelect: (city: string, county: string) => void;
  className?: string;
}

export default function CityAutocomplete({ value, county, onSelect, className }: CityAutocompleteProps) {
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
      } catch {
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

  const inputCls = className || "w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent";

  return (
    <div ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Start typing a city..."
          className={inputCls}
        />
        {open && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {loading && <li className="px-3 py-2 text-sm text-neutral-400">Searching...</li>}
            {suggestions.map((s) => (
              <li
                key={s.mapboxId}
                onClick={() => handleSelect(s)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50 text-neutral-900"
              >
                {s.name} <span className="text-neutral-400">· {s.region}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-2">
        <label className="block text-xs font-medium text-neutral-500 mb-1">County (auto-filled)</label>
        <input
          type="text"
          value={county}
          readOnly
          tabIndex={-1}
          className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm bg-neutral-50 text-neutral-600 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
