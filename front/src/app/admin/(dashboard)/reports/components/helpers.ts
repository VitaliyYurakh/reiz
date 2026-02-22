import type { ThemeTokens } from '@/context/AdminThemeContext';

export { fmtMoneyUAH as formatMoney, fmtDate } from '@/app/admin/lib/format';

export function getDefaultFrom() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

export function getDefaultTo() {
  return new Date().toISOString().slice(0, 10);
}

export function downloadCSV(
  filename: string,
  headers: string[],
  rows: string[][],
) {
  const BOM = '\uFEFF';
  const csv =
    BOM + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getUtilColor(pct: number, H: ThemeTokens) {
  if (pct > 70) return H.green;
  if (pct > 40) return H.orange;
  return H.red;
}
