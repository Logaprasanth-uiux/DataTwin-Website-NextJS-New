import { useEffect, useRef } from "react";
import { visibleRequiredFiles } from "@/lib/chat/engine";
import type {
  FileRequirement,
  FileSourceChoice as FileSourceChoiceValue,
  FileValidationStage,
  PortalFetchStage,
  ReconciliationTopic,
  UploadedFile,
} from "@/lib/chat/types";
import { FileRequirementCard } from "./FileRequirementCard";
import { FileSourceChoice } from "./FileSourceChoice";
import { FileValidationFlow } from "./FileValidationFlow";
import { MessageTurn } from "./MessageTurn";
import { PortalFetchFlow } from "./PortalFetchFlow";
import { UserReveal, type RevealTracker } from "./reveal";

function lowercaseFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

// One file's worth of "you gave me this, here's what it does" — the uploaded filename reads as
// its own turn (a real exchange, not just a form field being filled in), immediately followed by
// what that file now lets DataTwin see. `next` reads `upload.nextFileHint`, captured once the
// moment this file first became ready (see advanceUploadStatus) — never recomputed here — so this
// message can't retroactively change once a later file is uploaded. `override`, when present
// (see ReconciliationTopic.fileAckOverrides), replaces the generic ack+next-file text wholesale
// with a reconciliation's own bespoke copy — it already says whatever comes next itself.
function FileAcknowledgement({
  itemKey,
  tracker,
  file,
  fileName,
  next,
  override,
}: {
  itemKey: string;
  tracker: RevealTracker;
  file: FileRequirement;
  fileName: string;
  next?: FileRequirement;
  override?: string;
}) {
  const ack = override ?? `Got it — I've received your ${file.name}. ${file.why}`;
  const nextLine = override ? "" : next ? ` Next, your ${next.name} would help — ${lowercaseFirst(next.why)}` : "";
  return (
    <div className="flex flex-col gap-3">
      <UserReveal itemKey={`${itemKey}:file`} tracker={tracker}>
        <MessageTurn speaker="You" text={fileName} />
      </UserReveal>
      <UserReveal itemKey={`${itemKey}:ack`} tracker={tracker}>
        <MessageTurn speaker="DataTwin" text={`${ack}${nextLine}`} />
      </UserReveal>
    </div>
  );
}

function OptionalFileOffer({
  itemKey,
  tracker,
  file,
  upload,
  onUpload,
  onAdvanceStatus,
  onRemove,
}: {
  itemKey: string;
  tracker: RevealTracker;
  file: FileRequirement;
  upload: UploadedFile | undefined;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
}) {
  if (upload) {
    return (
      <div className="flex flex-col gap-3">
        <UserReveal itemKey={`${itemKey}:file`} tracker={tracker}>
          <MessageTurn speaker="You" text={upload.fileName} />
        </UserReveal>
        <UserReveal itemKey={`${itemKey}:ack`} tracker={tracker}>
          <MessageTurn speaker="DataTwin" text={`Thanks — that adds more detail. ${file.why}`} />
        </UserReveal>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <MessageTurn
        speaker="DataTwin"
        text={`I can continue with what I have, but if you also share your ${file.name}, ${lowercaseFirst(file.why)}`}
      />
      <FileRequirementCard
        requirement={file}
        upload={upload}
        onUpload={onUpload}
        onAdvanceStatus={onAdvanceStatus}
        onRemove={onRemove}
      />
    </div>
  );
}

// Shown instead of the generic "Perfect — I have what I need..." + optional-files offer, for a
// reconciliation with a scripted journey (see ReconciliationTopic.autoAdvanceMessage) — displays
// the message, then continues into verification itself after a short beat, so this one journey
// reads as a guided walkthrough rather than asking the user to click a "Continue" button on top of
// everything the message already implied. Fires `onAdvance` exactly once: the effect only runs on
// mount (this component only ever exists for as long as `autoAdvanceMessage` is set, i.e. once),
// and reads the latest `onAdvance` via a ref so a stale closure can't apply itself to stale state
// (same reasoning as VerificationStep's own onCompleteRef).
function AutoAdvanceNotice({ message, onAdvance }: { message: string; onAdvance: () => void }) {
  const onAdvanceRef = useRef(onAdvance);
  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  });
  useEffect(() => {
    const id = window.setTimeout(() => onAdvanceRef.current(), 900);
    return () => window.clearTimeout(id);
  }, []);
  return <MessageTurn speaker="DataTwin" text={message} />;
}

