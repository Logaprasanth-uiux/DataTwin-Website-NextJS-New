import type { CustomPeriodRange } from "./types";

// Custom periods are month + year only (no specific day) — `range.from`/`range.to` are "YYYY-MM"
// strings, which also sort/compare correctly as plain strings for validation.
const FORMATTER = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

function formatMonthYear(value: string): string {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return FORMATTER.format(new Date(year, month - 1, 1));
}

export function formatPeriodRange(range: CustomPeriodRange): string {
  return `${formatMonthYear(range.from)} to ${formatMonthYear(range.to)}`;
}

// Short, uppercase "AUG 2026"-style labels for the "Current period" / "Previous period" quick
// options — computed from the real current date (never hardcoded), so they always match whatever
// month it actually is when the user is asked.
const SHORT_MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });

export function getCurrentAndPreviousPeriodLabels(now: Date = new Date()): { current: string; previous: string } {
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return {
    current: SHORT_MONTH_YEAR_FORMATTER.format(now).toUpperCase(),
    previous: SHORT_MONTH_YEAR_FORMATTER.format(previousMonth).toUpperCase(),
  };
}
