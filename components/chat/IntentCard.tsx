"use client";

import { MessageTurn } from "./MessageTurn";
import { UserReveal, type RevealTracker } from "./reveal";

// "Here's what I understood" — shown once a reconciliation is identified, before anything is asked
// of the user. Confirming moves on to the period question; "Not quite" reopens discovery.
export function IntentCard({
  itemKey,
  tracker,
  label,
  userWords,
  problem,
  intent,
  checks,
  resolved,
  onConfirm,
  onReject,
}: {
  itemKey: string;
  tracker: RevealTracker;
  label: string;
  userWords: string | null;
  problem: string;
  intent: string;
  checks: string[];
  resolved: boolean;
  onConfirm: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <MessageTurn speaker="DataTwin" text="Here's what I understood so far." />

      <div className="flex flex-col gap-5 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft">
        <div>
          <p className="dt-eyebrow dt-eyebrow-accent">{label}</p>
          {userWords && (
            <p className="mt-2 text-[13px] leading-relaxed text-navy-faint">
              You said: &ldquo;{userWords}&rdquo;
            </p>
          )}
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-faint uppercase">Your problem</p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-navy">{problem}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-faint uppercase">What you&apos;re after</p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-navy">{intent}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-faint uppercase">What I&apos;ll check</p>
          <ul className="mt-2 flex flex-col gap-2">
            {checks.map((check) => (
              <li key={check} className="flex gap-2.5 text-[14px] leading-relaxed text-navy-body">
                <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {check}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!resolved && (
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onConfirm}
            className="dt-button h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90"
          >
            Yes, that&apos;s right
          </button>
          <button
            type="button"
            onClick={onReject}
            className="text-[13.5px] font-medium text-navy-muted underline decoration-navy-hairline underline-offset-4 transition-colors hover:text-navy"
          >
            Not quite
          </button>
        </div>
      )}

      {resolved && (
        <UserReveal itemKey={`${itemKey}:confirmed`} tracker={tracker}>
          <MessageTurn speaker="You" text="Yes, that's right." />
        </UserReveal>
      )}
    </div>
  );
}
