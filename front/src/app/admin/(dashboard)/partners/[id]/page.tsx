'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { toast, toastError } from '@/lib/toast';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  ArrowLeft,
  Handshake,
  Download,
  Phone,
  Mail,
  Building2,
  Banknote,
  Car,
  Pencil,
  Check,
  X as XIcon,
} from 'lucide-react';

interface Tier {
  minDays: number;
  maxDays: number;
  percent: number;
}

interface Partner {
  id: number;
  fullName: string;
  companyName: string | null;
  edrpou: string | null;
  ipn: string | null;
  phone: string | null;
  email: string | null;
  iban: string | null;
  bankName: string | null;
  notes: string | null;
  isActive: boolean;
  commissionTiers: Tier[];
  cars: Array<{ id: number; brand: string; model: string; plateNumber: string; isAvailable: boolean }>;
}

interface ReportRow {
  rentalId: number;
  contractNumber: string;
  date: string;
  car: string;
  plateNumber: string;
  clientName: string;
  days: number;
  basePrice: number;
  discountPercent: number;
  priceAfterDiscount: number;
  commissionPercent: number;
  commissionAmount: number;
  currency: string;
}

interface Report {
  partner: { id: number; fullName: string; companyName: string | null };
  tiers: Tier[];
  period: { from: string; to: string };
  rows: ReportRow[];
  summary: {
    rentalsCount: number;
    totalBase: number;
    totalAfterDiscount: number;
    totalCommission: number;
    payoutToPartner: number;
  };
}

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
};

