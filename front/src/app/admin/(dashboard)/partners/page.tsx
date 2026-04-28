'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  Handshake,
  Plus,
  Search,
  Phone,
  Mail,
  Car,
} from 'lucide-react';

interface Partner {
  id: number;
  fullName: string;
  companyName: string | null;
  edrpou: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  _count: { cars: number };
}

export default function PartnersPage() {
  const router = useRouter();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';

  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (!showInactive) params.set('isActive', 'true');
      const res = await adminApiClient.get(`/partner?${params}`);
      setItems(res.data.items);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [search, showInactive]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      {/* Header */}
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)', boxShadow: H.shadow }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div className="h-icon-box h-icon-box-cyan">
              <Handshake size={24} />
            </div>
            <div>
              <h1 className="h-title">Партнери</h1>
              <span className="h-subtitle">Власники авто, які працюють з нами на комісії</span>
            </div>
          </div>
          <Link href="/admin/partners/new" className="ios-btn ios-btn-primary text-sm">
            <Plus className="h-4 w-4" /> Новий партнер
          </Link>
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: isDark ? '#718096' : '#90A4AE' }}
            />
            <input
              type="text"
              placeholder="Пошук за іменем, ЄДРПОУ, телефоном…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSearch(searchInput); }}
              className="h-9 w-[300px] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              style={{
                paddingLeft: 34,
                paddingRight: 12,
                backgroundColor: isDark ? '#1E293B' : 'var(--c-surface-muted)',
                border: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-border)',
                color: isDark ? '#E2E8F0' : '#263238',
              }}
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            Показати неактивних
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="ios-table-wrap" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-muted)' }}>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Партнер</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Компанія / ЄДРПОУ</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Контакти</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Авто</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-muted)' }}>
                  <td colSpan={5} className="px-4 py-4">
                    <div className="h-4 w-full animate-pulse rounded" style={{ background: isDark ? '#1E293B' : 'var(--c-surface-muted)' }} />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                  Партнерів не знайдено
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/admin/partners/${p.id}`)}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-muted)',
                    opacity: p.isActive ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#1E293B' : 'var(--c-surface-muted)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                    {p.fullName}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                    {p.companyName ? (
                      <>
                        <div>{p.companyName}</div>
                        {p.edrpou && <div className="font-mono text-[11px] mt-0.5">{p.edrpou}</div>}
                      </>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                    {p.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${p.phone}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                          {p.phone}
                        </a>
                      </div>
                    )}
                    {p.email && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3" />
                        <span>{p.email}</span>
                      </div>
                    )}
                    {!p.phone && !p.email && '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 dark:bg-cyan-500/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 tabular-nums">
                      <Car className="h-3 w-3" />
                      {p._count.cars}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-500/15 px-2 py-0.5 text-[11px] font-semibold text-green-800 dark:text-green-300">
                        Активний
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-500/15 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                        Неактивний
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
