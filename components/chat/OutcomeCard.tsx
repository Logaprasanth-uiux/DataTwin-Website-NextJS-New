"use client";

import type { DemoOutcome } from "@/lib/chat/types";
import { AllClearGraphic } from "./graphics/AllClearGraphic";
import { OopsGraphic } from "./graphics/OopsGraphic";

// How a run ends when it isn't a normal result. Three parts, always: a one-line headline, the
// artwork, then two or three lines on what happened and what to do next. Errors offer a retry and
// a way out to a different check; "no impact" has no buttons here, the follow-up question below it
// does that job.
export function OutcomeCard({
  outcome,
  title,
  reason,
  onRetry,
  onCheckSomethingElse,
}: {
  outcome: DemoOutcome;
  title: string;
  reason: string;
  onRetry: () => void;
  onCheckSomethingElse: () => void;
}) {
  const isError = outcome !== "no-impact";
  const retryLabel = outcome === "file-error" ? "Fix the file and try again" : "Try again";

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-navy-hairline bg-white px-6 py-8 text-center shadow-soft sm:px-10">
      <h2 className="dt-display max-w-xl text-2xl leading-tight font-semibold tracking-[-0.01em] text-balance text-navy sm:text-[30px]">
        {title}
      </h2>

      <div className="w-full max-w-[520px]">
        {isError ? <OopsGraphic className="h-auto w-full" /> : <AllClearGraphic className="h-auto w-full" />}
      </div>

      <p className="max-w-xl text-[14.5px] leading-relaxed text-balance text-navy-body">{reason}</p>

      {isError && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="dt-button h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90"
          >
            {retryLabel}
          </button>
          <button
            type="button"
            onClick={onCheckSomethingElse}
            className="dt-button h-12 rounded-full border border-navy-hairline px-6 text-[14px] text-navy transition-colors hover:border-accent"
          >
            Check something else
          </button>
        </div>
      )}
    </div>
  );
}
