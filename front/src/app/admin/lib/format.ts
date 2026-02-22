/**
 * Shared formatting helpers for the admin panel.
 * Single source of truth — no more per-page duplicates.
 */

/** "15.12.24" — compact date used across most admin tables */
export function fmtDate(d: string | Date | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ru', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

/** "15 дек" — short date for period columns (no year) */
export function fmtDateShort(d: string | Date | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ru', {
    day: '2-digit',
    month: 'short',
  });
}

/** "15 дек 2024" — longer date used in calendar detail modals */
export function fmtDateLong(d: string | Date | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ru', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** "15.12.24 14:30" — date + time */
export function fmtDateTime(d: string | null | undefined): string {
  if (!d) return '—';
  const dt = new Date(d);
  return `${dt.toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: '2-digit' })} ${dt.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}`;
}

/** Format minor-unit amount → "1 234,56 UAH" */
export function fmtMoney(
  amountMinor: number | null | undefined,
  currency?: string,
): string {
  if (amountMinor == null) return '—';
  const formatted = (amountMinor / 100).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
  });
  return currency ? `${formatted} ${currency}` : formatted;
}

/** Format minor-unit amount with "грн" suffix — shorthand for reports/dashboard */
export function fmtMoneyUAH(amountMinor: number): string {
  return `${(amountMinor / 100).toLocaleString('uk-UA')} грн`;
}
