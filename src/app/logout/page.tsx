"use client";

import { removeToken } from "@/lib/auth-storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    removeToken();
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-600">
      Cerrando sesión…
    </div>
  );
}
