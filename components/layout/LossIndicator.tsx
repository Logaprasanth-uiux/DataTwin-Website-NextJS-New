"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useChatLaunch } from "@/components/chat/useChatLaunch";
import { createCurrencyFormatter, detectCurrencyKey } from "@/lib/currency";

// Illustrative pacing only — not a live customer metric. The amount is a plain,
// currency-agnostic number of accumulated loss; swap it for real approved DataTwin
// data (or remove the animation) when that's available.
const INITIAL_LOSS = 54883.7;
const LOSS_PER_TICK = 0.35;
const LOSS_JITTER = 0.03;
const TICK_MS = 1200;
const TWEEN_MS = 700;

const subscribeNever = () => () => {};
const getKeyOnServer = (): string | null => null;

// Eases the displayed number toward `target` so each increase reads as movement, not a jump.
function useTweenedNumber(target: number, durationMs: number) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    const from = displayRef.current;
    const start = performance.now();
    const id = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      displayRef.current = from + (target - from) * eased;
      setDisplay(displayRef.current);
      if (progress === 1) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [target, durationMs]);

  return display;
}

// A persistent micro-CTA: a financial signal that is also an action. The whole thing is one link to the
// contact section, and it reads without hover.
// - From xl (1280px) it is one line: "Stop the leakage →" then the loss pill. Verified to fit between the
//   nav links and the right edge at 1280/1440.
// - Below xl (where the nav links, or the menu button, leave less room) it is a compact two-level stack:
//   the label above, the pill below. The stack is sized to the footprint the old button had (136px on
//   phones, 150px from sm), so the header does not get more crowded.
// The pill holds the trend-loss icon, an organisation icon (this is the organisation's leakage) and the
// running loss. Hover only strengthens the relationship (border and arrow), it is not needed to understand it.
export function LossIndicator() {
  const [loss, setLoss] = useState(INITIAL_LOSS);
  const displayedLoss = useTweenedNumber(loss, TWEEN_MS);
  const currencyKey = useSyncExternalStore(subscribeNever, detectCurrencyKey, getKeyOnServer);
  const formatter = useMemo(() => createCurrencyFormatter(currencyKey ?? "en-US|USD"), [currencyKey]);
  const { onClick, modal } = useChatLaunch("leakage");

  useEffect(() => {
    const id = window.setInterval(() => {
      setLoss((prev) => prev + LOSS_PER_TICK + (Math.random() * 2 - 1) * LOSS_JITTER);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const formatted = formatter.format(-displayedLoss);

  return (
    <>
      <a
        href="#contact"
        onClick={(event) => {
          event.preventDefault();
          onClick();
        }}
        aria-label={currencyKey ? `Stop the leakage. Illustrative loss so far, ${formatted}.` : "Stop the leakage"}
        title="Illustrative example — not live customer data"
        className="group flex flex-shrink-0 flex-col items-start gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent xl:flex-row xl:items-center xl:gap-3"
      >
        <span className="flex items-center gap-1.5 pl-1 text-[11px] leading-none font-semibold tracking-[0.01em] whitespace-nowrap text-navy xl:pl-0 xl:text-[13px]">
          Stop the leakage
          <ArrowIcon className="h-3 w-3 flex-shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5 xl:h-3.5 xl:w-3.5" />
        </span>

        <span className="flex h-7 items-center gap-1.5 rounded-full border border-navy-hairline px-2.5 transition-colors duration-200 group-hover:border-accent group-hover:bg-accent/[0.07] sm:h-8 sm:gap-2 sm:px-3 xl:h-9">
          <TrendIcon className="h-3.5 w-3.5 flex-shrink-0 text-loss sm:h-4 sm:w-4" />
          <OrgIcon className="h-3.5 w-3.5 flex-shrink-0 text-navy-muted sm:h-4 sm:w-4" />
          <span
            className={`text-[12px] leading-none font-medium whitespace-nowrap tabular-nums text-loss transition-opacity duration-300 sm:text-sm ${
              currencyKey ? "opacity-100" : "opacity-0"
            }`}
          >
            {formatted}
          </span>
        </span>
      </a>
      {modal}
    </>
  );
}

function TrendIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M2.5 5l4 4.5 2.5-2.5 3 3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11h3v-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A small office building: the organisation whose money is leaking.
function OrgIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 14h12M3.5 14V3h6v11M9.5 6.5H12.5V14M5.5 5.5h2M5.5 8h2M5.5 10.5h2M11 9h.01M11 11.5h.01"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
