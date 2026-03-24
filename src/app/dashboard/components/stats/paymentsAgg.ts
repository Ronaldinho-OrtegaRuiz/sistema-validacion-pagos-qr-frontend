import type { PaymentByMonthRow } from "@/lib/payments";

/**
 * Zona para agrupar pagos por “día calendario” igual que el backend con PAYMENTS_TZ / `on_date`.
 * Ajusta con NEXT_PUBLIC_PAYMENTS_TZ si tu API usa otra zona.
 */
export const PAYMENTS_STATS_TIMEZONE =
  (typeof process !== "undefined" &&
    typeof process.env.NEXT_PUBLIC_PAYMENTS_TZ === "string" &&
    process.env.NEXT_PUBLIC_PAYMENTS_TZ.trim()) ||
  "America/Bogota";

/** YYYY-MM-DD desde ISO (primeros 10 chars) — día UTC; puede no coincidir con `on_date` local. */
export function dayKeyFromIso(iso: string): string | null {
  const m = iso.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

/** YYYY-MM-DD del instante en la zona indicada (alineado con filtros por día del servidor). */
export function calendarDayKeyFromIso(
  iso: string,
  timeZone: string = PAYMENTS_STATS_TIMEZONE
): string | null {
  const d = new Date(iso.trim());
  if (Number.isNaN(d.getTime())) return null;
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);
    const y = parts.find((p) => p.type === "year")?.value;
    const mo = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    if (!y || !mo || !day) return null;
    return `${y}-${mo}-${day}`;
  } catch {
    return null;
  }
}

/** Año calendario actual en la misma zona (para pedir el mes correcto al API). */
export function calendarYearInTimeZone(
  instant: Date = new Date(),
  timeZone: string = PAYMENTS_STATS_TIMEZONE
): number {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
    }).formatToParts(instant);
    const y = parts.find((p) => p.type === "year")?.value;
    const n = y ? parseInt(y, 10) : instant.getFullYear();
    return Number.isFinite(n) ? n : instant.getFullYear();
  } catch {
    return instant.getFullYear();
  }
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
 * Agrupa filas del mes calendario (year/month) usando el día local en PAYMENTS_STATS_TIMEZONE,
 * no el prefijo UTC del ISO (evita 5 vs 9 pagos “hoy” vs gráfica).
 */
export function aggregateMonth(
  rows: PaymentByMonthRow[],
  year: number,
  month: number,
  timeZone: string = PAYMENTS_STATS_TIMEZONE
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
    const key = calendarDayKeyFromIso(row.date, timeZone);
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
  fallback: number = DEFAULT_STATS_YEAR_FALLBACK,
  timeZone: string = PAYMENTS_STATS_TIMEZONE
): number {
  for (const row of rows) {
    const key = calendarDayKeyFromIso(row.date, timeZone);
    if (!key) continue;
    const y = Number.parseInt(key.slice(0, 4), 10);
    if (Number.isFinite(y) && y >= 2000 && y <= 2100) return y;
  }
  return fallback;
}
