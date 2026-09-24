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

const SHORT_MONTH_FORMATTER = new Intl.DateTimeFormat("en-GB", { month: "short" });

// "JUL–SEPT 2026"-style range for the current calendar quarter (Jan–Mar, Apr–Jun, Jul–Sep,
// Oct–Dec) — always computed from the real current date.
export function getCurrentQuarterLabel(now: Date = new Date()): string {
  const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
  const start = new Date(now.getFullYear(), quarterStartMonth, 1);
  const end = new Date(now.getFullYear(), quarterStartMonth + 2, 1);
  return `${SHORT_MONTH_FORMATTER.format(start).toUpperCase()}–${SHORT_MONTH_YEAR_FORMATTER.format(end).toUpperCase()}`;
}

function financialYearLabel(startYear: number): string {
  const start = new Date(startYear, 3, 1); // April
  const end = new Date(startYear + 1, 2, 1); // March of the following year
  return `${SHORT_MONTH_YEAR_FORMATTER.format(start).toUpperCase()}–${SHORT_MONTH_YEAR_FORMATTER.format(end).toUpperCase()}`;
}

// "APR 2026–MAR 2027"-style ranges for the current/previous Indian financial year (April–March),
// always computed from the real current date.
export function getCurrentAndPreviousFinancialYearLabels(now: Date = new Date()): { current: string; previous: string } {
  const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return {
    current: financialYearLabel(fyStartYear),
    previous: financialYearLabel(fyStartYear - 1),
  };
}
