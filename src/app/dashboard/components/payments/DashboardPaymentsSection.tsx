"use client";

import { useToast } from "@/components/ToastProvider";
import { getToken, removeToken } from "@/lib/auth-storage";
import {
  detailFromBody,
  getPayments,
  getPaymentsWebSocketUrl,
  postPollNow,
  type PaymentItem,
  type PaymentsQueryParams,
} from "@/lib/payments";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ClientsTable from "./ClientsTable";
import { DEFAULT_PAGE_SIZE } from "./constants";
import DateFilterControls, {
  type PaymentDateMode,
} from "./DateFilterControls";
import PaymentsPaginationView from "./PaymentsPaginationView";
import StoreBadges, { DROGUERIA_RICKY_ID } from "./StoreBadges";

function todayOnDateLocal(): string {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

function errorMessage(body: unknown, fallback: string): string {
  const d = detailFromBody(body);
  if (d) return d;
  if (body && typeof body === "object" && "message" in body) {
    const m = (body as { message?: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return fallback;
}

function buildDateQuery(
  mode: PaymentDateMode,
  today: string,
  specificDate: string,
  rangeFrom: string,
  rangeTo: string
): Pick<PaymentsQueryParams, "on_date" | "date_from" | "date_to"> {
  if (mode === "especifica") {
    return { on_date: specificDate || today };
  }
  let from = rangeFrom;
  let to = rangeTo;
  if (from && to && from > to) {
    [from, to] = [to, from];
  }
  if (from && to) {
    return { date_from: from, date_to: to };
  }
  // Rango incompleto: mismo día (evita pedir todo el histórico sin filtro)
  return { on_date: today };
}

export default function DashboardPaymentsSection() {
  const router = useRouter();
  const toast = useToast();

  const [drogueriaId, setDrogueriaId] = useState(DROGUERIA_RICKY_ID);
  const [dateMode, setDateMode] = useState<PaymentDateMode>("especifica");
  const [specificDate, setSpecificDate] = useState(() => todayOnDateLocal());
  const [rangeFrom, setRangeFrom] = useState(() => todayOnDateLocal());
  const [rangeTo, setRangeTo] = useState(() => todayOnDateLocal());

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const [items, setItems] = useState<PaymentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  const loadRef = useRef<() => Promise<void>>(undefined);

  const totalLabel = useMemo(() => {
    const today = todayOnDateLocal();
    if (dateMode === "especifica") return `Total (${specificDate || today})`;
    if (rangeFrom && rangeTo) {
      return `Total (${rangeFrom} → ${rangeTo})`;
    }
    return "Total en el rango";
  }, [dateMode, specificDate, rangeFrom, rangeTo]);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const today = todayOnDateLocal();
      const datePart = buildDateQuery(
        dateMode,
        today,
        specificDate,
        rangeFrom,
        rangeTo
      );

      const result = await getPayments({
        page,
        page_size: pageSize,
        sort,
        drogueria_id: drogueriaId,
        ...datePart,
      });

      if (!result.ok) {
        if (result.status === 401) {
          removeToken();
          toast.show("Sesión expirada. Inicia sesión de nuevo.", "error");
          router.replace("/login");
          return;
        }
        const msg = errorMessage(
          result.body,
          result.status === 503
            ? "Servicio no disponible (p. ej. falta DATABASE_URL)."
            : "No se pudieron cargar los pagos."
        );
        toast.show(msg, "error");
        setItems([]);
        setTotal(0);
        setPages(1);
        return;
      }

      const { items: list, total: t, pages: pg } = result.data;
      setItems(list);
      setTotal(t);
      const effectivePages =
        t === 0 ? 1 : Math.max(1, pg);
      setPages(effectivePages);
      if (page > effectivePages) {
        setPage(effectivePages);
      }
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    sort,
    dateMode,
    specificDate,
    rangeFrom,
    rangeTo,
    drogueriaId,
    router,
    toast,
  ]);

  loadRef.current = loadPayments;

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let ws: WebSocket;
    try {
      ws = new WebSocket(getPaymentsWebSocketUrl(token));
    } catch {
      return;
    }

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as { type?: string };
        if (data?.type === "new_payment") {
          void loadRef.current?.();
        }
      } catch {
        // ignorar frames no JSON
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleDateModeChange = (mode: PaymentDateMode) => {
    setDateMode(mode);
    setPage(1);
    const t = todayOnDateLocal();
    if (mode === "especifica") {
      setSpecificDate(t);
    }
    if (mode === "rango") {
      setRangeFrom(t);
      setRangeTo(t);
    }
  };

  const handleDrogueriaChange = (id: number) => {
    setDrogueriaId(id);
    setPage(1);
  };

  const handlePageSizeChange = (n: number) => {
    setPageSize(n);
    setPage(1);
  };

  const handleSortChange = (next: "asc" | "desc") => {
    setSort(next);
    setPage(1);
  };

  const handlePollNow = async () => {
    setPolling(true);
    try {
      const r = await postPollNow();
      if (!r.ok) {
        if (r.status === 401) {
          removeToken();
          toast.show("Sesión expirada. Inicia sesión de nuevo.", "error");
          router.replace("/login");
          return;
        }
        toast.show(
          errorMessage(r.body, "No se pudo sincronizar correos."),
          "error"
        );
        return;
      }

      const d = r.data;
      if (d.ok === false) {
        toast.show(
          typeof d.message === "string" && d.message.trim()
            ? d.message
            : "No se pudo ejecutar la sincronización.",
          "error"
        );
        return;
      }

      const nc = d.new_count ?? 0;
      if (d.bootstrapped) {
        toast.show(
          d.message ?? "Puntero de correo inicializado (sin histórico).",
          "info"
        );
      } else if (nc > 0) {
        toast.show(`Sincronización: ${nc} pago(s) nuevo(s).`, "success");
      } else {
        toast.show(d.message ?? "Sincronización completada.", "info");
      }

      await loadPayments();
    } finally {
      setPolling(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-start px-2 pb-10 pt-4 sm:pt-6">
      {/* Badges arriba fijos: sin justify-center para que no “salten” con la altura del contenido */}
      <div className="w-full max-w-4xl shrink-0">
        <StoreBadges
          drogueriaId={drogueriaId}
          onDrogueriaChange={handleDrogueriaChange}
        />
      </div>

      {/* Más aire bajo badges: fecha/tablas más abajo */}
      <div className="h-8 w-full sm:h-12" aria-hidden />

      <div className="flex w-full max-w-4xl flex-col gap-2 sm:gap-3">
        {/* Altura mínima fija: modo fecha específica vs rango no mueve el bloque de abajo */}
        <div className="flex min-h-[11.5rem] w-full flex-col gap-4 sm:min-h-[7.5rem] sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-h-[6.5rem] min-w-0 flex-1 flex-col justify-start sm:min-h-[5.5rem]">
            <DateFilterControls
              mode={dateMode}
              onModeChange={handleDateModeChange}
              specificDate={specificDate}
              onSpecificDateChange={(v) => {
                setSpecificDate(v);
                setPage(1);
              }}
              rangeFrom={rangeFrom}
              rangeTo={rangeTo}
              onRangeFromChange={(v) => {
                setRangeFrom(v);
                setPage(1);
              }}
              onRangeToChange={(v) => {
                setRangeTo(v);
                setPage(1);
              }}
              disabled={loading}
            />
          </div>

          <button
            type="button"
            aria-label="Sincronizar pagos desde correo"
            disabled={polling || loading}
            onClick={() => void handlePollNow()}
            className="flex h-10 shrink-0 items-center justify-center self-start rounded-xl px-3 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "var(--primary-600)", color: "white" }}
            title="POST /payments/poll-now"
          >
            {polling ? (
              <span className="text-xs font-semibold">…</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                focusable="false"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  d="M10 4c-.8-1.1-2-2.5-4.1-2.5-2.5 0-4.4 2-4.4 4.5s2 4.5 4.4 4.5c1.3 0 2.5-.6 3.3-1.5m1.3-7.5V4c0 .3-.2.5-.5.5H7.5"
                />
              </svg>
            )}
          </button>
        </div>

        <ClientsTable
          items={items}
          page={page}
          pageSize={pageSize}
          sort={sort}
          onSortChange={handleSortChange}
          loading={loading}
        />
        <PaymentsPaginationView
          total={total}
          page={Math.min(page, pages)}
          pages={pages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
          totalLabel={totalLabel}
        />
      </div>
    </div>
  );
}
