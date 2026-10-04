"use client";

import { useState, type FormEvent } from "react";
import type { CustomPeriodRange, PeriodMode } from "@/lib/chat/types";
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

// Monthly: one month. Annual: one financial year (April to March), stored as that April..March range.
function financialYearOptions(): { start: number; label: string }[] {
  const now = new Date();
  const currentStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return Array.from({ length: 6 }, (_, i) => {
    const start = currentStart - i;
    return { start, label: `FY ${start}-${String(start + 1).slice(-2)}` };
  });
}

export function CustomPeriodInput({
  mode,
  itemKey,
  tracker,
  resolved,
  value,
  onSubmit,
}: {
  mode: PeriodMode;
  itemKey: string;
  tracker: RevealTracker;
  resolved: boolean;
  value: CustomPeriodRange | null;
  onSubmit: (range: CustomPeriodRange) => void;
}) {
  const years = yearOptions();
  const fyOptions = financialYearOptions();
  const [fromMonth, setFromMonth] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [fyStart, setFyStart] = useState("");

  if (resolved && value) {
    return (
      <div className="flex flex-col gap-3">
        <MessageTurn speaker="DataTwin" text={mode === "annual" ? "Sure — which financial year should I look at?" : "Sure — which month should I look at?"} />
        <UserReveal itemKey={`${itemKey}:resolved`} tracker={tracker}>
          <MessageTurn speaker="You" text={formatPeriodRange(value)} />
        </UserReveal>
      </div>
    );
  }

  const month = fromYear && fromMonth ? `${fromYear}-${pad2(fromMonth)}` : "";
  const valid = mode === "annual" ? Boolean(fyStart) : Boolean(month);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    if (mode === "annual") {
      const start = Number(fyStart);
      onSubmit({ from: `${start}-04`, to: `${start + 1}-03` });
    } else {
      onSubmit({ from: month, to: month });
    }
  };

  const selectClass =
    "h-9 rounded-lg border border-navy-hairline bg-white px-2.5 text-[13px] text-navy focus:border-accent focus:outline-none";

  return (
    <div className="flex flex-col gap-3">
      <MessageTurn
        speaker="DataTwin"
        text={mode === "annual" ? "Sure — which financial year should I look at?" : "Sure — which month should I look at?"}
      />
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        {mode === "annual" ? (
          <select
            value={fyStart}
            onChange={(event) => setFyStart(event.target.value)}
            className={selectClass}
            aria-label="Financial year"
          >
            <option value="" disabled>
              Financial year
            </option>
            {fyOptions.map((option) => (
              <option key={option.start} value={option.start}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <>
            <select
              value={fromMonth}
              onChange={(event) => setFromMonth(event.target.value)}
              className={selectClass}
              aria-label="Month"
            >
              <option value="" disabled>
                Month
              </option>
              {MONTHS.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={fromYear}
              onChange={(event) => setFromYear(event.target.value)}
              className={selectClass}
              aria-label="Year"
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
          </>
        )}

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
