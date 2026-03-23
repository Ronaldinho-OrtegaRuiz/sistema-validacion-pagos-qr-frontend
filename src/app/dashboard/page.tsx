export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  return (
    <section aria-label="Contenido dashboard">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Inicio
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Aquí irá tu contenido del dashboard.
      </p>
    </section>
  );
}

