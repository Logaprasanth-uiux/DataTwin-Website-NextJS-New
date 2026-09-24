"use client";

import { useState, type FormEvent } from "react";
import type { ContactDetails, ScheduledMeeting } from "@/lib/chat/types";
import { MessageTurn } from "./MessageTurn";
import { UserReveal, type RevealTracker } from "./reveal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatMeetingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return DATE_FORMATTER.format(new Date(year, month - 1, day));
}

function formatMeetingTime(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = Number(hourStr);
  if (Number.isNaN(hour)) return time24;
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minuteStr} ${period}`;
}

// Calendly-style scheduling, standing in for a real booking integration (none exists yet — see
// engine.ts's `scheduleMeeting`, which just records the choice locally). Name/work email/phone
// come pre-filled from the Executive Summary gate's `summaryContact` — already collected once, so
// this never re-asks for it as blank required fields, just leaves it editable alongside the new
// date/time fields.
export function ScheduleMeetingStep({
  itemKey,
  tracker,
  resolved,
  prefill,
  submitted,
  onSubmit,
}: {
  itemKey: string;
  tracker: RevealTracker;
  resolved: boolean;
  prefill: ContactDetails | null;
  submitted: { contact: ContactDetails; meeting: ScheduledMeeting } | null;
  onSubmit: (contact: ContactDetails, meeting: ScheduledMeeting) => void;
}) {
  const [name, setName] = useState(prefill?.name ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [phone, setPhone] = useState(prefill?.phone ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (resolved) {
    if (!submitted) return null;
    return (
      <div className="flex flex-col gap-3">
        <UserReveal itemKey={`${itemKey}:resolved`} tracker={tracker}>
          <MessageTurn
            speaker="You"
            text={`Scheduled for ${formatMeetingDate(submitted.meeting.date)}, ${formatMeetingTime(submitted.meeting.time)} — ${submitted.contact.name}`}
          />
        </UserReveal>
        <MessageTurn
          speaker="DataTwin"
          text="Thanks — your conversation with the DataTwin Team is scheduled. We'll use this session to walk through the findings, validate the recovery opportunities and discuss the next steps."
        />
        <MeetingConfirmationCard contact={submitted.contact} meeting={submitted.meeting} />
      </div>
    );
  }

  const valid =
    name.trim().length > 1 && EMAIL_PATTERN.test(email) && phone.trim().length >= 6 && date.length > 0 && time.length > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() }, { date, time });
  };

  return (
    <form onSubmit={handleSubmit} className="dt-fade-up flex flex-col gap-5 rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
      <div>
        <p className="text-[15px] font-medium text-navy">Schedule a conversation with the DataTwin Team</p>
        <p className="mt-1 text-[13px] leading-relaxed text-navy-body">
          Choose a preferred date and time to review the findings, recovery opportunities and next steps with our
          team.
        </p>
      </div>

      <div className="flex flex-col gap-4">
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
        <Field label="Work email">
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
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-navy-hairline pt-4 sm:grid-cols-2">
        <Field label="Preferred date">
          <input
            type="date"
            required
            min={todayIsoDate()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
          />
        </Field>
        <Field label="Preferred time">
          <input
            type="time"
            required
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={!valid}
        className="dt-button mt-1 h-12 w-fit rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Schedule conversation
      </button>
    </form>
  );
}

function MeetingConfirmationCard({ contact, meeting }: { contact: ContactDetails; meeting: ScheduledMeeting }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent/[0.12] text-accent">
        <CalendarIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">Meeting scheduled</p>
        <p className="mt-1 text-[15px] font-semibold text-navy">
          {formatMeetingDate(meeting.date)} · {formatMeetingTime(meeting.time)}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-navy-body">
          {contact.name} · {contact.email} · {contact.phone}
        </p>
        <p className="mt-3 text-[12px] text-navy-faint">
          A calendar invite and joining details will be sent to your email closer to the session.
        </p>
      </div>
    </div>
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

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M5.5 9h1.5M9 9h1.5M5.5 11h1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
