"use client";

import { useState } from "react";
import { CloseDashboard, PreventDashboard, RecoveryDashboard } from "./DashboardPanels";

// One dashboard at a time, chosen from three tabs, so the section stays compact and each product reads as
// its own answer to a different question. Arrow keys move between tabs (roving tabindex).

const TABS = [
  { id: "recover", product: "DARP", scope: "Discover, Assess, Recover", question: "What is recoverable, and where each finding stands", Panel: RecoveryDashboard },
  { id: "prevent", product: "DARP", scope: "Prevent", question: "What was stopped before it posted, and is the leak closing", Panel: PreventDashboard },
  { id: "fscp", product: "FSCP", scope: "Financial close", question: "Which KPIs are breaching, and can you sign off", Panel: CloseDashboard },
] as const;

export function DashboardShowcase() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    setActive(next);
    document.getElementById(`dash-tab-${TABS[next].id}`)?.focus();
  }

  return (
    <div className="rounded-[28px] border border-navy-hairline bg-white shadow-[0_24px_60px_-32px_rgba(4,30,60,0.25)]">
      <div
        role="tablist"
        aria-label="Illustrative dashboards"
        onKeyDown={onKeyDown}
        className="grid gap-2 border-b border-navy-divider p-3 sm:grid-cols-3 sm:p-4"
      >
        {TABS.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.id}
              id={`dash-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="dash-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`rounded-[18px] border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selected ? "border-navy bg-navy text-white" : "border-transparent text-navy hover:bg-cream-100"
              }`}
            >
              <span className={`block text-[11px] font-semibold tracking-[0.14em] uppercase ${selected ? "text-accent" : "text-navy-muted"}`}>
                {t.product}
              </span>
              <span className="mt-1 block text-[15px] font-semibold">{t.scope}</span>
            </button>
          );
        })}
      </div>

      <div id="dash-panel" role="tabpanel" aria-labelledby={`dash-tab-${tab.id}`} className="p-3 sm:p-6 lg:p-8">
        <p className="dt-display px-2 pb-5 text-[1.125rem] leading-snug font-semibold tracking-[-0.01em] text-navy sm:px-0 sm:pb-6 sm:text-[1.25rem]">
          {tab.question}
        </p>
        <tab.Panel />
      </div>
    </div>
  );
}
