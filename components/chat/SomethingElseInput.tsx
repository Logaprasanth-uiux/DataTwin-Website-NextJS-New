"use client";

import { useState, type FormEvent } from "react";
import { MessageTurn } from "./MessageTurn";
import { UserReveal, type RevealTracker } from "./reveal";

export function SomethingElseInput({
  itemKey,
  tracker,
  resolved,
  value,
  onSubmit,
}: {
  itemKey: string;
  tracker: RevealTracker;
  resolved: boolean;
  value: string | null;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");
  if (resolved) {
    return (
      <UserReveal itemKey={`${itemKey}:resolved`} tracker={tracker}>
        <MessageTurn speaker="You" text={value ?? ""} />
      </UserReveal>
    );
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
  };

  return (
    <form onSubmit={handleSubmit} className="dt-fade-up flex flex-col gap-2.5 sm:flex-row">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Tell us what you're looking into…"
        autoComplete="off"
        className="h-12 flex-1 rounded-xl border border-navy-hairline bg-white px-4 text-[14.5px] text-navy placeholder:text-navy-faint focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="dt-button h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}
