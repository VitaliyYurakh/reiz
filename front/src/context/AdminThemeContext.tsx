'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { ADMIN_COLORS } from '@/lib/admin/colors';

export type AdminTheme = 'light' | 'dark';

export interface ThemeTokens {
  navy: string;
  navyDark: string;
  gray: string;
  grayLight: string;
  bg: string;
  white: string;
  purple: string;
  purpleLight: string;
  green: string;
  greenBg: string;
  red: string;
  redBg: string;
  orange: string;
  orangeBg: string;
  blue: string;
  blueBg: string;
  shadow: string;
  shadowMd: string;
  font: string;
}

// LIGHT/DARK keep their old "Horizon" key names for backward compatibility
// with the dozens of admin pages that destructure `H.purple` / `H.green` /
// etc. The actual values now come from the canonical palette in
// `lib/admin/colors.ts` so changing a brand color in one place updates
// every consumer.
export const LIGHT: ThemeTokens = {
  navy: ADMIN_COLORS.text.primaryLight,
  navyDark: ADMIN_COLORS.text.deepNavy,
  gray: ADMIN_COLORS.text.secondaryLight,
  grayLight: ADMIN_COLORS.surface.borderLight,
  bg: ADMIN_COLORS.surface.bgLight,
  white: ADMIN_COLORS.surface.cardLight,
  purple: ADMIN_COLORS.brand.primary,
  purpleLight: ADMIN_COLORS.brand.light,
  green: ADMIN_COLORS.success.base,
  greenBg: ADMIN_COLORS.success.bgLight,
  red: ADMIN_COLORS.error.base,
  redBg: ADMIN_COLORS.error.bgLight,
  orange: ADMIN_COLORS.warning.base,
  orangeBg: ADMIN_COLORS.warning.bgLight,
  blue: ADMIN_COLORS.brand.primary,
  blueBg: ADMIN_COLORS.brand.bgLight,
  shadow: '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
  shadowMd: '0 4px 12px rgba(112, 144, 176, 0.12)',
  font: "'DM Sans', sans-serif",
};

export const DARK: ThemeTokens = {
  navy: ADMIN_COLORS.text.primaryDark,
  navyDark: '#CBD5E0',
  gray: ADMIN_COLORS.text.secondaryDark,
  grayLight: ADMIN_COLORS.surface.borderDark,
  bg: ADMIN_COLORS.surface.bgDark,
  white: ADMIN_COLORS.surface.cardDark,
  purple: ADMIN_COLORS.brand.primary,
  purpleLight: ADMIN_COLORS.brand.light,
  green: ADMIN_COLORS.success.dark,
  greenBg: ADMIN_COLORS.success.bgDark,
  red: ADMIN_COLORS.error.dark,
  redBg: ADMIN_COLORS.error.bgDark,
  orange: ADMIN_COLORS.warning.dark,
  orangeBg: ADMIN_COLORS.warning.bgDark,
  blue: ADMIN_COLORS.brand.light,
  blueBg: ADMIN_COLORS.brand.bgDark,
  shadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
  shadowMd: '0 4px 12px rgba(0, 0, 0, 0.5)',
  font: "'DM Sans', sans-serif",
};

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
  H: ThemeTokens;
  mounted: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType>(null!);

const DARK_CSS_VARS: Record<string, string> = {
  '--color-h-navy': '#E2E8F0',
  '--color-h-gray': '#718096',
  '--color-h-bg': '#111827',
  '--color-h-purple': '#6a7bff',
  '--color-h-purple-light': '#9aa5ff',
  '--color-h-green': '#48BB78',
  '--color-h-red': '#FC8181',
  '--color-h-orange': '#F6AD55',
  '--color-h-border': '#2D3748',
  '--shadow-h': '0 2px 8px rgba(0, 0, 0, 0.4)',
  '--shadow-h-md': '0 4px 12px rgba(0, 0, 0, 0.5)',
  '--color-background': '#111827',
  '--color-foreground': '#E2E8F0',
  '--color-card': '#1A2332',
  '--color-card-foreground': '#E2E8F0',
  '--color-popover': '#1A2332',
  '--color-popover-foreground': '#E2E8F0',
  '--color-primary': '#6a7bff',
  '--color-primary-foreground': '#FFFFFF',
  '--color-secondary': '#1E293B',
  '--color-secondary-foreground': '#A0AEC0',
  '--color-muted': '#2D3748',
  '--color-muted-foreground': '#718096',
  '--color-accent': '#1E293B',
  '--color-accent-foreground': '#E2E8F0',
  '--color-destructive': '#FC8181',
  '--color-destructive-foreground': '#FFFFFF',
  '--color-border': '#2D3748',
  '--color-input': '#2D3748',
  '--color-ring': '#6a7bff',
  '--color-sidebar-background': '#1A2332',
  '--color-sidebar-foreground': '#E2E8F0',
  '--color-sidebar-primary': '#6a7bff',
  '--color-sidebar-primary-foreground': '#FFFFFF',
  '--color-sidebar-accent': '#1E293B',
  '--color-sidebar-accent-foreground': '#6a7bff',
  '--color-sidebar-border': '#2D3748',
  '--color-sidebar-ring': '#6a7bff',
  '--color-chart-blue': '#9aa5ff',
  '--color-chart-green': '#48BB78',
  '--color-chart-red': '#FC8181',
  '--color-chart-orange': '#F6AD55',
  '--color-chart-purple': '#9aa5ff',
  '--color-chart-gray': '#2D3748',
};

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Apply saved theme after hydration to avoid SSR mismatch
  useEffect(() => {
    const saved = localStorage.getItem('admin_theme') as AdminTheme | null;
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    }
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('admin_theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      for (const [key, value] of Object.entries(DARK_CSS_VARS)) {
        el.style.setProperty(key, value);
      }
    } else {
      for (const key of Object.keys(DARK_CSS_VARS)) {
        el.style.removeProperty(key);
      }
    }
  }, [theme]);

  const H = theme === 'dark' ? DARK : LIGHT;

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, H, mounted }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
