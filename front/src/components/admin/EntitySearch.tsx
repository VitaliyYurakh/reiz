'use client';

/**
 * EntitySearch — replaces raw `<input type="number">` ID fields across admin forms.
 *
 * Lets staff search by name/phone/contract number instead of memorising
 * primary keys. Hits the existing list endpoints with `?search=` debounced.
 *
 * Usage:
 *   <EntitySearch
 *     entity="client"
 *     value={clientId}
 *     onChange={setClientId}
 *     placeholder="— Оберіть клієнта —"
 *   />
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { Search, X, Loader2 } from 'lucide-react';

type EntityKind = 'client' | 'car' | 'rental' | 'reservation';

interface EntityOption {
  id: number;
  primary: string;   // main display text
  secondary?: string; // optional sub-text
}

interface EntitySearchProps {
  entity: EntityKind;
  value: string; // controlled — empty string when nothing chosen
  onChange: (newValue: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const ENDPOINTS: Record<EntityKind, string> = {
  client: '/client',
  car: '/car',
  rental: '/rental',
  reservation: '/reservation',
};

function mapToOption(entity: EntityKind, raw: any): EntityOption {
  switch (entity) {
    case 'client':
      return {
        id: raw.id,
        primary: `${raw.lastName ?? ''} ${raw.firstName ?? ''}`.trim() || `#${raw.id}`,
        secondary: [raw.phone, raw.email].filter(Boolean).join(' · '),
      };
    case 'car':
      return {
        id: raw.id,
        primary: `${raw.brand ?? ''} ${raw.model ?? ''}`.trim() || `#${raw.id}`,
        secondary: raw.plateNumber || (raw.yearOfManufacture ? String(raw.yearOfManufacture) : undefined),
      };
    case 'rental':
      return {
        id: raw.id,
        primary: raw.contractNumber || `Оренда #${raw.id}`,
        secondary: raw.client
          ? `${raw.client.firstName ?? ''} ${raw.client.lastName ?? ''}`.trim()
          : undefined,
      };
    case 'reservation':
      return {
        id: raw.id,
        primary: `Бронювання #${raw.id}`,
        secondary: raw.client
          ? `${raw.client.firstName ?? ''} ${raw.client.lastName ?? ''}`.trim()
          : undefined,
      };
  }
}

export function EntitySearch({
  entity,
  value,
  onChange,
  placeholder,
  required,
  className,
}: EntitySearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<EntityOption[]>([]);
  const [selected, setSelected] = useState<EntityOption | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolve the selected ID → label on first render and when `value` is set
  // externally (e.g. parent prefills it). If we already have it, skip.
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    if (selected && String(selected.id) === value) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await adminApiClient.get(`${ENDPOINTS[entity]}/${value}`);
        const raw = res.data[entity] || res.data;
        if (!cancelled && raw) setSelected(mapToOption(entity, raw));
      } catch (err) {
        logError(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value, entity]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click-outside closes the dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const runSearch = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: '20' });
        if (q.trim()) params.set('search', q.trim());
        const res = await adminApiClient.get(`${ENDPOINTS[entity]}?${params}`);
        const raw = res.data.items || res.data[entity + 's'] || res.data;
        const options = Array.isArray(raw) ? raw.map((r) => mapToOption(entity, r)) : [];
        setItems(options);
      } catch (err) {
        logError(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [entity],
  );

  // Debounced search-on-type
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open, runSearch]);

  const choose = (opt: EntityOption) => {
    setSelected(opt);
    onChange(String(opt.id));
    setOpen(false);
    setQuery('');
  };

  const clear = () => {
    setSelected(null);
    onChange('');
    setQuery('');
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      {selected ? (
        <div
          className="ios-input flex items-center justify-between gap-2 cursor-pointer"
          onClick={() => setOpen(true)}
          role="combobox"
          aria-expanded={open}
          tabIndex={0}
        >
          <div className="min-w-0">
            <div className="text-sm font-medium truncate text-foreground">{selected.primary}</div>
            {selected.secondary && (
              <div className="text-xs text-muted-foreground truncate">{selected.secondary}</div>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Очистити"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? '— Пошук —'}
            required={required && !selected}
            className="ios-input text-sm pl-9"
          />
          {loading && (
            <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {open && !selected && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {items.length === 0 && !loading && (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              {query.trim() ? 'Нічого не знайдено' : 'Почніть вводити для пошуку…'}
            </div>
          )}
          {items.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => choose(opt)}
              className="block w-full px-3 py-2 text-left transition-colors hover:bg-muted"
            >
              <div className="text-sm font-medium text-foreground">{opt.primary}</div>
              {opt.secondary && (
                <div className="text-xs text-muted-foreground">{opt.secondary}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
