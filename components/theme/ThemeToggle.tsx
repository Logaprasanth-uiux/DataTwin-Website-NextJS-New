"use client";

import { useTheme } from "./useTheme";

// A small floating control, fixed to the bottom-right of the viewport. Both icons are always rendered and
// the CSS (globals.css, "Theme") shows the right one from <html data-theme>, so the icon is correct from
// first paint; only the accessible name waits for hydration.

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="dt-theme-toggle fixed right-4 bottom-4 z-40 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-[16px] sm:right-5 sm:bottom-5"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
        aria-hidden="true"
      >
        <g className="dt-theme-icon dt-theme-icon-moon">
          <path d="M16.5 11.6A6.6 6.6 0 0 1 8.4 3.5a6.6 6.6 0 1 0 8.1 8.1z" />
        </g>
        <g className="dt-theme-icon dt-theme-icon-sun">
          <circle cx="10" cy="10" r="3.2" />
          <path d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.7 4.7l1.3 1.3M14 14l1.3 1.3M4.7 15.3 6 14M14 6l1.3-1.3" />
        </g>
      </svg>
    </button>
  );
}
