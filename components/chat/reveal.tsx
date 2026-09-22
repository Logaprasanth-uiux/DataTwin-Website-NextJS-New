"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Sequencing for the transcript's "feels like a live conversation" behaviour: a brief typing
// indicator before a new DataTwin turn, a quick slide-in for a new user turn, and no replay of
// either when a conversation is loaded/resumed from storage (that content is history, not new).
//
// A single tracker is created once per chat session (see Transcript) and threaded down.
//
// Two separate jobs live here:
//  - `consume`/`unfreeze`: "has this content been seen before" — frozen for the whole initial
//    render (so a resumed conversation, or the opening greeting, never replays an entrance), then
//    live from the moment the transcript first mounts. Results are cached per key so calling it
//    more than once for the same key (React Strict Mode deliberately double-invokes lazy
//    `useState` initializers in dev to catch impure ones) always returns the same answer.
//  - `requestTurn`: a FIFO queue so that when a single state change produces more than one new
//    DataTwin turn at once (e.g. an acknowledgement plus the next question), they still reveal one
//    after another rather than all at once — "do not make multiple AI messages appear
//    simultaneously" is a named requirement, not just a side effect of how state happens to update.
//    Entries are cancellable, because Strict Mode also double-invokes effects (mount, cleanup,
//    mount) in dev — without a working cancel, that would queue a duplicate turn and wedge the
//    queue (the real turn's `finish` would never see the phantom entry released).

const TYPING_MS = 550;

export interface RevealTracker {
  consume: (key: string) => boolean;
  unfreeze: () => void;
  requestTurn: (onReady: () => void) => { finish: () => void; cancel: () => void };
}

export function createRevealTracker(): RevealTracker {
  let frozen = true;
  const consumed = new Map<string, boolean>();
  let busy = false;
  const queue: Array<{ onReady: () => void; cancelled: boolean }> = [];

  function advance() {
    if (busy || queue.length === 0) return;
    const entry = queue[0];
    busy = true;
    window.setTimeout(() => {
      queue.shift();
      if (entry.cancelled) {
        busy = false;
        advance();
      } else {
        entry.onReady();
      }
    }, 0);
  }

  return {
    consume(key) {
      const cached = consumed.get(key);
      if (cached !== undefined) return cached;
      const isNew = !frozen;
      consumed.set(key, isNew);
      return isNew;
    },
    unfreeze() {
      frozen = false;
    },
    requestTurn(onReady) {
      const entry = { onReady, cancelled: false };
      queue.push(entry);
      advance();
      return {
        finish() {
          busy = false;
          advance();
        },
        cancel() {
          entry.cancelled = true;
        },
      };
    },
  };
}

/** For content visible from the moment its component mounts — the common case. */
export function useMountReveal(active: boolean, key: string, tracker: RevealTracker): boolean {
  const [isNew] = useState(() => active && tracker.consume(key));
  return isNew;
}

export function TypingIndicator() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        DataTwin
      </span>
      <div className="flex items-center gap-1 py-1.5" role="status" aria-label="DataTwin is typing">
        <span className="dt-typing-dot h-1.5 w-1.5 rounded-full bg-navy-faint" />
        <span className="dt-typing-dot h-1.5 w-1.5 rounded-full bg-navy-faint" style={{ animationDelay: "160ms" }} />
        <span className="dt-typing-dot h-1.5 w-1.5 rounded-full bg-navy-faint" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  );
}

/** Wraps a top-level DataTwin-authored block. When genuinely new, it waits its turn in the shared
 * queue (so simultaneous new turns still reveal one after another), optionally shows typing dots,
 * then reveals `children` with a soft entrance and releases the queue for the next turn.
 * Historical/resumed content skips straight to `children` — no queueing, no animation. */
export function AssistantReveal({
  active = true,
  itemKey,
  tracker,
  showTyping = true,
  children,
}: {
  active?: boolean;
  itemKey: string;
  tracker: RevealTracker;
  showTyping?: boolean;
  children: ReactNode;
}) {
  const isNew = useMountReveal(active, itemKey, tracker);
  const [phase, setPhase] = useState<"waiting" | "typing" | "shown">(isNew ? "waiting" : "shown");
  const finishRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (phase !== "waiting") return;
    const turn = tracker.requestTurn(() => setPhase(showTyping ? "typing" : "shown"));
    finishRef.current = turn.finish;
    return () => turn.cancel();
  }, [phase, tracker, showTyping]);

  useEffect(() => {
    if (phase !== "typing") return;
    const id = window.setTimeout(() => setPhase("shown"), TYPING_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "shown" || !finishRef.current) return;
    finishRef.current();
    finishRef.current = null;
  }, [phase]);

  if (!isNew) return <>{children}</>;
  if (phase === "waiting") return null;
  if (phase === "typing") return <TypingIndicator />;
  return <div className="dt-msg-in-assistant">{children}</div>;
}

/** Wraps a top-level user-authored turn: immediate entrance, no typing delay, not queued — the
 * user's own message never waits on DataTwin's queue. */
export function UserReveal({
  itemKey,
  tracker,
  children,
}: {
  itemKey: string;
  tracker: RevealTracker;
  children: ReactNode;
}) {
  const isNew = useMountReveal(true, itemKey, tracker);
  return <div className={isNew ? "dt-msg-in-user" : ""}>{children}</div>;
}
