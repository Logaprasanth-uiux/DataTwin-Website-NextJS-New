const PROCESS_STEPS = ["Verification", "Review with DataTwin Team", "Commercial / contract discussion", "Detailed recovery analysis"];

// "Verification" is always the current stage the moment a user lands on this screen — the rest
// are upcoming. There's no later state to advance to within this prototype.
const ACTIVE_STEP_INDEX = 0;

export function HandoffStep({
  active,
  canReveal,
  onPreviewReveal,
}: {
  active: boolean;
  canReveal: boolean;
  onPreviewReveal: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          DataTwin
        </span>
        <p className="text-[15.5px] leading-relaxed text-navy-body">
          You&apos;re one step closer to your recoverable number. We&apos;ve received your details — the DataTwin
          Team will work with you to validate the findings, understand the underlying records and take you
          through the next steps.
        </p>
      </div>

      <div className="rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
        {/* Desktop: one connected horizontal stepper — a hairline runs behind every circle, with
            the segment leading into the active step picked out in accent. */}
        <ol className="hidden sm:grid sm:grid-cols-4 sm:gap-2">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step} className="relative flex flex-col items-center gap-2.5 text-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-3 -left-1/2 h-px w-full ${index <= ACTIVE_STEP_INDEX ? "bg-accent" : "bg-navy-hairline"}`}
                />
              )}
              <span
                className={`relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  index === ACTIVE_STEP_INDEX
                    ? "bg-accent text-navy"
                    : "border border-navy-hairline bg-white text-navy-faint"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`text-[12px] leading-snug font-medium ${index === ACTIVE_STEP_INDEX ? "text-navy" : "text-navy-faint"}`}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>

        {/* Mobile: the same relationship, stacked — a vertical connector runs down the left edge. */}
        <ol className="flex flex-col sm:hidden">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
              {index < PROCESS_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-6 left-3 h-full w-px -translate-x-1/2 ${index < ACTIVE_STEP_INDEX ? "bg-accent" : "bg-navy-hairline"}`}
                />
              )}
              <span
                className={`relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  index === ACTIVE_STEP_INDEX
                    ? "bg-accent text-navy"
                    : "border border-navy-hairline bg-white text-navy-faint"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`pt-0.5 text-[13px] font-medium ${index === ACTIVE_STEP_INDEX ? "text-navy" : "text-navy-faint"}`}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {active && canReveal && (
        <div className="rounded-2xl border border-dashed border-navy-hairline p-5">
          <p className="text-[12.5px] text-navy-faint">
            Prototype note — in the real product this step happens after the DataTwin Team completes validation.
            For this demo, you can preview what the unlocked state looks like.
          </p>
          <button
            type="button"
            onClick={onPreviewReveal}
            className="dt-button mt-3 inline-flex h-11 items-center gap-2 rounded-full border border-navy-hairline px-5 text-[13.5px] font-medium text-navy transition-colors hover:border-accent"
          >
            Preview unlocked recovery analysis (demo)
          </button>
        </div>
      )}

      {active && !canReveal && (
        <p className="text-[12.5px] text-navy-faint">
          Since this was a specialised case, there&apos;s no automated preview here — the DataTwin Team will
          follow up directly with the right next steps.
        </p>
      )}
    </div>
  );
}
