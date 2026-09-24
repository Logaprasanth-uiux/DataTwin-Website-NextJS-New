"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ContactDetails } from "@/lib/chat/types";

const VERIFYING_MS = 900;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The overlay form shown on top of the blurred Executive Summary (see ResultStep) — mirrors
// ContactFormStep's fields plus PortalFetchFlow's own OTP mock pattern (the code itself is never
// persisted or passed anywhere, only used to enable the button). Two stages, driven by whether
// `contact` (conversation state) has been submitted yet: name/work email/phone, then OTP.
export function SummaryAccessGate({
  contact,
  onSubmitContact,
  onVerifyOtp,
}: {
  contact: ContactDetails | null;
  onSubmitContact: (contact: ContactDetails) => void;
  onVerifyOtp: () => void;
}) {
  if (!contact) {
    return <ContactStage onSubmitContact={onSubmitContact} />;
  }
  return <OtpStage email={contact.email} onVerifyOtp={onVerifyOtp} />;
}

function ContactStage({ onSubmitContact }: { onSubmitContact: (contact: ContactDetails) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const valid = name.trim().length > 1 && EMAIL_PATTERN.test(email) && phone.trim().length >= 6;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onSubmitContact({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="dt-fade-up flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft"
    >
      <div>
        <p className="dt-eyebrow dt-eyebrow-accent">Verify to view</p>
        <p className="mt-2 text-[15px] font-medium text-navy">See your Executive Summary</p>
        <p className="mt-1 text-[13px] leading-relaxed text-navy-body">
          A few quick details so we can securely retrieve and confirm this reconciliation&apos;s summary.
        </p>
      </div>

      <GateField label="Name">
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
        />
      </GateField>
      <GateField label="Work email">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
        />
      </GateField>
      <GateField label="Phone number">
        <input
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
          className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
        />
      </GateField>

      <button
        type="submit"
        disabled={!valid}
        className="dt-button mt-1 h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </form>
  );
}

function OtpStage({ email, onVerifyOtp }: { email: string; onVerifyOtp: () => void }) {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Ref-latest-callback: `onVerifyOtp` closes over conversation state that changes on every
  // render, but this timeout should only ever fire once per mock "Verifying…" pass.
  const onVerifyOtpRef = useRef(onVerifyOtp);
  useEffect(() => {
    onVerifyOtpRef.current = onVerifyOtp;
  });
  useEffect(() => {
    if (!verifying) return;
    const id = window.setTimeout(() => onVerifyOtpRef.current(), VERIFYING_MS);
    return () => window.clearTimeout(id);
  }, [verifying]);

  const otpValid = /^\d{6}$/.test(otp.trim());

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!otpValid || verifying) return;
    setVerifying(true);
  };

  return (
    <div className="dt-fade-up flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
      <div>
        <p className="dt-eyebrow dt-eyebrow-accent">Verify to view</p>
        <p className="mt-2 text-[15px] font-medium text-navy">Enter your OTP</p>
        <p className="mt-1 text-[13px] leading-relaxed text-navy-body">
          We&apos;ve sent a one-time code to <span className="font-medium text-navy">{email}</span>.
        </p>
      </div>

      {verifying ? (
        <div className="flex items-center gap-2.5 text-[13.5px] text-navy-muted">
          <SpinnerIcon className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-accent" />
          Verifying…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            placeholder="6-digit code"
            autoComplete="off"
            className="h-12 rounded-xl border border-navy-hairline bg-white px-4 font-mono text-[14px] tracking-[0.2em] text-navy placeholder:font-sans placeholder:tracking-normal placeholder:text-navy-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!otpValid}
            className="dt-button h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Verify &amp; view summary
          </button>
        </form>
      )}

      <p className="text-[12px] text-navy-faint">
        For your security, this OTP is used only to complete this one-time verification and is never stored or
        shared.
      </p>
    </div>
  );
}

function GateField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-navy-muted">{label}</span>
      {children}
    </label>
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
