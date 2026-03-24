"use client";

import { useThemePreference } from "@/components/ThemePreferenceProvider";

function IconMoon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SidebarAppearanceControls() {
  const { theme, toggleTheme, primaryHex, setPrimaryHex } = useThemePreference();

  return (
    <div
      className="mt-auto flex shrink-0 items-center gap-3 border-t pt-4"
      style={{ borderColor: "var(--primary-200)" }}
    >
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={
          theme === "light" ? "Activar modo oscuro" : "Activar modo claro"
        }
        title={theme === "light" ? "Modo oscuro (tonos según tu color)" : "Modo claro"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-colors"
        style={{
          borderColor: "var(--primary-200)",
          color: "var(--primary-700)",
          backgroundColor: "var(--primary-100)",
        }}
      >
        {theme === "light" ? <IconMoon /> : <IconSun />}
      </button>
      <label
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
        title="Color principal (claro y oscuro se calculan a partir de él)"
      >
        <span
          className="text-xs font-semibold whitespace-nowrap"
          style={{ color: "var(--primary-700)" }}
        >
          Color
        </span>
        <input
          type="color"
          value={primaryHex}
          onChange={(e) => setPrimaryHex(e.target.value)}
          aria-label="Color primario de la aplicación"
          className="h-10 min-w-0 flex-1 cursor-pointer rounded-lg border-2 bg-transparent p-1"
          style={{
            borderColor: "var(--primary-200)",
            maxWidth: "4.5rem",
          }}
        />
      </label>
    </div>
  );
}