export function FileUploadStep({
  itemKey,
  tracker,
  topic,
  uploads,
  resolved,
  requiredReady,
  maxRevealed,
  fileSource,
  portalFetch,
  fileValidation,
  filePreviewOpen,
  onUpload,
  onAdvanceStatus,
  onRemove,
  onContinue,
  onChooseFileSource,
  onSubmitPortalGstin,
  onPortalFetchComplete,
  onBeginValidation,
  onFlagIssue,
  onContinueAnyway,
  onReplaceFlagged,
  onTogglePreview,
}: {
  itemKey: string;
  tracker: RevealTracker;
  topic: ReconciliationTopic;
  uploads: Record<string, UploadedFile>;
  resolved: boolean;
  requiredReady: boolean;
  maxRevealed: number;
  fileSource: Record<string, FileSourceChoiceValue>;
  portalFetch: Record<string, PortalFetchStage>;
  fileValidation: Record<string, FileValidationStage>;
  filePreviewOpen: Record<string, boolean>;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
  onContinue: () => void;
  onChooseFileSource: (fileId: string, source: FileSourceChoiceValue) => void;
  onSubmitPortalGstin: (fileId: string) => void;
  onPortalFetchComplete: (fileId: string, fileName: string) => void;
  onBeginValidation: (fileId: string) => void;
  onFlagIssue: (fileId: string) => void;
  onContinueAnyway: (fileId: string) => void;
  onReplaceFlagged: (fileId: string) => void;
  onTogglePreview: (fileId: string) => void;
}) {
  // Full history stays visible rather than collapsing into a one-line summary once resolved (a
  // previously-committed exchange must never shrink after the fact) — `resolved` only suppresses
  // the now-irrelevant "Continue to verification" action further down. `maxRevealed` is a
  // high-water mark, so removing an earlier file never pulls later, already-shown files back out.
  const visibleRequired = visibleRequiredFiles(topic, uploads, maxRevealed);
  const firstRequiredFileId = topic.requiredFiles[0]?.fileId;

  return (
    <div className="flex flex-col gap-5">
      {visibleRequired.map((file) => {
        const upload = uploads[file.fileId];
        const isReady = upload?.status === "ready";
        const next =
          isReady && upload?.nextFileHint
            ? topic.requiredFiles.find((f) => f.fileId === upload.nextFileHint)
            : undefined;

        if (isReady) {
          // A file continued "anyway" past its flagged issue gets its own acknowledgement —
          // naming the gap plainly rather than pretending the data came in clean — instead of the
          // generic ack (or a topic's own scripted one, which wouldn't know about this).
          const validationOverride =
            fileValidation[file.fileId] === "acknowledged"
              ? `Continuing with ${upload.fileName} — since the GSTIN field appears to be missing for some records, this analysis may be less complete until it's corrected.${
                  next ? ` Next, let's get your ${next.name}.` : ""
                }`
              : undefined;
          return (
            <FileAcknowledgement
              key={file.fileId}
              itemKey={`${itemKey}:${file.fileId}`}
              tracker={tracker}
              file={file}
              fileName={upload.fileName}
              next={next}
              override={validationOverride ?? topic.fileAckOverrides?.[file.fileId]}
            />
          );
        }

        if (file.fileId === firstRequiredFileId) {
          return (
            <FileValidationFlow
              key={file.fileId}
              requirement={file}
              upload={upload}
              validationStage={fileValidation[file.fileId]}
              previewOpen={Boolean(filePreviewOpen[file.fileId])}
              onUpload={onUpload}
              onAdvanceStatus={onAdvanceStatus}
              onBeginValidation={onBeginValidation}
              onFlagIssue={onFlagIssue}
              onContinueAnyway={onContinueAnyway}
              onReplace={onReplaceFlagged}
              onTogglePreview={onTogglePreview}
            />
          );
        }

        if (topic.portalFetchFileIds?.includes(file.fileId)) {
          const source = fileSource[file.fileId];
          if (!source) {
            return <FileSourceChoice key={file.fileId} file={file} onChoose={(src) => onChooseFileSource(file.fileId, src)} />;
          }
          if (source === "portal") {
            return (
              <PortalFetchFlow
                key={file.fileId}
                itemKey={`${itemKey}:${file.fileId}`}
                tracker={tracker}
                file={file}
                stage={portalFetch[file.fileId] ?? "gstin"}
                onSubmitGstin={() => onSubmitPortalGstin(file.fileId)}
                onFetchComplete={(fileName) => onPortalFetchComplete(file.fileId, fileName)}
              />
            );
          }
          // source === "upload" — falls through to the normal upload card below.
        }

        return (
          <FileRequirementCard
            key={file.fileId}
            requirement={file}
            upload={upload}
            onUpload={onUpload}
            onAdvanceStatus={onAdvanceStatus}
            onRemove={onRemove}
          />
        );
      })}

      {requiredReady && topic.autoAdvanceMessage && (
        <AutoAdvanceNotice message={topic.autoAdvanceMessage} onAdvance={onContinue} />
      )}

      {requiredReady && !topic.autoAdvanceMessage && (
        <>
          <MessageTurn
            speaker="DataTwin"
            text={
              topic.optionalFiles.length > 0
                ? "Perfect — I have what I need to start. A couple more files could sharpen the analysis, if you'd like to add them."
                : "Perfect — I have what I need. Let's run the reconciliation."
            }
          />

          {topic.optionalFiles.map((file) => (
            <OptionalFileOffer
              key={file.fileId}
              itemKey={`${itemKey}:${file.fileId}`}
              tracker={tracker}
              file={file}
              upload={uploads[file.fileId]}
              onUpload={onUpload}
              onAdvanceStatus={onAdvanceStatus}
              onRemove={onRemove}
            />
          ))}

          {requiredReady && !resolved && (
            <button
              type="button"
              onClick={onContinue}
              className="dt-button h-12 w-fit rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90"
            >
              Continue to verification
            </button>
          )}
        </>
      )}
    </div>
  );
}
