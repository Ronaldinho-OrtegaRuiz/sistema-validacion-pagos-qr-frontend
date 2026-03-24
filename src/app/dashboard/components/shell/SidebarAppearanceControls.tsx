"use client";

import { useThemePreference } from "@/components/ThemePreferenceProvider";

export default function SidebarAppearanceControls() {
  const { primaryHex, setPrimaryHex } = useThemePreference();

  return (
    <div
      className="mt-auto flex shrink-0 items-center gap-3 border-t pt-4"
      style={{ borderColor: "var(--primary-200)" }}
    >
      <label
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
        title="Color principal de la app"
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
            borderColor: "var(--primary-300)",
            maxWidth: "4.5rem",
          }}
        />
      </label>
    </div>
  );
}
