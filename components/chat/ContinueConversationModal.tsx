"use client";

import { useEffect, useRef } from "react";
import type { ConversationSummary } from "@/lib/chat/types";

export function ContinueConversationModal({
  conversation,
  onContinue,
  onStartNew,
  onClose,
}: {
  conversation: ConversationSummary;
  onContinue: () => void;
  onStartNew: () => void;
  onClose: () => void;
}) {
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    continueRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/40 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="continue-modal-title"
      onClick={onClose}
    >
      <div
        className="dt-fade-up w-full max-w-md rounded-2xl border border-navy-hairline bg-white p-7 shadow-soft sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="dt-eyebrow dt-eyebrow-accent">Welcome back</p>
        <h2 id="continue-modal-title" className="dt-display mt-3 text-2xl font-semibold tracking-[-0.01em] text-navy">
          Continue where you left off?
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-navy-body">
          We found an earlier conversation — <span className="font-medium text-navy">“{conversation.title}”</span>.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            ref={continueRef}
            type="button"
            onClick={onContinue}
            className="dt-button h-12 flex-1 rounded-full bg-navy px-5 text-[14px] text-white transition-colors hover:bg-navy/90"
          >
            Continue previous conversation
          </button>
          <button
            type="button"
            onClick={onStartNew}
            className="dt-button h-12 flex-1 rounded-full border border-navy-hairline px-5 text-[14px] text-navy transition-colors hover:border-accent"
          >
            Start a new conversation
          </button>
        </div>
      </div>
    </div>
  );
}
