import { visibleRequiredFiles } from "@/lib/chat/engine";
import type { FileRequirement, ReconciliationTopic, UploadedFile } from "@/lib/chat/types";
import { FileRequirementCard } from "./FileRequirementCard";
import { MessageTurn } from "./MessageTurn";
import { UserReveal, type RevealTracker } from "./reveal";

function lowercaseFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

// One file's worth of "you gave me this, here's what it does" — the uploaded filename reads as
// its own turn (a real exchange, not just a form field being filled in), immediately followed by
// what that file now lets DataTwin see. `next` reads `upload.nextFileHint`, captured once the
// moment this file first became ready (see advanceUploadStatus) — never recomputed here — so this
// message can't retroactively change once a later file is uploaded.
function FileAcknowledgement({
  itemKey,
  tracker,
  file,
  fileName,
  next,
}: {
  itemKey: string;
  tracker: RevealTracker;
  file: FileRequirement;
  fileName: string;
  next?: FileRequirement;
}) {
  const ack = `Got it — I've received your ${file.name}. ${file.why}`;
  const nextLine = next ? ` Next, your ${next.name} would help — ${lowercaseFirst(next.why)}` : "";
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

export function FileUploadStep({
  itemKey,
  tracker,
  topic,
  uploads,
  resolved,
  requiredReady,
  maxRevealed,
  onUpload,
  onAdvanceStatus,
  onRemove,
  onContinue,
}: {
  itemKey: string;
  tracker: RevealTracker;
  topic: ReconciliationTopic;
  uploads: Record<string, UploadedFile>;
  resolved: boolean;
  requiredReady: boolean;
  maxRevealed: number;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
  onContinue: () => void;
}) {
  // Full history stays visible rather than collapsing into a one-line summary once resolved (a
  // previously-committed exchange must never shrink after the fact) — `resolved` only suppresses
  // the now-irrelevant "Continue to verification" action further down. `maxRevealed` is a
  // high-water mark, so removing an earlier file never pulls later, already-shown files back out.
  const visibleRequired = visibleRequiredFiles(topic, uploads, maxRevealed);

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
          return (
            <FileAcknowledgement
              key={file.fileId}
              itemKey={`${itemKey}:${file.fileId}`}
              tracker={tracker}
              file={file}
              fileName={upload.fileName}
              next={next}
            />
          );
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

      {requiredReady && (
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
