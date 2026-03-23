import StoreBadges from "./StoreBadges";
import ClientsTable from "./ClientsTable";
import PaymentsPaginationView from "./PaymentsPaginationView";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const now = new Date();
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(
    now.getDate()
  )}`;

  return (
    <section aria-label="Contenido dashboard">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col items-center justify-center gap-6 px-2">
        <div className="w-full max-w-4xl">
          <StoreBadges />
        </div>

        <div className="w-full max-w-4xl flex flex-col gap-2">
          {/* Fecha + botón pegado a la tabla */}
          <div className="flex w-full items-center justify-start gap-3 rounded-2xl">
            <div className="text-sm font-semibold" style={{ color: "var(--primary-800)" }}>
              Fecha: {dateStr}
            </div>

            <button
              type="button"
              aria-label="Acción"
              className="flex h-10 items-center justify-center rounded-xl px-3"
              style={{ backgroundColor: "var(--primary-600)", color: "white" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" focusable="false" viewBox="0 0 12 12" aria-hidden="true">
                <path fill="none" stroke="currentColor" strokeLinecap="round" d="M10 4c-.8-1.1-2-2.5-4.1-2.5-2.5 0-4.4 2-4.4 4.5s2 4.5 4.4 4.5c1.3 0 2.5-.6 3.3-1.5m1.3-7.5V4c0 .3-.2.5-.5.5H7.5" />
              </svg>
            </button>
          </div>

          <ClientsTable />
          <PaymentsPaginationView />
        </div>
      </div>
    </section>
  );
}

