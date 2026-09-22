"use client";

import { useEffect, useMemo } from "react";
import { RECONCILIATION_TOPICS, SOMETHING_ELSE_OPTION_ID } from "@/lib/chat/data/topics";
import { getTopic } from "@/lib/chat/engine";
import type { ConversationState, PeriodOptionId, TranscriptItem, UploadedFile } from "@/lib/chat/types";
import { PERIOD_OPTIONS } from "@/lib/chat/types";
import { ContactFormStep } from "./ContactFormStep";
import { FileUploadStep } from "./FileUploadStep";
import { HandoffStep } from "./HandoffStep";
import { MessageTurn } from "./MessageTurn";
import { OptionGroup } from "./OptionGroup";
import { AssistantReveal, createRevealTracker, UserReveal } from "./reveal";
import { RevealStep } from "./RevealStep";
import { ResultStep } from "./ResultStep";
import { SomethingElseInput } from "./SomethingElseInput";
import { VerificationStep } from "./VerificationStep";

const TOPIC_OPTIONS = [
  ...RECONCILIATION_TOPICS.map((topic) => ({ id: topic.id, label: topic.label })),
  { id: SOMETHING_ELSE_OPTION_ID, label: "Something else" },
];

export interface TranscriptActions {
  onSelectTopic: (id: string) => void;
  onSubmitSomethingElse: (text: string) => void;
  onSelectPeriod: (id: PeriodOptionId) => void;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemoveUpload: (fileId: string) => void;
  onContinueFiles: () => void;
  onVerificationComplete: () => void;
  onConnect: () => void;
  onSubmitContact: (contact: NonNullable<ConversationState["contact"]>) => void;
  onPreviewReveal: () => void;
}

export function Transcript({
  items,
  state,
  actions,
}: {
  items: TranscriptItem[];
  state: ConversationState;
  actions: TranscriptActions;
}) {
  // One tracker per chat session: everything present at first paint (a resumed conversation, or
  // the opening greeting) renders instantly; anything appended afterwards gets the typing/entrance
  // treatment exactly once. See reveal.tsx for why this needs a freeze/unfreeze rather than just
  // "was this id here on the previous render".
  const tracker = useMemo(() => createRevealTracker(), []);
  useEffect(() => {
    tracker.unfreeze();
  }, [tracker]);

  return (
    <div className="flex flex-col gap-7">
      {items.map((item) => {
        switch (item.kind) {
          case "user-text":
            return (
              <UserReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <MessageTurn speaker="You" text={item.text} />
              </UserReveal>
            );
          case "assistant-text":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <MessageTurn speaker="DataTwin" text={item.text} />
              </AssistantReveal>
            );
          case "topic-options":
            return (
              <OptionGroup
                key={item.id}
                id={item.id}
                tracker={tracker}
                prompt={item.prompt}
                options={TOPIC_OPTIONS}
                selectedId={item.selectedId}
                resolved={item.resolved}
                onSelect={actions.onSelectTopic}
              />
            );
          case "something-else-input":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker} showTyping={false}>
                <SomethingElseInput
                  itemKey={item.id}
                  tracker={tracker}
                  resolved={item.resolved}
                  value={item.value}
                  onSubmit={actions.onSubmitSomethingElse}
                />
              </AssistantReveal>
            );
          case "period-options":
            return (
              <OptionGroup
                key={item.id}
                id={item.id}
                tracker={tracker}
                prompt={item.prompt}
                options={PERIOD_OPTIONS}
                selectedId={item.selectedId}
                resolved={item.resolved}
                onSelect={(id) => actions.onSelectPeriod(id as PeriodOptionId)}
              />
            );
          case "file-upload":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker} showTyping={false}>
                <FileUploadStep
                  itemKey={item.id}
                  tracker={tracker}
                  topic={item.topic}
                  uploads={state.uploads}
                  resolved={item.resolved}
                  requiredReady={item.topic.requiredFiles.every(
                    (file) => state.uploads[file.fileId]?.status === "ready",
                  )}
                  onUpload={actions.onUpload}
                  onAdvanceStatus={actions.onAdvanceStatus}
                  onRemove={actions.onRemoveUpload}
                  onContinue={actions.onContinueFiles}
                />
              </AssistantReveal>
            );
          case "verification":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <VerificationStep onComplete={actions.onVerificationComplete} />
              </AssistantReveal>
            );
          case "result":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <ResultStep topic={item.topic} active={state.phase === "result"} onConnect={actions.onConnect} />
              </AssistantReveal>
            );
          case "contact-form":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <ContactFormStep
                  itemKey={item.id}
                  tracker={tracker}
                  resolved={item.resolved}
                  submitted={state.contact}
                  onSubmit={actions.onSubmitContact}
                />
              </AssistantReveal>
            );
          case "handoff":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <HandoffStep
                  active={state.phase === "handoff"}
                  canReveal={getTopic(state.selectedTopicId) !== null}
                  onPreviewReveal={actions.onPreviewReveal}
                />
              </AssistantReveal>
            );
          case "reveal":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <RevealStep topic={item.topic} />
              </AssistantReveal>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
