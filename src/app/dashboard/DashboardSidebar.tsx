"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconBag() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M27,29H5V17H3.235c-1.138,0-1.669-1.419-0.812-2.168L14.131,3.745c1.048-0.993,2.689-0.993,3.737,0l11.707,11.087  C30.433,15.58,29.902,17,28.763,17H27V29z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={2}
      />
      <path
        d="M20,29h-8v-6c0-2.209,1.791-4,4-4h0c2.209,0,4,1.791,4,4V29z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={2}
      />
    </svg>
  );
}

function IconStats() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 16 15"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14.5,14V3h-4V0h-5v9h-4v5H0v1h1.5h4h1h3h1h4H16v-1H14.5z M2.5,14v-4h3v4H2.5z M6.5,14V9V1h3v2v11H6.5z M10.5,14V4h3v10  H10.5z"
        fill="currentColor"
      />
    </svg>
  );
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export default function DashboardSidebar({
  onRequestClose,
}: {
  onRequestClose?: () => void;
}) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/dashboard", label: "Inicio", icon: <IconBag /> },
    { href: "/dashboard/stats", label: "Estadísticas", icon: <IconStats /> },
  ];

  const isSelected = (href: string) => {
    if (href === "/dashboard") return pathname === "/" || pathname === href;
    return pathname === href;
  };

  return (
    <aside
      className="flex h-full w-64 flex-col px-4 py-6"
      style={{
        // “Más claro” que el primary, pero que no sea tan blanco como el fondo.
        backgroundColor: "color-mix(in srgb, var(--primary-200) 35%, white)",
        fontFamily: "var(--font-sidebar-body)",
      }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="px-2">
          <div
            className="leading-none tracking-wider"
            style={{
              fontFamily: "var(--font-sidebar-title)",
              color: "var(--primary-700)",
              fontSize: "28px",
            }}
          >
            <div>DROGUERIAS</div>
            <div className="-mt-2">ORTEGA</div>
          </div>
        </div>

        {onRequestClose ? (
          <button
            type="button"
            onClick={onRequestClose}
            aria-label="Cerrar sidebar"
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg p-0 transition-colors"
            style={{ color: "var(--primary-700)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {items.map((it) => {
          const selected = isSelected(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
              style={{
                backgroundColor: selected ? "var(--primary-600)" : "transparent",
                color: selected ? "white" : "var(--primary-700)",
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{ color: selected ? "white" : "var(--primary-700)" }}
              >
                {it.icon}
              </span>
              <span className="text-sm font-medium">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

