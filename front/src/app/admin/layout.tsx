import type { ReactNode } from 'react';
import { AdminLocaleProvider } from '@/context/AdminLocaleContext';
import { AdminThemeProvider } from '@/context/AdminThemeContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import './globals.css';

export const metadata = {
    title: 'REIZ Admin',
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AdminLocaleProvider>
            <AdminThemeProvider>
                <AdminAuthProvider>{children}</AdminAuthProvider>
            </AdminThemeProvider>
        </AdminLocaleProvider>
    );
}
