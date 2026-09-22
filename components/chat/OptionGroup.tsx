"use client";

import { useEffect, useRef, useState } from "react";
import { MessageTurn } from "./MessageTurn";
import { TypingIndicator, UserReveal, useMountReveal, type RevealTracker } from "./reveal";

interface Option {
  id: string;
  label: string;
}

const TYPING_MS = 550;
const OPTIONS_DELAY_MS = 300;

export function OptionGroup({
  id,
  tracker,
  prompt,
  options,
  selectedId,
  resolved,
  onSelect,
}: {
  id: string;
  tracker: RevealTracker;
  prompt: string;
  options: readonly Option[];
  selectedId: string | null;
  resolved: boolean;
  onSelect: (id: string) => void;
}) {
  const selected = options.find((option) => option.id === selectedId);

  // Own multi-stage sequence (typing -> prompt -> a beat -> options), sharing the session-wide
  // turn queue with AssistantReveal so this doesn't start until any earlier new turn has settled.
  const promptIsNew = useMountReveal(true, id, tracker);
  const [stage, setStage] = useState<"waiting" | "typing" | "prompt" | "options">(
    promptIsNew ? "waiting" : "options",
  );
  const finishRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (stage !== "waiting") return;
    const turn = tracker.requestTurn(() => setStage("typing"));
    finishRef.current = turn.finish;
    return () => turn.cancel();
  }, [stage, tracker]);

  useEffect(() => {
    if (stage !== "typing") return;
    const t = window.setTimeout(() => setStage("prompt"), TYPING_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "prompt") return;
    const t = window.setTimeout(() => setStage("options"), OPTIONS_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "options" || !finishRef.current) return;
    finishRef.current();
    finishRef.current = null;
  }, [stage]);

  if (stage === "waiting") return null;
  if (stage === "typing") return <TypingIndicator />;

  return (
    <div className="flex flex-col gap-3">
      <div className={promptIsNew ? "dt-msg-in-assistant" : ""}>
        <MessageTurn speaker="DataTwin" text={prompt} />
      </div>

      {!resolved && (
        <div className={`flex flex-wrap gap-2.5 ${promptIsNew ? "dt-msg-in-assistant" : ""}`}>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className="rounded-xl border border-navy-hairline bg-white px-4 py-2.5 text-left text-[14px] font-medium text-navy shadow-soft transition-colors hover:border-accent hover:bg-accent/[0.05]"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {resolved && selected && (
        <UserReveal itemKey={`${id}:selected`} tracker={tracker}>
          <MessageTurn speaker="You" text={selected.label} />
        </UserReveal>
      )}
    </div>
  );
}
