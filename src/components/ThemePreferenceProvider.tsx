"use client";

import {
  APP_PRIMARY_KEY,
  APP_THEME_KEY,
  DEFAULT_PRIMARY_HEX,
  type AppTheme,
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
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  toggleTheme: () => void;
  primaryHex: string;
  setPrimaryHex: (hex: string) => void;
};

const ThemePreferenceContext =
  createContext<ThemePreferenceContextValue | null>(null);

function applyDom(theme: AppTheme, primaryHex: string) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.setProperty(
    "--primary-600",
    isValidHex6(primaryHex) ? primaryHex.trim() : DEFAULT_PRIMARY_HEX
  );
}

function persist(theme: AppTheme, primaryHex: string) {
  try {
    localStorage.setItem(APP_THEME_KEY, theme);
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
  const [theme, setThemeState] = useState<AppTheme>("light");
  const [primaryHex, setPrimaryHexState] = useState(DEFAULT_PRIMARY_HEX);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem(APP_THEME_KEY);
      const p = localStorage.getItem(APP_PRIMARY_KEY);
      if (t === "dark" || t === "light") setThemeState(t);
      if (p && isValidHex6(p)) setPrimaryHexState(p.trim());
    } catch {
      /* empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyDom(theme, primaryHex);
    persist(theme, primaryHex);
  }, [theme, primaryHex, hydrated]);

  const setTheme = useCallback((t: AppTheme) => {
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((x) => (x === "light" ? "dark" : "light"));
  }, []);

  const setPrimaryHex = useCallback((hex: string) => {
    const h = hex.trim();
    if (isValidHex6(h)) setPrimaryHexState(h);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      primaryHex,
      setPrimaryHex,
    }),
    [theme, setTheme, toggleTheme, primaryHex, setPrimaryHex]
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
