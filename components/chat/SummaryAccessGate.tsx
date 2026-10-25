"use client";

import { useState, type FormEvent } from "react";
import type { ContactDetails } from "@/lib/chat/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The overlay form shown on top of the blurred Executive Summary (see ResultStep): just an email,
// any email, and the summary opens. No name, phone number or OTP. The contact record keeps the same
// shape as the scheduling step's, with the fields we didn't ask for left empty.
export function SummaryAccessGate({ onSubmitContact }: { onSubmitContact: (contact: ContactDetails) => void }) {
  const [email, setEmail] = useState("");
  const valid = EMAIL_PATTERN.test(email.trim());

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onSubmitContact({ name: "", email: email.trim(), phone: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="dt-fade-up flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft"
    >
      <div>
        <p className="dt-eyebrow dt-eyebrow-accent">View your result</p>
        <p className="mt-2 text-[15px] font-medium text-navy">See your Executive Summary</p>
        <p className="mt-1 text-[13px] leading-relaxed text-navy-body">Enter your email to view this reconciliation&apos;s summary.</p>
      </div>

      <GateField label="Email">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
        />
      </GateField>

      <button
        type="submit"
        disabled={!valid}
        className="dt-button mt-1 h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        View summary
      </button>
    </form>
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