export default function PartnerDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';

  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState(monthStart());
  const [to, setTo] = useState(today());
  const [report, setReport] = useState<Report | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const [editTiers, setEditTiers] = useState(false);
  const [tiersDraft, setTiersDraft] = useState<Tier[]>([]);
  const [savingTiers, setSavingTiers] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadPartner = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApiClient.get(`/partner/${id}`);
      setPartner(res.data.partner);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadPartner(); }, [loadPartner]);

  const generateReport = async () => {
    setReportLoading(true);
    try {
      const res = await adminApiClient.get(`/partner/${id}/report?from=${from}&to=${to}`);
      setReport(res.data);
    } catch (err) {
      toastError(err, 'Не вдалося сформувати звіт');
    } finally {
      setReportLoading(false);
    }
  };

  const downloadXLSX = async () => {
    // Using window.fetch directly + inline UI status banner so we don't depend
    // on toast rendering — some dev environments (Turbopack HMR, theme quirks)
    // have been blanking the toast body.
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
    const url = `${apiBase}/partner/${id}/report-export?from=${from}&to=${to}`;
    const setStatus = (s: string) => {
      setDownloadStatus(s);
    };

    setDownloading(true);
    setStatus(`GET ${url}`);
    console.log('[xlsx download] GET', url);

    let res: Response;
    try {
      res = await window.fetch(url, { method: 'GET', credentials: 'include' });
    } catch (err: any) {
      const msg = err?.message || err?.name || String(err) || 'Unknown network error';
      console.error('[xlsx download] network error:', err);
      setStatus(`Мережева помилка: ${msg}`);
      setDownloading(false);
      return;
    }

    const ct = res.headers.get('content-type') || '(no content-type)';
    console.log('[xlsx download] status:', res.status, 'content-type:', ct);

    if (!res.ok) {
      let txt = '';
      try { txt = await res.text(); } catch { /* ignore */ }
      let detail = txt;
      try {
        const parsed = JSON.parse(txt);
        detail = parsed?.msg || parsed?.message || txt;
      } catch { /* not json */ }
      setStatus(`[${res.status} ${res.statusText}] ${detail || '(empty body)'}`);
      setDownloading(false);
      return;
    }

    let blob: Blob;
    try {
      blob = await res.blob();
    } catch (err: any) {
      setStatus(`Не вдалося прочитати відповідь: ${err?.message || String(err)}`);
      setDownloading(false);
      return;
    }

    console.log('[xlsx download] blob size:', blob.size, 'type:', blob.type);

    if (blob.size === 0) {
      setStatus(`Сервер повернув порожній файл (ct=${ct})`);
      setDownloading(false);
      return;
    }

    if (ct.includes('application/json')) {
      const txt = await blob.text();
      setStatus(`Сервер повернув JSON замість XLSX: ${txt.slice(0, 300)}`);
      setDownloading(false);
      return;
    }

    try {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `reiz-statement-${id}-${from}_${to}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      setStatus(`✓ XLSX завантажено (${blob.size} байт)`);
    } catch (err: any) {
      setStatus(`Помилка збереження файлу: ${err?.message || String(err)}`);
    } finally {
      setDownloading(false);
    }
  };

  const startEditTiers = () => {
    if (!partner) return;
    setTiersDraft(JSON.parse(JSON.stringify(partner.commissionTiers)));
    setEditTiers(true);
  };

  const saveTiers = async () => {
    setSavingTiers(true);
    try {
      await adminApiClient.patch(`/partner/${id}`, { commissionTiers: tiersDraft });
      setEditTiers(false);
      await loadPartner();
    } catch (err) {
      toastError(err, 'Не вдалося зберегти тарифи');
    } finally {
      setSavingTiers(false);
    }
  };

  const startEditNotes = () => {
    setNotesDraft(partner?.notes ?? '');
    setEditNotes(true);
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await adminApiClient.patch(`/partner/${id}`, { notes: notesDraft.trim() || null });
      setEditNotes(false);
      await loadPartner();
    } catch (err) {
      toastError(err, 'Не вдалося зберегти нотатки');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading || !partner) {
    return <div className="p-8 text-center text-muted-foreground">Завантаження…</div>;
  }

  const currency = report?.rows[0]?.currency || 'EUR';
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency === 'UAH' ? '₴' : currency;

  return (
    <div>
      {/* Header */}
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
      >
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/partners"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: isDark ? '#1E293B' : '#F7F9FB' }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-icon-box h-icon-box-cyan">
            <Handshake size={24} />
          </div>
          <div>
            <h1 className="h-title">{partner.companyName || partner.fullName}</h1>
            {partner.companyName && (
              <span className="h-subtitle">{partner.fullName}</span>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Main: Report */}
        <div className="space-y-4">
          <div className="ios-card">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Звіт за період
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadXLSX}
                  disabled={downloading || !report || report.rows.length === 0}
                  className="ios-btn ios-btn-success text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloading ? 'Завантажуємо…' : 'XLSX'}
                </button>
                {report && report.rows.length > 0 && (
                  <a
                    href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/, '')}/partner/${id}/report-export?from=${from}&to=${to}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-700 hover:underline"
                    title="Пряме посилання — відкриває URL у браузері напряму"
                  >
                    (пряме посилання)
                  </a>
                )}
              </div>
            </div>

            {downloadStatus && (
              <div
                className="mt-3 rounded-lg border-2 p-3 text-sm font-mono break-all relative"
                style={{
                  borderColor: downloadStatus.startsWith('✓') ? '#01B574' : '#EE5D50',
                  background: downloadStatus.startsWith('✓') ? 'rgba(1,181,116,0.1)' : 'rgba(238,93,80,0.1)',
                  color: downloadStatus.startsWith('✓') ? '#01B574' : '#C62828',
                }}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">
                  [xlsx-v3] Статус завантаження
                </div>
                <div className="font-semibold">{downloadStatus}</div>
                <button
                  type="button"
                  onClick={() => setDownloadStatus(null)}
                  className="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-end gap-3 flex-wrap">
              <div>
                <label className="block text-xs text-muted-foreground">Від</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="ios-input text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground">До</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="ios-input text-sm mt-1"
                />
              </div>
              <button
                type="button"
                onClick={generateReport}
                disabled={reportLoading}
                className="ios-btn ios-btn-primary text-sm"
              >
                {reportLoading ? 'Формуємо…' : 'Сформувати'}
              </button>
            </div>

            {report && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Оренд', val: report.summary.rentalsCount, color: '#9aa5ff' },
                  { label: 'Базова сума', val: `${symbol} ${report.summary.totalBase.toFixed(2)}`, color: '#90A4AE' },
                  { label: 'Після знижок', val: `${symbol} ${report.summary.totalAfterDiscount.toFixed(2)}`, color: '#90A4AE' },
                  { label: 'Комісія Reiz', val: `${symbol} ${report.summary.totalCommission.toFixed(2)}`, color: '#01B574' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="rounded-xl p-3" style={{ backgroundColor: isDark ? '#0F172A' : '#F7F9FB' }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{label}</p>
                    <p className="mt-1 text-base font-bold tabular-nums" style={{ color }}>{val}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Report table */}
          {report && report.rows.length > 0 && (
            <div className="ios-table-wrap">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8' }}>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Дата</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Авто</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Дні</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Базова</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Знижка</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Після знижки</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>Ставка</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#718096' : '#90A4AE' }}>До оплати</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((r) => (
                    <tr key={r.rentalId} style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid #F0F4F8' }}>
                      <td className="px-3 py-2 text-xs tabular-nums whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString('uk', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <Link href={`/admin/rentals/${r.rentalId}`} className="hover:underline">
                          {r.car}
                        </Link>
                        <div className="font-mono text-[10px] text-muted-foreground">{r.plateNumber}</div>
                      </td>
                      <td className="px-3 py-2 text-right text-xs tabular-nums">{r.days}</td>
                      <td className="px-3 py-2 text-right text-xs tabular-nums">{symbol} {r.basePrice.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-xs tabular-nums">{r.discountPercent}%</td>
                      <td className="px-3 py-2 text-right text-xs tabular-nums">{symbol} {r.priceAfterDiscount.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-xs tabular-nums font-semibold">{r.commissionPercent}%</td>
                      <td className="px-3 py-2 text-right text-xs tabular-nums font-bold" style={{ color: '#01B574' }}>{symbol} {r.commissionAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold" style={{ background: isDark ? '#0F172A' : '#FFF8E1' }}>
                    <td colSpan={7} className="px-3 py-2 text-right text-sm">Разом до оплати:</td>
                    <td className="px-3 py-2 text-right text-base tabular-nums" style={{ color: '#01B574' }}>
                      {symbol} {report.summary.totalCommission.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {report && report.rows.length === 0 && (
            <div className="ios-card text-center text-sm text-muted-foreground py-8">
              За цей період оренд для партнера не знайдено.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact */}
          <div className="ios-card">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Building2 className="h-3.5 w-3.5" />
              Контакт
            </div>

            {/* Company block at the top — primary info */}
            {partner.companyName && (
              <div className="mb-3 pb-3 border-b border-border/50">
                <p className="text-sm font-semibold text-foreground">{partner.companyName}</p>
                {partner.edrpou && (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    <span>ЄДРПОУ: </span>
                    <span className="font-mono tabular-nums text-foreground">{partner.edrpou}</span>
                  </p>
                )}
                {partner.ipn && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    <span>ІПН: </span>
                    <span className="font-mono tabular-nums text-foreground">{partner.ipn}</span>
                  </p>
                )}
              </div>
            )}

            {/* Aligned label/value rows */}
            <dl className="divide-y divide-border/40">
              {partner.phone && (
                <div className="flex items-center gap-3 py-2 first:pt-0">
                  <dt className="flex w-20 shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    Телефон
                  </dt>
                  <dd className="min-w-0 flex-1 text-right">
                    <a href={`tel:${partner.phone}`} className="text-sm font-medium text-foreground hover:text-primary hover:underline">
                      {partner.phone}
                    </a>
                  </dd>
                </div>
              )}

              {partner.email && (
                <div className="flex items-center gap-3 py-2">
                  <dt className="flex w-20 shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    Email
                  </dt>
                  <dd className="min-w-0 flex-1 text-right">
                    <a href={`mailto:${partner.email}`} className="truncate text-sm font-medium text-foreground hover:text-primary hover:underline">
                      {partner.email}
                    </a>
                  </dd>
                </div>
              )}

              {partner.iban && (
                <div className="flex items-start gap-3 py-2 last:pb-0">
                  <dt className="flex w-20 shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground pt-0.5">
                    <Banknote className="h-3 w-3" />
                    IBAN
                  </dt>
                  <dd className="min-w-0 flex-1 text-right">
                    <div className="font-mono text-[11px] tabular-nums text-foreground break-all">{partner.iban}</div>
                    {partner.bankName && (
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{partner.bankName}</div>
                    )}
                  </dd>
                </div>
              )}
            </dl>

            {/* If there's no companyName, fall back to fullName header at bottom */}
            {!partner.companyName && partner.fullName && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">ПІБ</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{partner.fullName}</p>
              </div>
            )}
          </div>

          {/* Commission tiers */}
          <div className="ios-card">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Тарифи комісії
              </div>
              {!editTiers ? (
                <button
                  type="button"
                  onClick={startEditTiers}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              ) : (
                <div className="flex gap-1">
                  <button type="button" onClick={saveTiers} disabled={savingTiers} className="text-green-600 hover:text-green-700">
                    <Check className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setEditTiers(false)} className="text-rose-500 hover:text-rose-700">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {!editTiers ? (
              <dl className="divide-y divide-border/40">
                {partner.commissionTiers.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 text-sm">
                    <dt className="text-muted-foreground tabular-nums">
                      {t.maxDays === 0 ? `≥ ${t.minDays} днів` : `${t.minDays}–${t.maxDays} днів`}
                    </dt>
                    <dd className="font-bold tabular-nums" style={{ color: '#01B574' }}>
                      {t.percent}%
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="space-y-2">
                {tiersDraft.map((t, i) => (
                  <div key={i} className="grid grid-cols-3 gap-1">
                    <input
                      type="number"
                      min="1"
                      value={t.minDays}
                      onChange={(e) => setTiersDraft((p) => p.map((x, idx) => idx === i ? { ...x, minDays: Number(e.target.value) } : x))}
                      className="ios-input text-xs tabular-nums"
                    />
                    <input
                      type="number"
                      min="0"
                      value={t.maxDays}
                      onChange={(e) => setTiersDraft((p) => p.map((x, idx) => idx === i ? { ...x, maxDays: Number(e.target.value) } : x))}
                      className="ios-input text-xs tabular-nums"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={t.percent}
                      onChange={(e) => setTiersDraft((p) => p.map((x, idx) => idx === i ? { ...x, percent: Number(e.target.value) } : x))}
                      className="ios-input text-xs tabular-nums"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cars */}
          <div className="ios-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Car className="h-3.5 w-3.5" />
                Авто партнера
              </div>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-foreground tabular-nums">
                {partner.cars.length}
              </span>
            </div>
            {partner.cars.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Жодного авто не призначено. Призначте у формі редагування авто.
              </p>
            ) : (
              <ul className="divide-y divide-border/40">
                {partner.cars.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/admin/cars/${c.id}`}
                      className="flex items-center justify-between gap-2 py-2 text-sm first:pt-0 last:pb-0 hover:text-primary"
                    >
                      <span className="min-w-0 truncate font-medium text-foreground">
                        {c.brand} {c.model}
                      </span>
                      <span className="shrink-0 inline-flex items-center rounded-md border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-foreground">
                        {c.plateNumber}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="ios-card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Нотатки
              </div>
              {!editNotes ? (
                <button
                  type="button"
                  onClick={startEditNotes}
                  className="text-muted-foreground hover:text-primary"
                  title="Редагувати нотатки"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              ) : (
                <div className="flex gap-1">
                  <button type="button" onClick={saveNotes} disabled={savingNotes} className="text-green-600 hover:text-green-700" title="Зберегти">
                    <Check className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setEditNotes(false)} className="text-rose-500 hover:text-rose-700" title="Скасувати">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {!editNotes ? (
              partner.notes ? (
                <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{partner.notes}</p>
              ) : (
                <p className="text-xs italic text-muted-foreground">
                  Нотаток ще немає. Натисніть ✎ щоб додати.
                </p>
              )
            ) : (
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={5}
                placeholder="Внутрішні нотатки про партнера…"
                autoFocus
                className="ios-textarea text-sm w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
