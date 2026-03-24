"use client";

import { useToast } from "@/components/ToastProvider";
import { removeToken } from "@/lib/auth-storage";
import { detailFromBody, getPaymentsByMonth } from "@/lib/payments";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import StoreBadges, { DROGUERIA_RICKY_ID } from "../payments/StoreBadges";
import {
  aggregateMonth,
  calendarYearInTimeZone,
  PAYMENTS_STATS_TIMEZONE,
} from "./paymentsAgg";
import { PaymentsLineChart, ValueBarChart } from "./StatsCharts";

const MONTH_NAMES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

function moneyEs(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function dec2(n: number): string {
  return n.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function StatsPageClient() {
  const router = useRouter();
  const toast = useToast();

  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [drogueriaId, setDrogueriaId] = useState(DROGUERIA_RICKY_ID);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<ReturnType<typeof aggregateMonth> | null>(
    null
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Año explícito + misma TZ que la agregación → mismo “día” que inicio (`on_date`).
      const year = calendarYearInTimeZone(
        new Date(),
        PAYMENTS_STATS_TIMEZONE
      );
      const res = await getPaymentsByMonth({
        month,
        year,
        drogueria_id: drogueriaId,
      });
      if (!res.ok) {
        if (res.status === 401) {
          removeToken();
          toast.show("Sesión expirada. Inicia sesión de nuevo.", "error");
          router.replace("/login");
          return;
        }
        const msg =
          detailFromBody(res.body) ??
          (res.status === 503
            ? "Servicio no disponible (p. ej. falta DATABASE_URL)."
            : "No se pudieron cargar las estadísticas.");
        setError(msg);
        setSeries(null);
        return;
      }
      setSeries(aggregateMonth(res.data, year, month));
    } catch {
      setError("Error de red al cargar estadísticas.");
      setSeries(null);
    } finally {
      setLoading(false);
    }
  }, [drogueriaId, month, router, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const monthTitle = MONTH_NAMES_ES[month - 1] ?? `Mes ${month}`;

  const formatDayLabel = (day: number) => {
    const y =
      series?.year ??
      calendarYearInTimeZone(new Date(), PAYMENTS_STATS_TIMEZONE);
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${y}`;
  };

  return (
    <section aria-label="Estadísticas por mes" className="w-full max-w-5xl pb-8">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--primary-800)" }}
      >
        Estadísticas
      </h1>

      <div className="mt-6 w-full max-w-4xl">
        <StoreBadges
          drogueriaId={drogueriaId}
          onDrogueriaChange={setDrogueriaId}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-700">
          Mes
          <select
            value={month}
            disabled={loading}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="min-w-[10rem] rounded-xl border-2 px-3 py-2 font-semibold outline-none"
            style={{
              borderColor: "var(--primary-300)",
              color: "var(--primary-800)",
              backgroundColor:
                "color-mix(in srgb, var(--primary-600) 8%, white)",
            }}
          >
            {MONTH_NAMES_ES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={loading}
          onClick={() => void load()}
          className="h-10 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: "var(--primary-600)" }}
        >
          {loading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {!error && series ? (
        <div className="mt-8 flex flex-col gap-10">
          <article
            className="w-full rounded-2xl border p-5 shadow-sm"
            style={{
              borderColor: "var(--primary-200)",
              backgroundColor:
                "color-mix(in srgb, var(--primary-600) 4%, white)",
            }}
          >
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--primary-700)" }}
            >
              {monthTitle} {series.year} — Pagos con QR por día
            </h2>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div
                className="rounded-xl border px-3 py-2 font-semibold"
                style={{
                  borderColor: "var(--primary-200)",
                  backgroundColor: "white",
                  color: "var(--primary-800)",
                }}
              >
                Total pagos (mes):{" "}
                <span style={{ color: "var(--primary-600)" }}>
                  {series.totalPayments}
                </span>
              </div>
              <div
                className="rounded-xl border px-3 py-2 font-semibold"
                style={{
                  borderColor: "var(--primary-200)",
                  backgroundColor: "white",
                  color: "var(--primary-800)",
                }}
              >
                Promedio pagos / día ({series.dim} días):{" "}
                <span style={{ color: "var(--primary-600)" }}>
                  {dec2(series.avgPaymentsPerCalendarDay)}
                </span>
              </div>
            </div>
            <p
              className="mt-2 text-xs"
              style={{ color: "var(--primary-700)" }}
            >
              Pasa el mouse por un punto: cantidad de pagos con QR ese día. Cada
              barra/punto usa el día en{" "}
              <strong>America/Bogota</strong> (como el filtro de inicio); si el
              API usa otra zona, configura la variable{" "}
              <code
                className="rounded px-1 font-mono text-[11px]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--primary-600) 12%, var(--background))",
                  color: "var(--foreground)",
                }}
              >
                NEXT_PUBLIC_PAYMENTS_TZ
              </code>
              .
            </p>
            <div
              className="mt-4 rounded-xl border bg-white p-3"
              style={{ borderColor: "var(--primary-200)" }}
            >
              <PaymentsLineChart
                dayLabels={series.dayLabels}
                counts={series.counts}
                formatDayLabel={formatDayLabel}
              />
            </div>
          </article>

          <article
            className="w-full rounded-2xl border p-5 shadow-sm"
            style={{
              borderColor: "var(--primary-200)",
              backgroundColor:
                "color-mix(in srgb, var(--primary-600) 4%, white)",
            }}
          >
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--primary-700)" }}
            >
              {monthTitle} {series.year} — Valor acumulado por día
            </h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <div
                className="rounded-xl border px-3 py-2 font-semibold"
                style={{
                  borderColor: "var(--primary-200)",
                  backgroundColor: "white",
                  color: "var(--primary-800)",
                }}
              >
                Día con menor total:{" "}
                <span style={{ color: "var(--primary-600)" }}>
                  {series.minValueDay
                    ? `${formatDayLabel(series.minValueDay.day)} (${moneyEs(series.minValueDay.sum)})`
                    : "—"}
                </span>
              </div>
              <div
                className="rounded-xl border px-3 py-2 font-semibold"
                style={{
                  borderColor: "var(--primary-200)",
                  backgroundColor: "white",
                  color: "var(--primary-800)",
                }}
              >
                Día con mayor total:{" "}
                <span style={{ color: "var(--primary-600)" }}>
                  {series.maxValueDay
                    ? `${formatDayLabel(series.maxValueDay.day)} (${moneyEs(series.maxValueDay.sum)})`
                    : "—"}
                </span>
              </div>
              <div
                className="rounded-xl border px-3 py-2 font-semibold"
                style={{
                  borderColor: "var(--primary-200)",
                  backgroundColor: "white",
                  color: "var(--primary-800)",
                }}
              >
                Promedio valor / pago QR:{" "}
                <span style={{ color: "var(--primary-600)" }}>
                  {series.totalPayments > 0
                    ? moneyEs(series.avgValuePerPayment)
                    : "—"}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-zinc-600">
              Pasa el mouse sobre una barra: total del día.
            </p>
            <div
              className="mt-4 rounded-xl border bg-white p-3"
              style={{ borderColor: "var(--primary-200)" }}
            >
              <ValueBarChart
                dayLabels={series.dayLabels}
                sums={series.sums}
                formatMoney={moneyEs}
                formatDayLabel={formatDayLabel}
              />
            </div>
          </article>
        </div>
      ) : null}

      {!error && !series && loading ? (
        <p className="mt-8 text-sm text-zinc-500">Cargando datos del mes…</p>
      ) : null}
    </section>
  );
}
