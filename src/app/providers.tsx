"use client";

import { ThemePreferenceProvider } from "@/components/ThemePreferenceProvider";
import { ToastProvider } from "@/components/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemePreferenceProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemePreferenceProvider>
  );
}
