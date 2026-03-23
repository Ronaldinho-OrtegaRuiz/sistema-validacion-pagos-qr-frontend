export default function PaymentsPaginationView() {
  // Solo vista (sin lógica/llamadas aún).
  const page = 3;
  const total = 128;
  const pages = 13;

  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pages, start + windowSize - 1);
  const correctedStart = Math.max(1, end - windowSize + 1);
  const visiblePages = Array.from(
    { length: end - correctedStart + 1 },
    (_, i) => correctedStart + i
  );

  return (
    <div className="w-full">
      <div className="mb-2 text-base font-semibold" style={{ color: "var(--primary-600)" }}>
        Total de pagos hoy: {total}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          aria-label="Página anterior"
          className="rounded-lg px-3 py-2 text-sm font-semibold"
          style={{
            backgroundColor: "var(--primary-100)",
            color: "var(--primary-700)",
            border: "1px solid var(--primary-200)",
          }}
        >
          ←
        </button>

        {correctedStart > 1 ? (
          <span className="px-2 text-sm" style={{ color: "var(--primary-700)" }}>
            ...
          </span>
        ) : null}

        {visiblePages.map((p) => {
          const active = p === page;
          return (
            <button
              key={p}
              type="button"
              className="min-w-9 rounded-lg px-3 py-2 text-sm font-semibold"
              style={{
                backgroundColor: active ? "var(--primary-600)" : "var(--primary-100)",
                color: active ? "white" : "var(--primary-700)",
                border: "1px solid var(--primary-200)",
              }}
            >
              {p}
            </button>
          );
        })}

        {end < pages ? (
          <span className="px-2 text-sm" style={{ color: "var(--primary-700)" }}>
            ...
          </span>
        ) : null}

        <button
          type="button"
          aria-label="Página siguiente"
          className="rounded-lg px-3 py-2 text-sm font-semibold"
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

