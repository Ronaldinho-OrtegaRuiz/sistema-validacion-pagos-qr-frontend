"use client";

import {
  APP_PRIMARY_KEY,
  DEFAULT_PRIMARY_HEX,
  isValidHex6,
} from "@/lib/theme-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemePreferenceContextValue = {
  primaryHex: string;
  setPrimaryHex: (hex: string) => void;
};

const ThemePreferenceContext =
  createContext<ThemePreferenceContextValue | null>(null);

function applyPrimary(primaryHex: string) {
  document.documentElement.style.setProperty(
    "--primary-600",
    isValidHex6(primaryHex) ? primaryHex.trim() : DEFAULT_PRIMARY_HEX
  );
}

function persistPrimary(primaryHex: string) {
  try {
    localStorage.setItem(APP_PRIMARY_KEY, primaryHex.trim().toLowerCase());
  } catch {
    // ignore
  }
}

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [primaryHex, setPrimaryHexState] = useState(DEFAULT_PRIMARY_HEX);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem(APP_PRIMARY_KEY);
      if (p && isValidHex6(p)) setPrimaryHexState(p.trim());
    } catch {
      /* empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyPrimary(primaryHex);
    persistPrimary(primaryHex);
  }, [primaryHex, hydrated]);

  const setPrimaryHex = useCallback((hex: string) => {
    const h = hex.trim();
    if (isValidHex6(h)) setPrimaryHexState(h);
  }, []);

  const value = useMemo(
    () => ({
      primaryHex,
      setPrimaryHex,
    }),
    [primaryHex, setPrimaryHex]
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error(
      "useThemePreference debe usarse dentro de ThemePreferenceProvider"
    );
  }
  return ctx;
}
