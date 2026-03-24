import StatsAccessGate from "../components/stats/StatsAccessGate";
import StatsPageClient from "../components/stats/StatsPageClient";

export const metadata = {
  title: "Estadísticas",
};

export default function StatsPage() {
  return (
    <section aria-label="Contenido estadísticas">
      <StatsAccessGate>
        <StatsPageClient />
      </StatsAccessGate>
    </section>
  );
}
