"use client";

import { PAGE_SIZE_OPTIONS } from "./constants";

type Props = {
  total: number;
  page: number;
  pages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
  loading?: boolean;
  totalLabel?: string;
};

export default function PaymentsPaginationView({
  total,
  page,
  pages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
  totalLabel = "Total",
}: Props) {
  const windowSize = 5;
  const safePages = Math.max(1, pages || 1);
  const currentPage = Math.min(page, safePages);

  const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(safePages, start + windowSize - 1);
  const correctedStart = Math.max(1, end - windowSize + 1);
  const visiblePages = Array.from(
    { length: Math.max(0, end - correctedStart + 1) },
    (_, i) => correctedStart + i
  );

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div
          className="text-base font-semibold"
          style={{ color: "var(--primary-600)" }}
        >
          {totalLabel}: {total}
        </div>
        <label className="flex items-center gap-2">
          <span
            className="text-base font-semibold"
            style={{ color: "var(--primary-600)" }}
          >
            Por página
          </span>
          <select
            value={pageSize}
            disabled={loading}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="min-w-[4.5rem] cursor-pointer rounded-xl border-2 px-3 py-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--primary-400)] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: "var(--primary-400)",
              backgroundColor: "color-mix(in srgb, var(--primary-600) 10%, white)",
              color: "var(--primary-800)",
            }}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={loading || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--primary-100)",
            color: "var(--primary-700)",
            border: "1px solid var(--primary-200)",
          }}
        >
          ←
        </button>

        {correctedStart > 1 ? (
          <span
            className="px-2 text-sm"
            style={{ color: "var(--primary-700)" }}
          >
            ...
          </span>
        ) : null}

        {visiblePages.map((p) => {
          const active = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              disabled={loading}
              onClick={() => onPageChange(p)}
              className="min-w-9 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60"
              style={{
                backgroundColor: active
                  ? "var(--primary-600)"
                  : "var(--primary-100)",
                color: active ? "white" : "var(--primary-700)",
                border: "1px solid var(--primary-200)",
              }}
            >
              {p}
            </button>
          );
        })}

        {end < safePages ? (
          <span
            className="px-2 text-sm"
            style={{ color: "var(--primary-700)" }}
          >
            ...
          </span>
        ) : null}

        <button
          type="button"
          aria-label="Página siguiente"
          disabled={loading || currentPage >= safePages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--primary-100)",
            color: "var(--primary-700)",
            border: "1px solid var(--primary-200)",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
