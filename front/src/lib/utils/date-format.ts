const getDayMonthParts = (
  date: Date,
  locale: string,
  month: "short" | "long",
) => {
  const parts = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month,
  }).formatToParts(date);

  const day = parts.find((part) => part.type === "day")?.value ?? String(date.getDate());
  const monthValue =
    parts.find((part) => part.type === "month")?.value ??
    date.toLocaleDateString(locale, { month });

  return {
    day,
    month: month === "short" ? monthValue.replace(/\.$/, "") : monthValue,
  };
};

/** "D mon" — e.g. "29 мар", locale-aware short month */
export const formatShort = (d: Date, locale: string): string => {
  const { day, month } = getDayMonthParts(d, locale, "short");
  return `${day} ${month}`;
};

/** "D month" — e.g. "29 марта", locale-aware long month */
export const formatLong = (d: Date, locale: string): string => {
  const { day, month } = getDayMonthParts(d, locale, "long");
  return `${day} ${month}`;
};

/** "DD.MM.YYYY" — e.g. "05.03.2026" */
export const formatFull = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

/** "HH:MM" — e.g. "14:30" */
export const formatTime = (d: Date): string => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

/**
 * Count rental days between two dates.
 * Base = calendar days (date difference ignoring time).
 * If return time exceeds pickup time by more than 2 hours → +1 day.
 */
export const calcRentalDays = (start: Date, end: Date): number => {
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const calendarDays = Math.round(
    (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24),
  );

  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  const overtime = endMinutes - startMinutes > 120 ? 1 : 0;

  return Math.max(calendarDays + overtime, 1);
};
