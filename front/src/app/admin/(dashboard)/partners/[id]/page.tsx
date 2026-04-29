'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Trash2,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { PartnerPaymentSection } from './PartnerPaymentSection';

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
  // UAH-equivalent of `commissionAmount`, frozen at the NBU rate from the
  // pickup day. `null` when fx fetch failed (offline + no cached rate).
  fxRateToUah: number | null;
  commissionAmountUah: number | null;
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
    totalCommissionUah: number | null;
    payoutToPartner: number;
  };
}

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
};

// Editable contact fields — mirrors the /new form (minus tiers/notes which
// have their own inline editors).
type ContactDraft = Pick<
  Partner,
  'fullName' | 'companyName' | 'edrpou' | 'ipn' | 'phone' | 'email' | 'iban' | 'bankName'
>;

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
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
  const [downloading, setDownloading] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Contact-card edit mode — added 2026-04-29 after a manager hit save on a
  // partner without a phone number and discovered there was no way to add it
  // back (the old detail page only exposed inline edit for tiers + notes).
  const [editContact, setEditContact] = useState(false);
  const [contactDraft, setContactDraft] = useState<ContactDraft | null>(null);
  const [savingContact, setSavingContact] = useState(false);

  // Delete state — same trigger ("the manager realized they don't need this
  // partner after all"). Confirm before destruction.
  const [deleting, setDeleting] = useState(false);

  // Set of rental IDs already covered by a PartnerPayment — used to render
  // a "✓ оплачено" badge on each row of the report. Updated by the
  // PartnerPaymentSection child via onChange.
  const [settledRentalIds, setSettledRentalIds] = useState<Set<number>>(new Set());

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

  const downloadReport = async (format: 'xlsx' | 'pdf') => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
    const path = format === 'pdf' ? 'report-export-pdf' : 'report-export';
    const url = `${apiBase}/partner/${id}/${path}?from=${from}&to=${to}`;

    setDownloading(true);

    let res: Response;
    try {
      res = await window.fetch(url, { method: 'GET', credentials: 'include' });
    } catch (err: any) {
      toastError(err, `Не вдалося завантажити ${format.toUpperCase()}`);
      setDownloading(false);
      return;
    }

    const ct = res.headers.get('content-type') || '';

    if (!res.ok) {
      let detail = '';
      try {
        const txt = await res.text();
        try {
          const parsed = JSON.parse(txt);
          detail = parsed?.msg || parsed?.message || txt;
        } catch { detail = txt; }
      } catch { /* ignore */ }
      toastError(new Error(detail || `${res.status} ${res.statusText}`), `Не вдалося завантажити ${format.toUpperCase()}`);
      setDownloading(false);
      return;
    }

    let blob: Blob;
    try {
      blob = await res.blob();
    } catch (err: any) {
      toastError(err, 'Не вдалося прочитати відповідь сервера');
      setDownloading(false);
      return;
    }

    if (blob.size === 0) {
      toastError(new Error('Сервер повернув порожній файл'), `Не вдалося завантажити ${format.toUpperCase()}`);
      setDownloading(false);
      return;
    }

    if (ct.includes('application/json')) {
      toastError(new Error(`Сервер повернув JSON замість ${format.toUpperCase()}`), 'Помилка експорту');
      setDownloading(false);
      return;
    }

    try {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `reiz-statement-${id}-${from}_${to}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      toast.success(`${format.toUpperCase()} завантажено`);
    } catch (err: any) {
      toastError(err, 'Помилка збереження файлу');
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

  const startEditContact = () => {
    if (!partner) return;
    setContactDraft({
      fullName: partner.fullName,
      companyName: partner.companyName,
      edrpou: partner.edrpou,
      ipn: partner.ipn,
      phone: partner.phone,
      email: partner.email,
      iban: partner.iban,
      bankName: partner.bankName,
    });
    setEditContact(true);
  };

  const saveContact = async () => {
    if (!contactDraft) return;
    if (!contactDraft.fullName.trim()) {
      toastError(new Error('ПІБ обов\'язкове'), 'ПІБ обов\'язкове');
      return;
    }
    setSavingContact(true);
    try {
      // Send empty strings as null so the back-end stores NULL rather than ''
      // (matters for the email validator and for clean reports).
      const body: Record<string, string | null> = {};
      (Object.keys(contactDraft) as Array<keyof ContactDraft>).forEach((k) => {
        const v = contactDraft[k];
        if (k === 'fullName') {
          body[k] = (v ?? '').trim();
        } else {
          const trimmed = (v ?? '').trim();
          body[k] = trimmed === '' ? null : trimmed;
        }
      });
      await adminApiClient.patch(`/partner/${id}`, body);
      setEditContact(false);
      await loadPartner();
    } catch (err) {
      toastError(err, 'Не вдалося зберегти контакт');
    } finally {
      setSavingContact(false);
    }
  };

  const handleDelete = async () => {
    if (!partner) return;
    const carsCount = partner.cars.length;
    const message = carsCount > 0
      ? `Партнер "${partner.companyName || partner.fullName}" має ${carsCount} авто. Він буде деактивований (історія оренд збережеться). Продовжити?`
      : `Видалити партнера "${partner.companyName || partner.fullName}"? Цю дію неможливо скасувати.`;
    if (!confirm(message)) return;
    setDeleting(true);
    try {
      await adminApiClient.delete(`/partner/${id}`);
      router.push('/admin/partners');
    } catch (err) {
      toastError(err, 'Не вдалося видалити партнера');
      setDeleting(false);
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
        style={{ backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)', boxShadow: H.shadow }}
      >
        <div className="flex items-center justify-between gap-3.5 flex-wrap">
          <div className="flex items-center gap-3.5 min-w-0">
            <Link
              href="/admin/partners"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: isDark ? '#1E293B' : 'var(--c-surface-muted)' }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-icon-box h-icon-box-cyan">
              <Handshake size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="h-title truncate">{partner.companyName || partner.fullName}</h1>
              {partner.companyName && (
                <span className="h-subtitle">{partner.fullName}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ios-btn ios-btn-destructive"
            title="Видалити партнера"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Видаляємо…' : 'Видалити'}
          </button>
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
                  onClick={() => downloadReport('xlsx')}
                  disabled={downloading || !report || report.rows.length === 0}
                  className="ios-btn ios-btn-success text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloading ? 'Завантажуємо…' : 'XLSX'}
                </button>
                <button
                  type="button"
                  onClick={() => downloadReport('pdf')}
                  disabled={downloading || !report || report.rows.length === 0}
                  className="ios-btn ios-btn-primary text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloading ? 'Завантажуємо…' : 'PDF'}
                </button>
              </div>
            </div>

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
                  { label: 'Оренд', val: String(report.summary.rentalsCount), color: 'var(--c-brand-light)' },
                  { label: 'Базова сума', val: `${symbol} ${report.summary.totalBase.toFixed(2)}`, color: '#90A4AE' },
                  { label: 'Після знижок', val: `${symbol} ${report.summary.totalAfterDiscount.toFixed(2)}`, color: '#90A4AE' },
                  { label: 'Комісія Reiz', val: `${symbol} ${report.summary.totalCommission.toFixed(2)}`, color: 'var(--c-success)' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="rounded-xl p-3" style={{ backgroundColor: isDark ? '#0F172A' : 'var(--c-surface-muted)' }}>
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
                  <tr style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-muted)' }}>
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
                    <tr key={r.rentalId} style={{ borderBottom: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-muted)' }}>
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
                      <td className="px-3 py-2 text-right text-xs tabular-nums font-bold" style={{ color: 'var(--c-success)' }}>
                        <div>{symbol} {r.commissionAmount.toFixed(2)}</div>
                        {r.commissionAmountUah != null ? (
                          <div className="text-[10px] font-medium text-muted-foreground tabular-nums" title={r.fxRateToUah ? `Курс НБУ ${r.fxRateToUah.toFixed(4)} грн / ${r.currency}` : undefined}>
                            ₴ {r.commissionAmountUah.toFixed(2)}
                          </div>
                        ) : (
                          <div className="text-[10px] text-muted-foreground" title="Не вдалось дістати курс НБУ">
                            ₴ —
                          </div>
                        )}
                        {settledRentalIds.has(r.rentalId) && (
                          <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: 'var(--c-success)' }} title="Включено в зафіксований платіж">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            оплачено
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold" style={{ background: isDark ? '#0F172A' : 'var(--c-warning-bg)' }}>
                    <td colSpan={7} className="px-3 py-2 text-right text-sm">Разом до оплати:</td>
                    <td className="px-3 py-2 text-right text-base tabular-nums" style={{ color: 'var(--c-success)' }}>
                      <div>{symbol} {report.summary.totalCommission.toFixed(2)}</div>
                      {report.summary.totalCommissionUah != null && (
                        <div className="text-xs font-semibold text-muted-foreground tabular-nums">
                          ₴ {report.summary.totalCommissionUah.toFixed(2)}
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] text-muted-foreground border-t border-border/30">
                <span aria-hidden="true">ⓘ</span>
                <span>Курс НБУ на день видачі</span>
              </div>
            </div>
          )}

          {report && report.rows.length === 0 && (
            <div className="ios-card text-center text-sm text-muted-foreground py-8">
              За цей період оренд для партнера не знайдено.
            </div>
          )}

          {/* Partner monthly settlement section — appears after the report
              card so the operator's eyes naturally flow Report → Pay. */}
          <PartnerPaymentSection
            partnerId={id}
            reportRows={report?.rows ?? []}
            period={{ from, to }}
            onChange={setSettledRentalIds}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact */}
          <div className="ios-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                Контакт
              </div>
              {!editContact ? (
                <button
                  type="button"
                  onClick={startEditContact}
                  className="text-muted-foreground hover:text-primary"
                  title="Редагувати контакт"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              ) : (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={saveContact}
                    disabled={savingContact}
                    className="text-green-600 hover:text-green-700"
                    title="Зберегти"
                  >
                    {savingContact ? <Save className="h-4 w-4 animate-pulse" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditContact(false); setContactDraft(null); }}
                    className="text-rose-500 hover:text-rose-700"
                    title="Скасувати"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {!editContact ? (
              <>
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
                {(partner.phone || partner.email || partner.iban) ? (
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
                ) : (
                  !partner.companyName && (
                    <p className="text-xs italic text-muted-foreground">
                      Контакт не заповнений. Натисніть ✎ щоб додати.
                    </p>
                  )
                )}

                {/* If there's no companyName, fall back to fullName header at bottom */}
                {!partner.companyName && partner.fullName && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">ПІБ</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{partner.fullName}</p>
                  </div>
                )}
              </>
            ) : contactDraft && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    ПІБ <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactDraft.fullName}
                    onChange={(e) => setContactDraft({ ...contactDraft, fullName: e.target.value })}
                    className="ios-input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Назва компанії
                  </label>
                  <input
                    type="text"
                    value={contactDraft.companyName ?? ''}
                    onChange={(e) => setContactDraft({ ...contactDraft, companyName: e.target.value })}
                    className="ios-input text-sm w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      ЄДРПОУ
                    </label>
                    <input
                      type="text"
                      value={contactDraft.edrpou ?? ''}
                      onChange={(e) => setContactDraft({ ...contactDraft, edrpou: e.target.value })}
                      className="ios-input text-sm w-full font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      ІПН
                    </label>
                    <input
                      type="text"
                      value={contactDraft.ipn ?? ''}
                      onChange={(e) => setContactDraft({ ...contactDraft, ipn: e.target.value })}
                      className="ios-input text-sm w-full font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={contactDraft.phone ?? ''}
                    onChange={(e) => setContactDraft({ ...contactDraft, phone: e.target.value })}
                    placeholder="+380…"
                    className="ios-input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactDraft.email ?? ''}
                    onChange={(e) => setContactDraft({ ...contactDraft, email: e.target.value })}
                    className="ios-input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    IBAN
                  </label>
                  <input
                    type="text"
                    value={contactDraft.iban ?? ''}
                    onChange={(e) => setContactDraft({ ...contactDraft, iban: e.target.value })}
                    className="ios-input text-sm w-full font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Банк
                  </label>
                  <input
                    type="text"
                    value={contactDraft.bankName ?? ''}
                    onChange={(e) => setContactDraft({ ...contactDraft, bankName: e.target.value })}
                    className="ios-input text-sm w-full"
                  />
                </div>
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
                    <dd className="font-bold tabular-nums" style={{ color: 'var(--c-success)' }}>
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

          {/* Cars — partner fleet */}
          <div className="ios-card !p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Car className="h-3 w-3" />
                Парк партнера
              </div>
              <span
                className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums"
                style={{ background: 'var(--c-brand-bg)', color: 'var(--c-brand-dark)' }}
              >
                {partner.cars.length}
              </span>
            </div>

            {partner.cars.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-1">
                Авто ще не призначено. Виберіть партнера у налаштуваннях авто.
              </p>
            ) : (
              // `flex flex-col` on the parent forces every child to occupy a
              // full row, regardless of the child's own `display`. Without
              // this the public-site reset `a { display: inline-flex }`
              // wins specificity-wise on Next.js <Link>, and the cars wrap
              // into two-per-row mush.
              <div className="flex flex-col gap-0.5">
                {partner.cars.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/cars/${c.id}`}
                    className="group rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--c-brand-bg)]"
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    {/* Status dot */}
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: c.isAvailable ? 'var(--c-success)' : 'var(--c-text-muted)' }}
                      title={c.isAvailable ? 'Доступне' : 'Не доступне'}
                    />
                    {/* Brand + model */}
                    <div className="min-w-0 flex-1 text-sm leading-tight">
                      <span className="font-semibold text-foreground">{c.brand}</span>
                      <span className="text-muted-foreground"> {c.model}</span>
                    </div>
                    {/* Plate */}
                    {c.plateNumber && c.plateNumber.trim() && (
                      <span
                        className="shrink-0 rounded font-mono text-[10px] font-bold tracking-wider px-1.5 py-0.5"
                        style={{
                          background: 'var(--c-surface-muted)',
                          color: 'var(--c-text)',
                          border: '1px solid var(--c-surface-border)',
                        }}
                      >
                        {c.plateNumber}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
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
