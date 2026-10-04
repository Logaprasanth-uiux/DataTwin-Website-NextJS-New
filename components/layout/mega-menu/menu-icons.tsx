import type { MenuIconName } from "./menu-data";

// 24×24 line icons, 1.25px round-cap strokes, currentColor (see DESIGN.md §10).
const PATHS: Record<MenuIconName, string> = {
  overview: "M12 4l8 4-8 4-8-4z M4 12l8 4 8-4 M4 16l8 4 8-4",
  security: "M12 3.5l7 2.8v5.2c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V6.3z M9.5 12.5h5v3.5h-5z M10.5 12.5v-1.2a1.5 1.5 0 013 0v1.2",
  ai: "M11 4l1.8 4.7 4.7 1.8-4.7 1.8L11 17l-1.8-4.7L4.5 10.5l4.7-1.8z M18 15.5v4 M16 17.5h4",
  ap: "M4 6.5h16v11H4z M4 10.5h16 M7.5 14.5h3",
  ar: "M4 13h4l1.5 2.5h5L16 13h4 M4 13l2.5-7h11L20 13v5.5H4z M12 6.5v4.5 M9.8 9.3l2.2 2.2 2.2-2.2",
  tax: "M6 18L18 6 M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M16 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  recon: "M5 8h12l-3-3 M19 16H7l3 3",
  rebate: "M20 12a8 8 0 11-2.4-5.7 M20 4v4.5h-4.5",
  manufacturer: "M4 20V10l5 3V10l5 3V6h6v14z M8 16.5h1 M12 16.5h1 M16 16.5h1",
  distributor: "M3 7h11v9H3z M14 10h4l3 3v3h-7 M7 18.5h.01 M17 18.5h.01",
  payouts: "M4 7.5h14a2 2 0 012 2v8a2 2 0 01-2 2H4z M4 7.5l11-3v3 M16 13.5h1.5",
  commission: "M4 18l5-5 3.5 3.5L20 8 M15 8h5v5",
  fscp: "M4 6.5h16V20H4z M4 10.5h16 M8 4v4 M16 4v4 M9 15l2 2 4-4",
  blog: "M4 20l1-4L16.5 4.5a2 2 0 012.8 2.8L8 18.5z M14.5 6.5l3 3",
  guides: "M4 5.5c3-1 5.5-.5 8 1.5 2.5-2 5-2.5 8-1.5v13c-3-1-5.5-.5-8 1.5-2.5-2-5-2.5-8-1.5z M12 7v13",
  glossary: "M3.5 18l4-11 4 11 M5 14h5 M14.5 18l3-7 3 7 M15.7 15.5h3.6",
  case: "M4 8h16v11H4z M9 8V5.5h6V8 M4 13h16",
  customers: "M9 11a3 3 0 100-6 3 3 0 000 6z M3.5 19a5.5 5.5 0 0111 0 M16 5.5a3 3 0 010 5.5 M17.5 14a5 5 0 013 5",
  kpi: "M5 20v-6 M10 20V8 M15 20v-9 M20 20V5",
  estimator: "M6 3.5h12v17H6z M9 7.5h6 M9 12h.01 M12 12h.01 M15 12h.01 M9 16h.01 M12 16h.01 M15 16h.01",
};

export function MenuIcon({ name, className = "" }: { name: MenuIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M4 6.5l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
