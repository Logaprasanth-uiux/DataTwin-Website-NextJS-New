"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";

// The persistent prompt bar at the bottom of the main Chat panel — a second way to write into the
// exact same conversation state the quick-actions (options, "Something else", file cards) already
// use, not a parallel input. See `submitChatMessage` in lib/chat/engine.ts.
//
// Rendered in ChatPageClient as the non-scrolling sibling *after* the conversation's own
// `overflow-y-auto` region, inside a `<main>` that's bounded to the viewport height and `sticky`
// positioned — so this never scrolls with the conversation and needs no positioning of its own
// (no `sticky`/`fixed`, no border separating it from the messages above: it's meant to read as
// part of the same panel, not a distinct footer). Its own `max-w-3xl mx-auto` below matches the
// transcript's, so both align to the same content column.
export function ChatComposer({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  // Enter sends; Shift+Enter inserts a newline, same convention as every other messaging surface.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const el = event.target;
    setText(el.value);
    // Grows to fit its content — no cap, so there's never a taller-than-the-box overflow that
    // would need an internal scrollbar (and, with it, part of the message silently out of view).
    // The composer sits in a `flex-shrink-0` slot below the conversation's own scrollable region
    // (see ChatPageClient), so a long message just makes more room for itself there.
    //
    // `scrollHeight` measures the content+padding box, but this element is `border-box` sized (so
    // its CSS `height` includes the border too) — setting height straight to `scrollHeight` would
    // undersize it by the border width, leaving a sliver of genuine overflow at the bottom despite
    // `overflow-hidden`. Adding the border back in keeps the box exactly tall enough.
    const cs = window.getComputedStyle(el);
    const borderHeight = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + borderHeight}px`;
  };

  return (
    <footer className="w-full flex-shrink-0 bg-background">
      <div className="mx-auto w-full max-w-3xl px-5 pt-2 pb-5 sm:px-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
            rows={1}
            aria-label="Type your message"
            className="min-h-[48px] flex-1 resize-none overflow-hidden rounded-xl border border-navy-hairline bg-white px-4 py-3 text-[14.5px] leading-relaxed text-navy placeholder:text-navy-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Send message"
            title="Send"
            className="dt-button flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </form>
      </div>
    </footer>
  );
}

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
