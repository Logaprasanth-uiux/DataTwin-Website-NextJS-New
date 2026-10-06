"use client";

import { useState } from "react";
import type { FileSourceChoice, PortalFetchStage, ReconciliationCheckpoint, UploadedFile } from "@/lib/chat/types";
import { FileRequirementCard } from "./FileRequirementCard";
import { MessageTurn } from "./MessageTurn";
import { PortalFetchFlow } from "./PortalFetchFlow";
import { UserReveal, type RevealTracker } from "./reveal";

// Shown once the required documents are in and before the reconciliation runs: every optional
// document at once, as one message with its cards, and one button that starts the run — with or
// without any of them. Documents added here count towards the first result; whatever is skipped is
// still offered on the "improve accuracy" card below the result (see AccuracyBoostCard).
export function OptionalDocsOffer({
  itemKey,
  requiredNames,
  tracker,
  checkpoints,
  groups,
  groupsQuestion,
  selectedGroups,
  onChooseGroups,
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
  /** When the topic asks which groups of optional documents apply (see
   * ReconciliationTopic.optionalGroups): the groups, the question, what was answered (undefined
   * until then) and how to record the answer. */
  groups?: { id: string; label: string }[];
  groupsQuestion?: string;
  selectedGroups?: string[];
  onChooseGroups?: (groupIds: string[]) => void;
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
  const [picked, setPicked] = useState<string[]>([]);
  // With groups, nothing is offered until the user has said which apply, and then only those.
  const offered = groups
    ? selectedGroups === undefined
      ? []
      : checkpoints.filter((checkpoint) => checkpoint.group !== undefined && selectedGroups.includes(checkpoint.group))
    : checkpoints;
  const files = offered
    .flatMap((checkpoint) => checkpoint.files.map((file) => ({ file, checkpoint })))
    .sort((a, b) => Number(canFetchFile(b.file, b.checkpoint)) - Number(canFetchFile(a.file, a.checkpoint)));
  const joinNames = (names: string[]) =>
    names.length <= 1 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  const readyCount = files.filter(({ file }) => uploads[file.fileId]?.status === "ready").length;
  // A document still mid-upload shouldn't be left behind by an early click.
  const busy = files.some(({ file }) => uploads[file.fileId] && uploads[file.fileId].status !== "ready");

  return (
    <div className="flex flex-col gap-4" data-scroll-target={resolved ? undefined : "optional"}>
      {groups && selectedGroups === undefined ? (
        <>
          <MessageTurn
            speaker="DataTwin"
            text={`I have what I need to start. ${groupsQuestion ?? "Which of these apply to you?"}`}
          />
          <div className="flex flex-wrap gap-2.5">
            {groups.map((group) => {
              const on = picked.includes(group.id);
              return (
                <button
                  key={group.id}
                  type="button"
                  aria-pressed={on}
                  disabled={resolved}
                  onClick={() => setPicked((prev) => (prev.includes(group.id) ? prev.filter((id) => id !== group.id) : [...prev, group.id]))}
                  className={`rounded-xl border px-4 py-2.5 text-left text-[14px] font-medium text-navy shadow-soft transition-colors hover:border-accent ${
                    on ? "border-accent bg-accent/[0.08]" : "border-navy-hairline bg-white hover:bg-accent/[0.05]"
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
          {!resolved && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={picked.length === 0}
                onClick={() => onChooseGroups?.(picked)}
                className="dt-button h-12 w-fit rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add files for these
              </button>
              <button
                type="button"
                onClick={() => onChooseGroups?.([])}
                className="h-12 w-fit rounded-full border border-navy-hairline px-6 text-[14px] font-medium text-navy transition-colors hover:border-accent"
              >
                Continue with {joinNames(requiredNames)}
              </button>
            </div>
          )}
        </>
      ) : groups && selectedGroups ? (
        <>
          <UserReveal itemKey={`${itemKey}:groups`} tracker={tracker}>
            <MessageTurn
              speaker="You"
              text={
                selectedGroups.length > 0
                  ? groups.filter((g) => selectedGroups.includes(g.id)).map((g) => g.label).join(", ")
                  : `Just ${joinNames(requiredNames)}`
              }
            />
          </UserReveal>
          {selectedGroups.length > 0 && (
            // The view lands here once the groups are answered, so the reply is read from its first line.
            <div data-scroll-target={resolved ? undefined : "optional-docs"}>
              <MessageTurn
                speaker="DataTwin"
                text="Here are the documents that go with those. Add any of them now, or continue without."
              />
            </div>
          )}
        </>
      ) : (
        <MessageTurn
          speaker="DataTwin"
          text="I have what I need to start. These optional documents narrow the gap further — add any of them now, or continue without."
        />
      )}

      {files.length > 0 && (
        <>
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
        </>
      )}

      {!resolved && files.length > 0 && (
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
