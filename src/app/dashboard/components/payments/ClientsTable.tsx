"use client";

import React from "react";
import type { PaymentItem } from "@/lib/payments";

type Props = {
  items: PaymentItem[];
  page: number;
  pageSize: number;
  sort: "asc" | "desc";
  onSortChange: (next: "asc" | "desc") => void;
  loading?: boolean;
};

function formatHora(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
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

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border"
      style={{
        borderColor: "var(--primary-200)",
        backgroundColor: "color-mix(in srgb, var(--primary-600) 5%, white)",
      }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr
            style={{
              backgroundColor: "var(--primary-100)",
              color: "var(--primary-800)",
            }}
          >
            <th style={{ ...thStyle, width: "70px", textAlign: "center" }}>
              #
            </th>
            <th style={thStyle}>CLIENTE</th>
            <th style={thStyle}>
              <button
                type="button"
                onClick={toggleSort}
                disabled={loading}
                className="inline-flex w-full items-center gap-2 border-0 bg-transparent p-0 text-left font-bold outline-none disabled:opacity-60"
                style={{ color: "inherit", cursor: loading ? "wait" : "pointer" }}
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
            <th style={thStyle}>HORA</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr style={{ backgroundColor: "color-mix(in srgb, var(--primary-600) 8%, white)" }}>
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
            <tr style={{ backgroundColor: "color-mix(in srgb, var(--primary-600) 8%, white)" }}>
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
                  ? "color-mix(in srgb, var(--primary-600) 7%, white)"
                  : "color-mix(in srgb, var(--primary-600) 12%, white)";
              return (
                <tr key={`${r.message_id}-${r.id}`} style={{ backgroundColor: zebra }}>
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
                      color: "var(--primary-800)",
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
                    {r.value}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color: "color-mix(in srgb, var(--primary-800) 88%, black)",
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
