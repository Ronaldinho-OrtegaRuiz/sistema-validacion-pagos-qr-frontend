import StatsPageClient from "../components/stats/StatsPageClient";

export const metadata = {
  title: "Estadísticas",
};

export default function StatsPage() {
  return (
    <section aria-label="Contenido estadísticas">
      <StatsPageClient />
    </section>
  );
}
