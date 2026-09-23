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
    "h-11 flex-1 rounded-lg border border-navy-hairline bg-white px-3 text-[14px] text-navy focus:border-accent focus:outline-none";

  return (
    <div className="flex flex-col gap-3">
      <MessageTurn speaker="DataTwin" text="Sure — what period should I look at? A start and end month is all I need." />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft"
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-navy-muted">Start</span>
          <div className="flex gap-2.5">
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
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-navy-muted">End</span>
          <div className="flex gap-2.5">
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
          </div>
        </div>

        <button
          type="submit"
          disabled={!valid}
          className="dt-button h-11 w-fit rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
