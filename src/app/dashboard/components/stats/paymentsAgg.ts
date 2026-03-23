import type { PaymentByMonthRow } from "@/lib/payments";

/** YYYY-MM-DD desde ISO (primeros 10 chars si vienen en ese formato). */
export function dayKeyFromIso(iso: string): string | null {
  const m = iso.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

export function parsePaymentValue(s: string): number {
  const t = s.trim().replace(",", ".");
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : 0;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export type MonthAggregate = {
  year: number;
  month: number;
  dim: number;
  dayLabels: number[];
  counts: number[];
  sums: number[];
  totalPayments: number;
  totalValue: number;
  avgPaymentsPerCalendarDay: number;
  avgValuePerPayment: number;
  minValueDay: { day: number; sum: number } | null;
  maxValueDay: { day: number; sum: number } | null;
};

/**
 * Agrupa filas del mes calendario (year/month). Solo cuenta filas cuya fecha cae en ese mes.
 */
export function aggregateMonth(
  rows: PaymentByMonthRow[],
  year: number,
  month: number
): MonthAggregate {
  const dim = daysInMonth(year, month);
  const y = String(year);
  const mo = String(month).padStart(2, "0");
  const prefix = `${y}-${mo}-`;
  const validDays = new Set<string>();
  for (let d = 1; d <= dim; d++) {
    validDays.add(`${prefix}${String(d).padStart(2, "0")}`);
  }

  const counts = Array.from({ length: dim }, () => 0);
  const sums = Array.from({ length: dim }, () => 0);

  for (const row of rows) {
    const key = dayKeyFromIso(row.date);
    if (!key || !validDays.has(key)) continue;
    const day = Number.parseInt(key.slice(8, 10), 10);
    if (day < 1 || day > dim) continue;
    const i = day - 1;
    counts[i] += 1;
    sums[i] += parsePaymentValue(row.value);
  }

  const totalPayments = counts.reduce((a, b) => a + b, 0);
  const totalValue = sums.reduce((a, b) => a + b, 0);
  const avgPaymentsPerCalendarDay =
    dim > 0 ? totalPayments / dim : 0;
  const avgValuePerPayment =
    totalPayments > 0 ? totalValue / totalPayments : 0;

  let minValueDay: { day: number; sum: number } | null = null;
  let maxValueDay: { day: number; sum: number } | null = null;
  for (let i = 0; i < dim; i++) {
    const sum = sums[i];
    if (sum <= 0) continue;
    const day = i + 1;
    if (!minValueDay || sum < minValueDay.sum) minValueDay = { day, sum };
    if (!maxValueDay || sum > maxValueDay.sum) maxValueDay = { day, sum };
  }

  const dayLabels = Array.from({ length: dim }, (_, i) => i + 1);

  return {
    year,
    month,
    dim,
    dayLabels,
    counts,
    sums,
    totalPayments,
    totalValue,
    avgPaymentsPerCalendarDay,
    avgValuePerPayment,
    minValueDay,
    maxValueDay,
  };
}

/** Año a usar para gráficas si no mandamos year al API: del primer dato, o 2026 si no hay filas. */
export const DEFAULT_STATS_YEAR_FALLBACK = 2026;

export function inferYearFromRows(
  rows: PaymentByMonthRow[],
  fallback: number = DEFAULT_STATS_YEAR_FALLBACK
): number {
  for (const row of rows) {
    const key = dayKeyFromIso(row.date);
    if (!key) continue;
    const y = Number.parseInt(key.slice(0, 4), 10);
    if (Number.isFinite(y) && y >= 2000 && y <= 2100) return y;
  }
  return fallback;
}
