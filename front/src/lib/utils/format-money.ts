/** Format minor-unit amount → "1 234,56 USD" */
export function formatMoney(
  amountMinor: number | null | undefined,
  currency?: string,
): string {
  if (amountMinor == null) return "—";
  const formatted = (amountMinor / 100).toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
  });
  return currency ? `${formatted} ${currency}` : formatted;
}
