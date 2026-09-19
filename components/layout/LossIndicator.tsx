"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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

// The full "Stop the leakage" reveal needs more horizontal room than the
// gap between the nav links and this control has below `xl` — verified by
// measuring layout at 1024/1280/1440px. Below `xl`, hover/tap only shifts
// color; above it, the control also grows to reveal the CTA.
export function LossIndicator() {
  const [loss, setLoss] = useState(INITIAL_LOSS);
  const [expanded, setExpanded] = useState(false);
  const displayedLoss = useTweenedNumber(loss, TWEEN_MS);
  const currencyKey = useSyncExternalStore(subscribeNever, detectCurrencyKey, getKeyOnServer);
  const formatter = useMemo(() => createCurrencyFormatter(currencyKey ?? "en-US|USD"), [currencyKey]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLoss((prev) => prev + LOSS_PER_TICK + (Math.random() * 2 - 1) * LOSS_JITTER);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const formatted = formatter.format(-displayedLoss);

  return (
    // Fixed-footprint wrapper: the flex layout only ever sees this stable
    // size, so the button growing inside it can never shift the nav links.
    <div className="relative h-9 w-[136px] flex-shrink-0 sm:w-[150px]">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        onBlur={() => setExpanded(false)}
        data-expanded={expanded}
        aria-expanded={expanded}
        aria-label={currencyKey ? `Illustrative loss, ${formatted}. Stop the leakage.` : "Stop the leakage"}
        title="Illustrative example — not live customer data"
        className="group absolute right-0 top-0 flex h-9 max-w-[136px] items-center gap-2 overflow-hidden rounded-full border border-navy-hairline px-3 transition-all duration-300 hover:border-navy-faint focus:border-navy-faint data-[expanded=true]:border-navy-faint sm:max-w-[150px] xl:hover:max-w-[300px] xl:focus:max-w-[300px] xl:data-[expanded=true]:max-w-[300px]"
      >
        <TrendIcon className="h-4 w-4 flex-shrink-0 text-loss" />
        <span
          className={`flex-shrink-0 whitespace-nowrap text-sm font-medium tabular-nums text-loss transition-opacity duration-300 ${
            currencyKey ? "opacity-100" : "opacity-0"
          }`}
        >
          {formatted}
        </span>

        <span className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap opacity-0 transition-opacity duration-300 xl:group-hover:opacity-100 xl:group-focus:opacity-100 xl:group-data-[expanded=true]:opacity-100">
          <span aria-hidden="true" className="h-3.5 w-px flex-shrink-0 bg-navy-hairline" />
          <span className="text-sm font-medium text-accent">Stop the leakage</span>
          <ArrowIcon className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
        </span>
      </button>
    </div>
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
