/**
 * Partner monthly settlement UI — sits on `/admin/partners/[id]` and lets
 * the operator close the loop on the report:
 *   1. "Прийняти платіж" button opens a modal pre-filled with the current
 *      report period: rentals selectable as a checklist, EUR sum auto-summed
 *      from selection, UAH amount derived from NBU rate (overridable for
 *      rounding).
 *   2. Stats card shows year-to-date received vs expected, plus pending
 *      (unsettled) commission so the operator knows what's still to invoice.
 *   3. History table lists every accepted payment with its period, EUR/UAH
 *      sums, account, and a delete affordance.
 *   4. Each rental that's already in a payment shows ✓ оплачено DD.MM in
 *      the report table (handled in the parent page via `settledRentalIds`).
 */
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { toast, toastError } from '@/lib/toast';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { IosSelect } from '@/components/admin/IosSelect';
import { Banknote, Plus, Trash2, X as XIcon } from 'lucide-react';

interface ReportRow {
  rentalId: number;
  contractNumber: string;
  date: string;
  car: string;
  plateNumber: string;
  commissionAmount: number;
  commissionAmountUah: number | null;
  currency: string;
}

interface AccountOption {
  id: number;
  name: string;
  type: string;
  currency: string;
}

interface Payment {
  id: number;
  paidAt: string;
  periodFrom: string;
  periodTo: string;
  amountEurMinor: number;
  expectedUahMinor: number;
  receivedUahMinor: number;
  fxRate: number;
  status: string;
  notes: string | null;
  account: { id: number; name: string; currency: string };
  rentals: Array<{ rentalId: number; commissionEurMinor: number; rental: { id: number; contractNumber: string | null; pickupDate: string } }>;
  createdBy: { id: number; name: string; email: string } | null;
}

interface Stats {
  paymentsCount: number;
  receivedUahMinor: number;
  expectedUahMinor: number;
  varianceUahMinor: number;
  pendingEurMinor: number;
  pendingUahMinor: number;
  pendingRentalsCount: number;
}

interface Props {
  partnerId: number;
  // Report rows currently displayed on the page — used to prefill the modal
  // checklist when the operator clicks "Прийняти платіж".
  reportRows: ReportRow[];
  // Period from the report header.
  period: { from: string; to: string };
  // Called when a payment is created/deleted so the parent re-runs the report
  // (to render the ✓ оплачено badge on settled rentals).
  onChange: (settledRentalIds: Set<number>) => void;
}

