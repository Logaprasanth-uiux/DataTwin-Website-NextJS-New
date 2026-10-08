"use client";

import { useEffect, useRef, useState } from "react";
import { ControlsArt, SecIcon, type SecIconName } from "./SecurityArt";
import { CONTROLS } from "./security-page-data";

const TAB_ICON: Record<string, SecIconName> = {
  rbac: "roles",
  encryption: "lock",
  audit: "chain",
  operations: "cycle",
};

// One control group at a time: a vertical tab list on desktop, a scrolling pill row on phones. Each panel
// leads with its own picture, then the plain-language lead and every bullet.
export function ControlsTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const switched = useRef(false);
  const groups = CONTROLS.groups;

  function select(i: number) {
    switched.current = true;
    setActive(i);
  }

  // A new panel opens at its top. If the reader had scrolled down the previous one, bring the new panel's top
  // back to where the sticky tab list sits (desktop) or just under the tab row (phones), instead of leaving
  // them at the bottom of a different panel. Nothing moves when the panel's top is already in view.
  useEffect(() => {
    if (!switched.current) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const target = desktop ? panelRefs.current[active] : listRef.current;
    if (!target) return;
    const offset = desktop ? 128 : 96;
    const top = target.getBoundingClientRect().top;
    if (top >= offset) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: window.scrollY + top - offset, behavior: reduced ? "auto" : "smooth" });
  }, [active]);

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const last = groups.length - 1;
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    select(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Controls"
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:-mx-8 sm:px-8 lg:sticky lg:top-32 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-3 lg:self-start lg:overflow-visible lg:px-0"
      >
        {groups.map((g, i) => {
          const on = i === active;
          return (
            <button
              key={g.kind}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`controls-tab-${g.kind}`}
              aria-selected={on}
              aria-controls={`controls-panel-${g.kind}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`group flex flex-shrink-0 items-center gap-4 rounded-full border px-4 py-3 text-left transition-colors lg:rounded-[22px] lg:px-6 lg:py-5 ${
                on
                  ? "border-navy bg-navy text-white"
                  : "border-navy-hairline bg-white/70 text-navy hover:border-accent"
              }`}
            >
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border lg:h-11 lg:w-11 ${
                  on ? "border-accent/60 text-accent" : "border-navy-hairline bg-white text-navy"
                }`}
              >
                <SecIcon name={TAB_ICON[g.kind]} className="h-[18px] w-[18px] lg:h-[22px] lg:w-[22px]" />
              </span>
              <span>
                <span className={`hidden text-[11px] font-semibold tracking-[0.14em] lg:block ${on ? "text-accent" : "text-crimson"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="dt-display text-[14px] leading-tight font-semibold whitespace-nowrap lg:text-[1.1875rem] lg:whitespace-normal">
                  {g.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-8">
        {groups.map((g, i) => (
          <div
            key={g.kind}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            role="tabpanel"
            id={`controls-panel-${g.kind}`}
            aria-labelledby={`controls-tab-${g.kind}`}
            hidden={i !== active}
            className="sp-tab-panel overflow-hidden rounded-[28px] border border-navy-hairline bg-white"
          >
            <div className="border-b border-navy-divider bg-cream-50 px-4 py-6 text-navy sm:px-8 sm:py-8">
              <ControlsArt kind={g.kind} className="mx-auto h-auto w-full max-w-[560px]" />
            </div>
            <div className="p-6 sm:p-9">
              <h3 className="dt-display text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em] text-navy sm:text-[1.875rem]">{g.title}</h3>
              <p className="mt-4 max-w-3xl text-[16.5px] leading-[1.65] text-navy">{g.lead}</p>
              <ul className="mt-6 space-y-3.5 border-t border-navy-divider pt-6">
                {g.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[15px] leading-[1.6] text-navy-body">
                    <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
