"use client";

import type { FileSourceChoice, PortalFetchStage, ReconciliationCheckpoint, UploadedFile } from "@/lib/chat/types";
import { FileRequirementCard } from "./FileRequirementCard";
import { MessageTurn } from "./MessageTurn";
import { PortalFetchFlow } from "./PortalFetchFlow";
import type { RevealTracker } from "./reveal";

// Shown once the required documents are in and before the reconciliation runs: every optional
// document at once, as one message with its cards, and one button that starts the run — with or
// without any of them. Documents added here count towards the first result; whatever is skipped is
// still offered on the "improve accuracy" card below the result (see AccuracyBoostCard).
export function OptionalDocsOffer({
  itemKey,
  requiredNames,
  tracker,
  checkpoints,
  uploads,
  fileSource,
  portalFetch,
  resolved,
  runMessage,
  onUpload,
  onAdvanceStatus,
  onRemove,
  onChooseFileSource,
  onSubmitPortalGstin,
  onPortalFetchComplete,
  onRun,
}: {
  itemKey: string;
  /** Names of the required documents already in, so the button says what the run starts with. */
  requiredNames: string[];
  tracker: RevealTracker;
  checkpoints: ReconciliationCheckpoint[];
  uploads: Record<string, UploadedFile>;
  fileSource: Record<string, FileSourceChoice>;
  portalFetch: Record<string, PortalFetchStage>;
  /** True once the run has started — the buttons go away, the cards stay as history. */
  resolved: boolean;
  runMessage?: string;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
  onChooseFileSource: (fileId: string, source: FileSourceChoice) => void;
  onSubmitPortalGstin: (fileId: string) => void;
  onPortalFetchComplete: (fileId: string, fileName: string) => void;
  onRun: () => void;
}) {
  const canFetchFile = (file: { fileId: string }, checkpoint: ReconciliationCheckpoint) =>
    checkpoint.portalFetchFileIds?.includes(file.fileId) ?? false;
  // Documents that can be fetched from the portal (two buttons) come first, so each row of the grid
  // holds cards of the same height instead of alternating tall and short ones.
  const files = checkpoints
    .flatMap((checkpoint) => checkpoint.files.map((file) => ({ file, checkpoint })))
    .sort((a, b) => Number(canFetchFile(b.file, b.checkpoint)) - Number(canFetchFile(a.file, a.checkpoint)));
  const joinNames = (names: string[]) =>
    names.length <= 1 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  const readyCount = files.filter(({ file }) => uploads[file.fileId]?.status === "ready").length;
  // A document still mid-upload shouldn't be left behind by an early click.
  const busy = files.some(({ file }) => uploads[file.fileId] && uploads[file.fileId].status !== "ready");

  return (
    <div className="flex flex-col gap-4" data-scroll-target={resolved ? undefined : "optional"}>
      <MessageTurn
        speaker="DataTwin"
        text="I have what I need to start. These optional documents narrow the gap further — add any of them now, or continue without."
      />

      <p className="text-[12px] font-semibold tracking-[0.08em] text-navy-muted uppercase">Optional documents</p>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
      {files.map(({ file, checkpoint }) => {
        const upload = uploads[file.fileId];
        const canFetch = canFetchFile(file, checkpoint);
        if (!upload && canFetch && fileSource[file.fileId] === "portal") {
          return (
            <div key={file.fileId} className="md:col-span-2">
            <PortalFetchFlow
              itemKey={`${itemKey}:${file.fileId}`}
              tracker={tracker}
              file={file}
              stage={portalFetch[file.fileId] ?? "gstin"}
              onSubmitGstin={() => onSubmitPortalGstin(file.fileId)}
              onFetchComplete={(fileName) => onPortalFetchComplete(file.fileId, fileName)}
            />
            </div>
          );
        }
        return (
          <div key={file.fileId} className={canFetch ? "flex self-stretch [&>*]:w-full" : undefined}>
          <FileRequirementCard
            requirement={{ ...file, level: "optional", why: checkpoint.accuracyBenefit ?? file.why }}
            upload={upload}
            onUpload={(fileId, fileName) => {
              onChooseFileSource(fileId, "upload");
              onUpload(fileId, fileName);
            }}
            onAdvanceStatus={onAdvanceStatus}
            onRemove={onRemove}
            onChoosePortal={canFetch ? () => onChooseFileSource(file.fileId, "portal") : undefined}
            showWhyLabel
          />
          </div>
        );
      })}
      </div>

      {!resolved && (
        <button
          type="button"
          onClick={onRun}
          disabled={busy}
          className="dt-button h-12 w-fit rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {readyCount > 0
            ? `Continue with ${joinNames([...requiredNames, `${readyCount} optional ${readyCount === 1 ? "document" : "documents"}`])}`
            : `Continue with ${joinNames(requiredNames)}`}
        </button>
      )}

      {resolved && runMessage && <MessageTurn speaker="DataTwin" text={runMessage} />}
    </div>
  );
}
