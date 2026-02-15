'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Locale } from '@/i18n/request';
import { uk, type AdminTranslations } from '@/i18n/admin/uk';
import { en } from '@/i18n/admin/en';
import { ru } from '@/i18n/admin/ru';
import { pl } from '@/i18n/admin/pl';
import { ro } from '@/i18n/admin/ro';

// When adding a new locale: add an import + entry below.
// TypeScript will error if any locale from request.ts is missing.
export type AdminLocale = Locale;

const dictionaries: Record<AdminLocale, AdminTranslations> = { uk, en, ru, pl, ro };

interface AdminLocaleContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const AdminLocaleContext = createContext<AdminLocaleContextType>(null!);

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('admin_locale') as AdminLocale) || 'uk';
    }
    return 'uk';
  });

  const setLocale = useCallback((l: AdminLocale) => {
    setLocaleState(l);
    localStorage.setItem('admin_locale', l);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = dictionaries[locale];
      const parts = key.split('.');
      let val: unknown = dict;
      for (const p of parts) {
        val = (val as Record<string, unknown>)?.[p];
      }
      if (typeof val !== 'string') return key;
      if (!params) return val;
      return val.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`,
      );
    },
    [locale],
  );

  return (
    <AdminLocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  return useContext(AdminLocaleContext);
}
