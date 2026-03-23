import DashboardPaymentsSection from "./components/payments/DashboardPaymentsSection";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <section aria-label="Contenido dashboard">
      <DashboardPaymentsSection />
    </section>
  );
}
