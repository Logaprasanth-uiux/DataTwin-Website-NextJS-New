"use client";

import { useEffect, useMemo } from "react";
import type {
  ContactDetails,
  ConversationState,
  CustomPeriodRange,
  FileSourceChoice,
  PeriodOptionId,
  TranscriptItem,
  UploadedFile,
} from "@/lib/chat/types";
import { PERIOD_OPTIONS } from "@/lib/chat/types";
import {
  getCurrentAndPreviousFinancialYearLabels,
  getCurrentAndPreviousPeriodLabels,
  getCurrentQuarterLabel,
} from "@/lib/chat/formatDate";
import { ContactFormStep } from "./ContactFormStep";
import { CustomPeriodInput } from "./CustomPeriodInput";
import { FileUploadStep } from "./FileUploadStep";
import { HandoffStep } from "./HandoffStep";
import { MessageTurn } from "./MessageTurn";
import { OptionGroup } from "./OptionGroup";
import { AssistantReveal, createRevealTracker, UserReveal } from "./reveal";
import { RevealStep } from "./RevealStep";
import { ResultStep } from "./ResultStep";
import { VerificationStep } from "./VerificationStep";

export interface TranscriptActions {
  onSelectDiscoveryOption: (turnId: string, optionId: string) => void;
  onSelectPeriod: (id: PeriodOptionId) => void;
  onSubmitCustomPeriod: (range: CustomPeriodRange) => void;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemoveUpload: (fileId: string) => void;
  onContinueFiles: () => void;
  onChooseFileSource: (fileId: string, source: FileSourceChoice) => void;
  onSubmitPortalGstin: (fileId: string) => void;
  onPortalFetchComplete: (fileId: string, fileName: string) => void;
  onBeginValidation: (fileId: string) => void;
  onFlagIssue: (fileId: string) => void;
  onContinueAnyway: (fileId: string) => void;
  onReplaceFlagged: (fileId: string) => void;
  onTogglePreview: (fileId: string) => void;
  onVerificationComplete: () => void;
  onConnect: () => void;
  onSubmitContact: (contact: ContactDetails) => void;
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

  // Computed fresh from today's real date (never hardcoded) — every period option gets a
  // contextual sublabel except "Custom period", which has no fixed range to summarise.
  const periodOptions = useMemo(() => {
    const { current, previous } = getCurrentAndPreviousPeriodLabels();
    const { current: currentFY, previous: previousFY } = getCurrentAndPreviousFinancialYearLabels();
    const sublabels: Partial<Record<PeriodOptionId, string>> = {
      "current-period": current,
      "previous-period": previous,
      "current-quarter": getCurrentQuarterLabel(),
      "current-fy": currentFY,
      "previous-fy": previousFY,
    };
    return PERIOD_OPTIONS.map((option) => ({ ...option, sublabel: sublabels[option.id] }));
  }, []);

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
          case "discovery-options":
            return (
              <OptionGroup
                key={item.id}
                id={item.id}
                tracker={tracker}
                prompt={item.prompt}
                options={item.options}
                selectedId={item.selectedId}
                resolved={item.resolved}
                onSelect={(optionId) => actions.onSelectDiscoveryOption(item.id, optionId)}
              />
            );
          case "period-options":
            return (
              <OptionGroup
                key={item.id}
                id={item.id}
                tracker={tracker}
                prompt={item.prompt}
                options={periodOptions}
                selectedId={item.selectedId}
                resolved={item.resolved}
                onSelect={(id) => actions.onSelectPeriod(id as PeriodOptionId)}
              />
            );
          case "custom-period-input":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <CustomPeriodInput
                  itemKey={item.id}
                  tracker={tracker}
                  resolved={item.resolved}
                  value={item.value}
                  onSubmit={actions.onSubmitCustomPeriod}
                />
              </AssistantReveal>
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
                  maxRevealed={state.maxRequiredFilesRevealed}
                  fileSource={state.fileSource}
                  portalFetch={state.portalFetch}
                  fileValidation={state.fileValidation}
                  filePreviewOpen={state.filePreviewOpen}
                  onUpload={actions.onUpload}
                  onAdvanceStatus={actions.onAdvanceStatus}
                  onRemove={actions.onRemoveUpload}
                  onContinue={actions.onContinueFiles}
                  onChooseFileSource={actions.onChooseFileSource}
                  onSubmitPortalGstin={actions.onSubmitPortalGstin}
                  onPortalFetchComplete={actions.onPortalFetchComplete}
                  onBeginValidation={actions.onBeginValidation}
                  onFlagIssue={actions.onFlagIssue}
                  onContinueAnyway={actions.onContinueAnyway}
                  onReplaceFlagged={actions.onReplaceFlagged}
                  onTogglePreview={actions.onTogglePreview}
                />
              </AssistantReveal>
            );
          case "verification":
            return (
              <AssistantReveal key={item.id} itemKey={item.id} tracker={tracker}>
                <VerificationStep active={state.phase === "verifying"} onComplete={actions.onVerificationComplete} />
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
                  canReveal={item.canReveal}
                  revealed={state.revealed}
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
