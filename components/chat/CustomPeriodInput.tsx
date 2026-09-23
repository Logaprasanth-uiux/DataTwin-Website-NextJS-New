"use client";

import { useState, type FormEvent } from "react";
import type { CustomPeriodRange } from "@/lib/chat/types";
import { formatPeriodRange } from "@/lib/chat/formatDate";
import { MessageTurn } from "./MessageTurn";
import { UserReveal, type RevealTracker } from "./reveal";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Last 6 years including the current one — plenty of runway for a GST/finance period lookback
// without asking the user to scroll through decades.
function yearOptions(): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => current - i);
}

function pad2(value: string): string {
  return value.padStart(2, "0");
}

export function CustomPeriodInput({
  itemKey,
  tracker,
  resolved,
  value,
  onSubmit,
}: {
  itemKey: string;
  tracker: RevealTracker;
  resolved: boolean;
  value: CustomPeriodRange | null;
  onSubmit: (range: CustomPeriodRange) => void;
}) {
  const years = yearOptions();
  const [fromMonth, setFromMonth] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [toYear, setToYear] = useState("");

  if (resolved && value) {
    return (
      <div className="flex flex-col gap-3">
        <MessageTurn speaker="DataTwin" text="Sure — what period should I look at?" />
        <UserReveal itemKey={`${itemKey}:resolved`} tracker={tracker}>
          <MessageTurn speaker="You" text={formatPeriodRange(value)} />
        </UserReveal>
      </div>
    );
  }

  const from = fromYear && fromMonth ? `${fromYear}-${pad2(fromMonth)}` : "";
  const to = toYear && toMonth ? `${toYear}-${pad2(toMonth)}` : "";
  const valid = Boolean(from && to && from <= to);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onSubmit({ from, to });
  };

  const selectClass =
    "h-9 rounded-lg border border-navy-hairline bg-white px-2.5 text-[13px] text-navy focus:border-accent focus:outline-none";

  return (
    <div className="flex flex-col gap-3">
      <MessageTurn speaker="DataTwin" text="Sure — what period should I look at? A start and end month is all I need." />
      {/* A single compact row rather than a bordered card with "Start"/"End" sections — this is a
          quick conversational pick (four small selects + confirm), not a form. */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <select
          value={fromMonth}
          onChange={(event) => setFromMonth(event.target.value)}
          className={selectClass}
          aria-label="Start month"
        >
          <option value="" disabled>
            Month
          </option>
          {MONTHS.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={fromYear}
          onChange={(event) => setFromYear(event.target.value)}
          className={selectClass}
          aria-label="Start year"
        >
          <option value="" disabled>
            Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <span aria-hidden="true" className="px-0.5 text-[13px] text-navy-faint">
          →
        </span>

        <select
          value={toMonth}
          onChange={(event) => setToMonth(event.target.value)}
          className={selectClass}
          aria-label="End month"
        >
          <option value="" disabled>
            Month
          </option>
          {MONTHS.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={toYear}
          onChange={(event) => setToYear(event.target.value)}
          className={selectClass}
          aria-label="End year"
        >
          <option value="" disabled>
            Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!valid}
          className="dt-button h-9 rounded-full bg-navy px-4 text-[13px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
