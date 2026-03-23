"use client";

import { useMemo } from "react";

/** IDs alineados con el backend: Ricky = 1, Yessi = 2 */
export const DROGUERIA_RICKY_ID = 1;
export const DROGUERIA_YESSI_ID = 2;

type Store = {
  id: number;
  label: string;
};

type Props = {
  drogueriaId: number;
  onDrogueriaChange: (id: number) => void;
};

export default function StoreBadges({
  drogueriaId,
  onDrogueriaChange,
}: Props) {
  const stores: Store[] = useMemo(
    () => [
      { id: DROGUERIA_RICKY_ID, label: "Drogueria Ricky" },
      { id: DROGUERIA_YESSI_ID, label: "Drogueria Yessi 24H" },
    ],
    []
  );

  return (
    <div
      className="inline-flex w-full items-stretch overflow-hidden rounded-2xl border"
      style={{
        borderColor: "var(--primary-100)",
        // Fondo igual al “suelo” del dashboard para que no se vea con sombra/contraste raro.
        backgroundColor: "var(--primary-100)",
      }}
    >
      {stores.map((s, idx) => {
        const selected = s.id === drogueriaId;
        return (
          <div
            key={s.id}
            className="flex flex-1 items-center justify-center"
            style={{
              // Separador vertical suave entre segmentos
              borderLeft:
                idx === 0 ? "none" : "1px solid color-mix(in srgb, var(--primary-200) 60%, white)",
            }}
          >
            <button
              type="button"
              onClick={() => onDrogueriaChange(s.id)}
              className="w-full px-4 py-2 text-sm font-semibold transition-colors outline-none focus:outline-none"
              style={{
                backgroundColor: selected
                  ? "var(--primary-600)"
                  : "var(--primary-100)",
                color: selected
                  ? "white"
                  : "var(--primary-700)",
                boxShadow: "none",
                outline: "none",
              }}
            >
              {s.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