const fmtMoney = (minor: number, ccy = 'UAH', symbol?: string) =>
  `${symbol ?? (ccy === 'UAH' ? '₴' : ccy === 'EUR' ? '€' : ccy === 'USD' ? '$' : ccy)} ${(minor / 100).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function PartnerPaymentSection({ partnerId, reportRows, period, onChange }: Props) {
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const settledIds = useMemo(() => {
    const set = new Set<number>();
    for (const p of payments) for (const r of p.rentals) set.add(r.rentalId);
    return set;
  }, [payments]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [list, st, accs] = await Promise.all([
        adminApiClient.get('/partner-payment', { params: { partnerId } }),
        adminApiClient.get('/partner-payment/stats', { params: { partnerId } }),
        adminApiClient.get('/finance/account'),
      ]);
      setPayments(list.data.items);
      setStats(st.data);
      setAccounts((accs.data.accounts ?? []).filter((a: AccountOption) => a.currency === 'UAH'));
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { onChange(settledIds); }, [settledIds, onChange]);

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити цей платіж і пов\'язану транзакцію?')) return;
    try {
      await adminApiClient.delete(`/partner-payment/${id}`);
      toast.success('Платіж видалено');
      await refresh();
    } catch (err) {
      toastError(err, 'Не вдалось видалити платіж');
    }
  };

  return (
    <>
      {/* ── Stats card ── */}
      {stats && (
        <div className="ios-card !p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Banknote className="h-3 w-3" />
              Розрахунки
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              disabled={reportRows.length === 0}
              className="ios-btn ios-btn-primary text-xs !h-8 !px-3"
              title={reportRows.length === 0 ? 'Спочатку сформуйте звіт' : 'Зафіксувати оплату'}
            >
              <Plus className="h-3.5 w-3.5" />
              Прийняти платіж
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <StatCell label="Платежів" val={String(stats.paymentsCount)} color="var(--c-brand-light)" isDark={isDark} />
            <StatCell
              label="Прийнято"
              val={fmtMoney(stats.receivedUahMinor, 'UAH')}
              color="var(--c-success)"
              isDark={isDark}
            />
            <StatCell
              label="Очікується"
              val={fmtMoney(stats.pendingUahMinor, 'UAH')}
              sub={stats.pendingRentalsCount > 0 ? `${stats.pendingRentalsCount} оренд` : undefined}
              color="var(--c-warning)"
              isDark={isDark}
            />
            <StatCell
              label={stats.varianceUahMinor < 0 ? 'Недоотримано' : stats.varianceUahMinor > 0 ? 'Переплата' : 'Розбіжність'}
              val={stats.varianceUahMinor === 0 ? '—' : fmtMoney(Math.abs(stats.varianceUahMinor), 'UAH')}
              color={stats.varianceUahMinor < 0 ? 'var(--c-error)' : stats.varianceUahMinor > 0 ? 'var(--c-success)' : '#90A4AE'}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* ── Payment history ── */}
      {payments.length > 0 && (
        <div className="ios-card">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Історія платежів
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid var(--c-surface-border)` }}>
                  <th className="px-2 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Дата</th>
                  <th className="px-2 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Період</th>
                  <th className="px-2 py-1.5 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Оренд</th>
                  <th className="px-2 py-1.5 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Нараховано €</th>
                  <th className="px-2 py-1.5 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Очікувано ₴</th>
                  <th className="px-2 py-1.5 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Отримано ₴</th>
                  <th className="px-2 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Рахунок</th>
                  <th className="px-2 py-1.5"></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const variance = p.receivedUahMinor - p.expectedUahMinor;
                  return (
                    <tr key={p.id} style={{ borderBottom: `1px solid var(--c-surface-muted)` }}>
                      <td className="px-2 py-1.5 text-xs tabular-nums">{new Date(p.paidAt).toLocaleDateString('uk', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                      <td className="px-2 py-1.5 text-xs text-muted-foreground tabular-nums">{p.periodFrom.slice(0, 10)} — {p.periodTo.slice(0, 10)}</td>
                      <td className="px-2 py-1.5 text-xs text-right tabular-nums">{p.rentals.length}</td>
                      <td className="px-2 py-1.5 text-xs text-right tabular-nums">€ {(p.amountEurMinor / 100).toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-xs text-right tabular-nums text-muted-foreground">₴ {(p.expectedUahMinor / 100).toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-xs text-right tabular-nums font-bold" style={{ color: 'var(--c-success)' }}>
                        ₴ {(p.receivedUahMinor / 100).toFixed(2)}
                        {variance !== 0 && (
                          <div className="text-[10px] font-medium" style={{ color: variance < 0 ? 'var(--c-error)' : 'var(--c-warning)' }}>
                            {variance > 0 ? '+' : ''}{(variance / 100).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-xs text-muted-foreground">{p.account.name}</td>
                      <td className="px-2 py-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="text-muted-foreground hover:text-red-500"
                          title="Видалити платіж"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <PaymentModal
          partnerId={partnerId}
          accounts={accounts}
          period={period}
          rentals={reportRows.filter((r) => !settledIds.has(r.rentalId))}
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            setShowModal(false);
            toast.success('Платіж зафіксовано');
            await refresh();
          }}
        />
      )}
    </>
  );
}

function StatCell({ label, val, sub, color, isDark }: { label: string; val: string; sub?: string; color: string; isDark?: boolean }) {
  return (
    <div className="rounded-lg px-2.5 py-1.5" style={{ backgroundColor: isDark ? '#0F172A' : 'var(--c-surface-muted)' }}>
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground leading-tight">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums leading-tight" style={{ color }}>{val}</p>
      {sub && <p className="text-[10px] text-muted-foreground tabular-nums leading-tight">{sub}</p>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Modal
// ──────────────────────────────────────────────────────────────────────────

function PaymentModal({
  partnerId,
  accounts,
  period,
  rentals,
  onClose,
  onSuccess,
}: {
  partnerId: number;
  accounts: AccountOption[];
  period: { from: string; to: string };
  rentals: ReportRow[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { H } = useAdminTheme();
  const today = new Date().toISOString().slice(0, 10);

  const [paidAt, setPaidAt] = useState(today);
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id ? String(accounts[0].id) : '');
  // Default = all unsettled rentals selected.
  const [selected, setSelected] = useState<Set<number>>(new Set(rentals.map((r) => r.rentalId)));
  const [fxRate, setFxRate] = useState<string>(''); // empty = let server use NBU
  const [receivedOverride, setReceivedOverride] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedRows = rentals.filter((r) => selected.has(r.rentalId));
  const totalEur = selectedRows.reduce((s, r) => s + r.commissionAmount, 0);
  // Best-guess UAH preview based on the per-row UAH that came back from the
  // report. Server will recompute server-side for storage.
  const totalUahPreview = selectedRows.reduce((s, r) => s + (r.commissionAmountUah ?? 0), 0);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0) {
      toast.error('Оберіть хоча б одну оренду');
      return;
    }
    if (!accountId) {
      toast.error('Оберіть рахунок');
      return;
    }
    const receivedNum = receivedOverride.trim()
      ? Math.round(parseFloat(receivedOverride) * 100)
      : Math.round(totalUahPreview * 100);
    if (!Number.isFinite(receivedNum) || receivedNum <= 0) {
      toast.error('Сума має бути додатна');
      return;
    }
    setSubmitting(true);
    try {
      await adminApiClient.post('/partner-payment', {
        partnerId,
        accountId: Number(accountId),
        periodFrom: period.from,
        periodTo: period.to,
        paidAt,
        receivedUahMinor: receivedNum,
        fxRate: fxRate.trim() ? Number(fxRate) : undefined,
        rentalIds: Array.from(selected),
        notes: notes.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      toastError(err, 'Не вдалось зафіксувати платіж');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-card shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
        style={{ background: H.white, fontFamily: H.font }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Прийняти платіж від партнера</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Period (display only — comes from report header) */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Період звіту">
              <div className="text-sm font-medium tabular-nums">{period.from} — {period.to}</div>
            </Field>
            <Field label="Дата отримання">
              <input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className="ios-input text-sm w-full" />
            </Field>
          </div>

          <Field label="Рахунок зарахування">
            <IosSelect
              value={accountId}
              onChange={setAccountId}
              options={accounts.map((a) => ({ value: String(a.id), label: `${a.name} (${a.currency})` }))}
              placeholder="—"
            />
          </Field>

          {/* Rental selection */}
          <Field label={`Включені оренди (${selected.size} з ${rentals.length})`}>
            {rentals.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">Немає неоплачених оренд за цей період.</p>
            ) : (
              <div className="rounded-lg border border-border max-h-64 overflow-y-auto divide-y divide-border/40">
                {rentals.map((r) => (
                  <label key={r.rentalId} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/30">
                    <input type="checkbox" checked={selected.has(r.rentalId)} onChange={() => toggle(r.rentalId)} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium">{r.car}</span>
                        <span className="text-muted-foreground font-mono ml-2 text-xs">{r.plateNumber}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground tabular-nums">
                        {new Date(r.date).toLocaleDateString('uk', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        {r.contractNumber && ` · ${r.contractNumber}`}
                      </div>
                    </div>
                    <div className="text-right tabular-nums">
                      <div className="text-sm font-semibold" style={{ color: 'var(--c-success)' }}>€ {r.commissionAmount.toFixed(2)}</div>
                      {r.commissionAmountUah != null && (
                        <div className="text-[10px] text-muted-foreground">₴ {r.commissionAmountUah.toFixed(2)}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </Field>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Нараховано (€)</p>
              <p className="text-base font-bold tabular-nums" style={{ color: 'var(--c-success)' }}>€ {totalEur.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Очікувано (₴)</p>
              <p className="text-base font-bold tabular-nums text-muted-foreground">₴ {totalUahPreview.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Фактично отримано (₴)" hint="Залиш порожнім — візьмемо очікувану. Перебий, якщо округлили / недоплата.">
              <input
                type="number"
                step="0.01"
                value={receivedOverride}
                onChange={(e) => setReceivedOverride(e.target.value)}
                placeholder={totalUahPreview.toFixed(2)}
                className="ios-input text-sm w-full tabular-nums"
              />
            </Field>
            <Field label="Курс EUR/UAH" hint="Залиш порожнім — візьмемо НБУ на дату платежу.">
              <input
                type="number"
                step="0.0001"
                value={fxRate}
                onChange={(e) => setFxRate(e.target.value)}
                placeholder="auto"
                className="ios-input text-sm w-full tabular-nums"
              />
            </Field>
          </div>

          <Field label="Нотатки">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="ios-textarea text-sm w-full" />
          </Field>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost">Скасувати</button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || selected.size === 0 || !accountId}
            className="ios-btn ios-btn-primary"
          >
            {submitting ? 'Зберігаємо…' : 'Зафіксувати платіж'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[10px] text-muted-foreground italic">{hint}</p>}
    </div>
  );
}
