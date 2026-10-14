"use client";

import { useTheme } from "./useTheme";

// The theme switch, inline in the site header and the chat header, sized to match the header's pill
// button. Both icons are always rendered and the CSS (globals.css, "Theme") shows the right one from
// <html data-theme>, so the icon is correct from first paint; only the accessible name waits for hydration.
export function HeaderThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-navy-hairline text-navy transition-colors duration-200 hover:border-accent hover:bg-accent/[0.07] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <ThemeIcon />
    </button>
  );
}

function ThemeIcon() {
  return (
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
  );
}
