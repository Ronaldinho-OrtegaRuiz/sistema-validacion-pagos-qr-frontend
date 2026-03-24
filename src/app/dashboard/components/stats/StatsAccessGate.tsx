"use client";

import { getAuthUsername } from "@/lib/auth-storage";
import { canAccessStats } from "@/lib/stats-access";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Redirige a inicio si el usuario no debe ver estadísticas (según env + nombre guardado al login).
 */
export default function StatsAccessGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const u = getAuthUsername();
    if (!canAccessStats(u)) {
      router.replace("/dashboard");
      setAllowed(false);
      return;
    }
    setAllowed(true);
  }, [router]);

  if (allowed === false) return null;
  if (allowed === null) {
    return (
      <p
        className="px-4 py-8 text-sm font-medium"
        style={{ color: "var(--primary-700)" }}
      >
        Comprobando acceso…
      </p>
    );
  }
  return <>{children}</>;
}
