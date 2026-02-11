'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

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

export const LIGHT: ThemeTokens = {
  navy: '#2B3674',
  navyDark: '#1B2559',
  gray: '#A3AED0',
  grayLight: '#E0E5F2',
  bg: '#F4F7FE',
  white: '#FFFFFF',
  purple: '#4318FF',
  purpleLight: '#868CFF',
  green: '#01B574',
  greenBg: '#E6FFF3',
  red: '#EE5D50',
  redBg: '#FFF0EF',
  orange: '#FFB547',
  orangeBg: '#FFF6E6',
  blue: '#3965FF',
  blueBg: '#EBF0FF',
  shadow: '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
  shadowMd: '0 4px 12px rgba(112, 144, 176, 0.12)',
  font: "'DM Sans', sans-serif",
};

export const DARK: ThemeTokens = {
  navy: '#E2E8F0',
  navyDark: '#CBD5E0',
  gray: '#718096',
  grayLight: '#2D3748',
  bg: '#111827',
  white: '#1A2332',
  purple: '#7C5CFF',
  purpleLight: '#A78BFA',
  green: '#48BB78',
  greenBg: '#1A3A2A',
  red: '#FC8181',
  redBg: '#3B1F1F',
  orange: '#F6AD55',
  orangeBg: '#3D2B13',
  blue: '#63B3ED',
  blueBg: '#1A2744',
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
  '--color-h-purple': '#7C5CFF',
  '--color-h-purple-light': '#A78BFA',
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
  '--color-primary': '#7C5CFF',
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
  '--color-ring': '#7C5CFF',
  '--color-sidebar-background': '#1A2332',
  '--color-sidebar-foreground': '#E2E8F0',
  '--color-sidebar-primary': '#7C5CFF',
  '--color-sidebar-primary-foreground': '#FFFFFF',
  '--color-sidebar-accent': '#1E293B',
  '--color-sidebar-accent-foreground': '#7C5CFF',
  '--color-sidebar-border': '#2D3748',
  '--color-sidebar-ring': '#7C5CFF',
  '--color-chart-blue': '#63B3ED',
  '--color-chart-green': '#48BB78',
  '--color-chart-red': '#FC8181',
  '--color-chart-orange': '#F6AD55',
  '--color-chart-purple': '#A78BFA',
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
