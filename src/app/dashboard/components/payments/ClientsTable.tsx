"use client";

import React from "react";
import { formatValorCOPTable } from "@/lib/money-format";
import type { PaymentItem } from "@/lib/payments";
import { SCROLL_ROW_THRESHOLD } from "./constants";

type Props = {
  items: PaymentItem[];
  page: number;
  pageSize: number;
  sort: "asc" | "desc";
  onSortChange: (next: "asc" | "desc") => void;
  loading?: boolean;
};

/** Misma idea que la captura: 24 h, HH:mm (ej. 13:44). */
function formatHora(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  });
}

export default function ClientsTable({
  items,
  page,
  pageSize,
  sort,
  onSortChange,
  loading,
}: Props) {
  const toggleSort = () => {
    onSortChange(sort === "desc" ? "asc" : "desc");
  };

  /** Más de 10 filas visibles → scroll interno (no alargar la página) */
  const useBodyScroll =
    !loading && items.length > SCROLL_ROW_THRESHOLD;

  const thSticky: React.CSSProperties = useBodyScroll
    ? {
        position: "sticky",
        top: 0,
        zIndex: 2,
        backgroundColor: "var(--primary-100)",
        boxShadow: "0 1px 0 var(--primary-200)",
      }
    : {};

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border"
      style={{
        borderColor: "var(--primary-200)",
        backgroundColor:
          "color-mix(in srgb, var(--primary-600) 6%, var(--background))",
      }}
    >
      <div
        className={
          useBodyScroll
            ? "max-h-[min(28rem,52vh)] overflow-auto overscroll-contain"
            : "overflow-x-auto"
        }
      >
        <table className="w-full border-collapse">
          <thead>
            <tr
              style={{
                backgroundColor: "var(--primary-100)",
                color: "var(--primary-800)",
              }}
            >
              <th
                style={{
                  ...thStyle,
                  ...thSticky,
                  width: "70px",
                  textAlign: "center",
                }}
              >
                #
              </th>
              <th style={{ ...thStyle, ...thSticky }}>CLIENTE</th>
              <th style={{ ...thStyle, ...thSticky }}>
                <button
                  type="button"
                  onClick={toggleSort}
                  disabled={loading}
                  className="inline-flex w-full items-center gap-2 border-0 bg-transparent p-0 text-left font-bold outline-none disabled:opacity-60"
                  style={{
                    color: "inherit",
                    cursor: loading ? "wait" : "pointer",
                  }}
                  title="Orden por fecha (asc / desc)"
                >
                  <span>VALOR</span>
                  <span
                    className="inline-flex flex-col leading-none"
                    style={{ color: "var(--primary-700)" }}
                    aria-hidden
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        marginBottom: "-1px",
                        opacity: sort === "asc" ? 1 : 0.35,
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        opacity: sort === "desc" ? 1 : 0.35,
                      }}
                    >
                      ▼
                    </span>
                  </span>
                </button>
              </th>
              <th style={{ ...thStyle, ...thSticky }}>HORA</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--primary-600) 10%, var(--background))",
                }}
              >
                <td
                  colSpan={4}
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    color: "var(--primary-700)",
                    fontWeight: 600,
                  }}
                >
                  Cargando pagos…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--primary-600) 10%, var(--background))",
                }}
              >
                <td
                  colSpan={4}
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    color: "var(--primary-700)",
                    fontWeight: 600,
                  }}
                >
                  No hay pagos para mostrar.
                </td>
              </tr>
            ) : (
              items.map((r, idx) => {
                const rowNum = (page - 1) * pageSize + idx + 1;
                const zebra =
                  idx % 2 === 0
                    ? "color-mix(in srgb, var(--primary-600) 8%, var(--background))"
                    : "color-mix(in srgb, var(--primary-600) 14%, var(--background))";
                return (
                  <tr
                    key={`${r.message_id}-${r.id}`}
                    style={{ backgroundColor: zebra }}
                  >
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "var(--primary-700)",
                      }}
                    >
                      {rowNum}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: "var(--foreground)",
                        fontWeight: 600,
                      }}
                    >
                      {r.client}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: "var(--primary-700)",
                        fontWeight: 600,
                      }}
                    >
                      {formatValorCOPTable(r.value)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color:
                          "color-mix(in srgb, var(--foreground) 82%, var(--primary-500))",
                        fontWeight: 600,
                      }}
                    >
                      {formatHora(r.date)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const borderColor = "var(--primary-200)";

const thStyle: React.CSSProperties = {
  borderBottom: `1px solid ${borderColor}`,
  borderRight: `1px solid ${borderColor}`,
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  borderRight: `1px solid ${borderColor}`,
  borderBottom: `1px solid ${borderColor}`,
  padding: "14px 16px",
  fontSize: "14px",
};
