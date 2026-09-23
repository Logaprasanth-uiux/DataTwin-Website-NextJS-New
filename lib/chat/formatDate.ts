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
