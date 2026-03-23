"use client";

import { useEffect, useState } from "react";

function cssColorToRgb(color: string) {
  const c = color.trim();

  // Hex: #RRGGBB
  const hexMatch = c.match(/^#([0-9a-f]{6})$/i);
  if (hexMatch) {
    const normalized = hexMatch[1];
    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return { r, g, b };
  }

  // rgb(r, g, b) / rgb(r g b)
  const rgbMatch = c.match(
    /^rgba?\(\s*([0-9]{1,3})\s*[,\s]\s*([0-9]{1,3})\s*[,\s]\s*([0-9]{1,3})/
  );
  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1], 10);
    const g = Number.parseInt(rgbMatch[2], 10);
    const b = Number.parseInt(rgbMatch[3], 10);
    return { r, g, b };
  }

  return null;
}

type Props = {
  children: React.ReactNode;
};

export default function DashboardIconTile({ children }: Props) {
  const [iconColor, setIconColor] = useState("var(--primary-800)");

  useEffect(() => {
    const compute = () => {
      const style = getComputedStyle(document.documentElement);
      const p600 = style.getPropertyValue("--primary-600").trim();
      const p800 = style.getPropertyValue("--primary-800").trim();
      const p100 = style.getPropertyValue("--primary-100").trim();
      if (!p600 || !p800 || !p100) return;

      const rgb = cssColorToRgb(p600);
      if (!rgb) return;

      const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
      setIconColor(luminance > 0.55 ? p800 : p100);
    };

    compute();
    // Mantener sincronizado si cambias --primary-600 en globals.css.
    const id = window.setInterval(compute, 500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      role="group"
      className="flex h-16 w-16 items-center justify-center rounded-xl"
      style={{
        backgroundColor: "var(--primary-600)",
        color: iconColor,
      }}
    >
      {children}
    </div>
  );
}
