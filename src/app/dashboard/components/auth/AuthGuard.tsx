"use client";

import { getToken } from "@/lib/auth-storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (allowed !== true) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Cargando…
      </div>
    );
  }

  return <>{children}</>;
}
