"use client";

import { useEffect, useRef, useState } from "react";
import { VERIFICATION_STEPS } from "@/lib/chat/types";

const STEP_INTERVAL_MS = 650;

export function VerificationStep({ onComplete }: { onComplete: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // `onComplete` gets a fresh identity on every parent render (it closes over conversation
  // state). Keeping only the latest one in a ref — and keying the effect on `activeIndex` alone —
  // means the step sequence advances/completes exactly once, instead of re-firing `onComplete`
  // (and stomping whatever phase the user has since moved to) every time the parent re-renders
  // after this step has already finished.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (activeIndex >= VERIFICATION_STEPS.length) {
      const id = window.setTimeout(() => onCompleteRef.current(), 500);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setActiveIndex((prev) => prev + 1), STEP_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [activeIndex]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        DataTwin
      </span>
      <div className="mt-1 flex flex-col gap-2.5 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft">
        {VERIFICATION_STEPS.map((step, index) => {
          const done = index < activeIndex;
          const active = index === activeIndex;
          return (
            <div
              key={step}
              className={`flex items-center gap-3 text-[13.5px] transition-opacity duration-300 ${
                done || active ? "opacity-100" : "opacity-35"
              }`}
            >
              {done ? (
                <CheckIcon className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
              ) : active ? (
                <SpinnerIcon className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-accent" />
              ) : (
                <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-navy-hairline" />
              )}
              <span className={done ? "text-navy" : active ? "font-medium text-navy" : "text-navy-faint"}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
