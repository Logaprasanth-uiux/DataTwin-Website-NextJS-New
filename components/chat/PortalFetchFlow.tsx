"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { FileRequirement, PortalFetchStage } from "@/lib/chat/types";
import { MessageTurn } from "./MessageTurn";
import { UserReveal, type RevealTracker } from "./reveal";

const VERIFYING_MS = 1100;
const FETCHING_MS = 1400;

// Mirrors VerificationStep's own "own local timer sequence, call back once at the end" shape:
// the verifying/fetching animation is transient, component-local state, never persisted — only
// the two stages that actually wait on the user (GSTIN, then OTP) are reflected in conversation
// state (`stage`), so a resumed conversation picks up at the right question rather than replaying
// an in-progress mock verification.
//
// The GSTIN and OTP values themselves never leave this component: they're used only to validate
// the local form and are discarded once submitted — neither is ever passed to `onSubmitGstin` /
// `onFetchComplete`, stored in conversation state, or rendered anywhere.
type LocalPhase = "idle" | "verifying" | "fetching";

export function PortalFetchFlow({
  itemKey,
  tracker,
  file,
  stage,
  onSubmitGstin,
  onFetchComplete,
}: {
  itemKey: string;
  tracker: RevealTracker;
  file: FileRequirement;
  stage: PortalFetchStage;
  onSubmitGstin: () => void;
  onFetchComplete: (fileName: string) => void;
}) {
  const [gstin, setGstin] = useState("");
  const [otp, setOtp] = useState("");
  const [localPhase, setLocalPhase] = useState<LocalPhase>("idle");

  const onFetchCompleteRef = useRef(onFetchComplete);
  useEffect(() => {
    onFetchCompleteRef.current = onFetchComplete;
  });

  useEffect(() => {
    if (localPhase === "verifying") {
      const id = window.setTimeout(() => setLocalPhase("fetching"), VERIFYING_MS);
      return () => window.clearTimeout(id);
    }
    if (localPhase === "fetching") {
      const id = window.setTimeout(() => onFetchCompleteRef.current(`${file.name} (via GST Portal)`), FETCHING_MS);
      return () => window.clearTimeout(id);
    }
  }, [localPhase, file.name]);

  const gstinValid = /^[0-9A-Z]{15}$/.test(gstin.trim());
  const otpValid = /^\d{6}$/.test(otp.trim());

  const handleGstinSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!gstinValid) return;
    onSubmitGstin();
  };

  const handleOtpSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!otpValid) return;
    setLocalPhase("verifying");
  };

  if (stage === "gstin") {
    return (
      <div className="flex flex-col gap-3">
        <MessageTurn
          speaker="DataTwin"
          text={
            "Smart choice! Let's pull your GSTR-2B directly from the portal so you don't have to download anything manually.\n\nPlease enter your 15-digit GST Number (GSTIN) below to get started:"
          }
        />
        <form
          onSubmit={handleGstinSubmit}
          className="flex flex-col gap-2.5 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft sm:flex-row sm:items-end"
        >
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-navy-muted">GSTIN</span>
            <input
              type="text"
              value={gstin}
              onChange={(event) => setGstin(event.target.value.toUpperCase())}
              maxLength={15}
              placeholder="22AAAAA0000A1Z5"
              autoComplete="off"
              className="h-12 rounded-xl border border-navy-hairline bg-white px-4 font-mono text-[14px] tracking-wide text-navy placeholder:font-sans placeholder:text-navy-faint focus:border-accent focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={!gstinValid}
            className="dt-button h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </form>
        <p className="text-[12px] text-navy-faint">
          Your GSTIN is used only to securely retrieve the requested GST information.
        </p>
      </div>
    );
  }

  // stage === "otp" — GSTIN already submitted (never shown), acknowledged with a masked "You"
  // turn rather than the real value.
  return (
    <div className="flex flex-col gap-3">
      <UserReveal itemKey={`${itemKey}:gstin-submitted`} tracker={tracker}>
        <MessageTurn speaker="You" text="GSTIN submitted" />
      </UserReveal>
      <MessageTurn speaker="DataTwin" text="Got it — your GSTIN has been received." />

      {localPhase === "idle" && (
        <>
          <MessageTurn
            speaker="DataTwin"
            text={
              "Thanks! We've triggered a secure 1-time verification request with the GST Portal.\n\nPlease enter the OTP sent to your GST-registered mobile number/email."
            }
          />
          <form
            onSubmit={handleOtpSubmit}
            className="flex flex-col gap-2.5 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft sm:flex-row sm:items-end"
          >
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-navy-muted">OTP</span>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                maxLength={6}
                placeholder="6-digit code"
                autoComplete="off"
                className="h-12 rounded-xl border border-navy-hairline bg-white px-4 font-mono text-[14px] tracking-[0.2em] text-navy placeholder:font-sans placeholder:tracking-normal placeholder:text-navy-faint focus:border-accent focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={!otpValid}
              className="dt-button h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Verify
            </button>
          </form>
          <p className="text-[12px] text-navy-faint">
            For your security, this OTP is used only to complete this one-time verification and is never stored or
            shared.
          </p>
        </>
      )}

      {localPhase === "verifying" && (
        <div className="flex items-center gap-2.5 text-[13.5px] text-navy-muted">
          <SpinnerIcon className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-accent" />
          Verifying with the GST Portal…
        </div>
      )}

      {localPhase === "fetching" && (
        <MessageTurn
          speaker="DataTwin"
          text="Verified! ⚡ Fetching your official GSTR-2B statement directly from the portal now..."
        />
      )}
    </div>
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
