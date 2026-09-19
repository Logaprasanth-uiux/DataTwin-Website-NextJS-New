"use client";

import { useEffect, useRef, useState, type FocusEvent, type FormEvent } from "react";
import { HeroPromptSuggestions } from "./HeroPromptSuggestions";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useStreamedPhrase } from "./useStreamedPhrase";

export const HERO_PROMPT_SUGGESTIONS = [
  "We're paying distributor claims we can't verify",
  "Duplicate and overpaid vendor invoices",
  "Input tax credit we never claimed",
] as const;

// Idle phrases rotate inside the prompt; with reduced motion the first one is shown statically.
export const HERO_PROMPT_PHRASES = [
  "We keep overpaying distributor rebate claims…",
  "How much are we losing to duplicate payments?",
  "Commission calculations are wrong every quarter…",
  "Our month-end close takes eleven days…",
  "GST input credit never ties to the books…",
] as const;

const ACTIVE_PLACEHOLDER = "Ask about your finance data...";

// Prompt states: idle (rotating phrases) → focused (active placeholder) → suggestions
// (list open) → filled (a suggestion or typed text is in the field).

export function HeroPrompt({
  className = "",
  suggestions = HERO_PROMPT_SUGGESTIONS,
  onSubmit,
}: {
  className?: string;
  suggestions?: readonly string[];
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const idle = !focused && value === "";
  const { phrase, delays, index: phraseIndex, exiting: phraseExiting } = useStreamedPhrase(
    HERO_PROMPT_PHRASES,
    idle && reducedMotion === false,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Scroll only after the panel has fully expanded (measuring earlier lets the browser
  // clamp the target to the shorter page), and only as far as needed to bring the list
  // into view without pushing the prompt itself off-screen.
  const revealedRef = useRef(false);

  const revealList = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    const list = listRef.current;
    const form = formRef.current;
    if (!list || !form) return;
    const margin = 24;
    const overshoot = list.getBoundingClientRect().bottom - (window.innerHeight - margin);
    const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
    const room = form.getBoundingClientRect().top - headerHeight - margin;
    const delta = Math.min(overshoot, room);
    if (delta <= 0) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollBy({ top: delta, behavior: reduceMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (!open) {
      revealedRef.current = false;
      return;
    }
    const fallback = window.setTimeout(revealList, 800);
    return () => window.clearTimeout(fallback);
  }, [open]);

  const selectSuggestion = (item: string) => {
    setValue(item);
    setOpen(false);
    setFilled(true);
    window.setTimeout(() => setFilled(false), 400);
    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.(value.trim());
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
      setFocused(false);
    }
  };

  const placeholder = focused ? ACTIVE_PLACEHOLDER : reducedMotion ? HERO_PROMPT_PHRASES[0] : "";

  return (
    <div
      className={`w-full ${className}`.trim()}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onClick={() => inputRef.current?.focus()}
        className="dt-prompt group flex min-h-[62px] w-full items-center gap-3 rounded-2xl border border-navy-hairline bg-white/70 px-4 py-2.5 shadow-soft transition-colors hover:border-accent focus-within:border-accent sm:min-h-0"
      >
        <PromptGlyph className="h-4 w-4 flex-shrink-0 text-navy-faint transition-colors group-hover:text-accent group-focus-within:text-accent" />
        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            type="text"
            name="prompt"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder={placeholder}
            autoComplete="off"
            aria-label="Ask DataTwin"
            className={`w-full truncate bg-transparent text-[15px] text-navy placeholder:text-navy-faint focus:outline-none ${
              filled ? "dt-fill-in" : ""
            }`}
          />
          {phrase && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center"
            >
              <span
                key={phraseIndex}
                className={`max-h-[2.6rem] overflow-hidden text-[15px] leading-snug text-navy-faint sm:max-h-none sm:truncate ${
                  phraseExiting ? "dt-phrase-out" : ""
                }`}
              >
                {Array.from(phrase).map((char, position) => (
                  <span
                    key={position}
                    className="dt-char"
                    style={{ animationDelay: `${delays[position] ?? 0}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          )}
        </div>
        <button
          type="submit"
          aria-label="Ask DataTwin"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy text-white transition-colors group-hover:bg-accent group-focus-within:bg-accent"
        >
          <PromptArrow className="h-3.5 w-3.5" />
        </button>
      </form>

      <HeroPromptSuggestions
        items={suggestions}
        open={open}
        onSelect={selectSuggestion}
        onExpanded={revealList}
        listRef={listRef}
      />
    </div>
  );
}

function PromptGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function PromptArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
