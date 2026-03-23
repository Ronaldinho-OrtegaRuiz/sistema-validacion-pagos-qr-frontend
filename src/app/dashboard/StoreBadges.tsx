"use client";

import { useMemo, useState } from "react";

type Store = {
  id: string;
  label: string;
};

export default function StoreBadges() {
  const stores: Store[] = useMemo(
    () => [
      { id: "ricky", label: "Drogueria Ricky" },
      { id: "yessi", label: "Drogueria Yessi 24H" },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState(stores[0]?.id ?? "ricky");

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
        const selected = s.id === selectedId;
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
              onClick={() => setSelectedId(s.id)}
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

