"use client";

import DashboardIconTile from "./DashboardIconTile";

export default function DashboardTiles() {
  return (
    <div className="flex flex-col gap-4 items-start">
      <DashboardIconTile>
        <svg
          width="26"
          height="26"
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
      </DashboardIconTile>

      <DashboardIconTile>
        <svg
          width="26"
          height="26"
          viewBox="0 0 16 15"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14.5,14V3h-4V0h-5v9h-4v5H0v1h1.5h4h1h3h1h4H16v-1H14.5z M2.5,14v-4h3v4H2.5z M6.5,14V9V1h3v2v11H6.5z M10.5,14V4h3v10  H10.5z"
            fill="currentColor"
          />
        </svg>
      </DashboardIconTile>
    </div>
  );
}

