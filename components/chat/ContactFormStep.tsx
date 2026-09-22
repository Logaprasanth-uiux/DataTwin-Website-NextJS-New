"use client";

import { useState, type FormEvent } from "react";
import type { ContactDetails } from "@/lib/chat/types";
import { MessageTurn } from "./MessageTurn";
import { UserReveal, type RevealTracker } from "./reveal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactFormStep({
  itemKey,
  tracker,
  resolved,
  submitted,
  onSubmit,
}: {
  itemKey: string;
  tracker: RevealTracker;
  resolved: boolean;
  submitted: ContactDetails | null;
  onSubmit: (contact: ContactDetails) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  if (resolved) {
    return (
      <UserReveal itemKey={`${itemKey}:resolved`} tracker={tracker}>
        <MessageTurn speaker="You" text={`${submitted?.name} · ${submitted?.email}`} />
      </UserReveal>
    );
  }

  const valid = name.trim().length > 1 && EMAIL_PATTERN.test(email) && phone.trim().length >= 6;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="dt-fade-up flex flex-col gap-4 rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
      <div>
        <p className="text-[15px] font-medium text-navy">Let&apos;s connect you with the DataTwin Team</p>
        <p className="mt-1 text-[13px] text-navy-body">A few details so the right person can follow up.</p>
      </div>

      <Field label="Name">
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
        />
      </Field>
      <Field label="Company email">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
        />
      </Field>
      <Field label="Phone">
        <input
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
          className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
        />
      </Field>

      <button
        type="submit"
        disabled={!valid}
        className="dt-button mt-1 h-12 w-fit rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Connect with DataTwin Team
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-navy-muted">{label}</span>
      {children}
    </label>
  );
}
