"use client";

import { useEffect, useRef, useState } from "react";
import type { FileSourceChoice, PortalFetchStage, ReconciliationCheckpoint, UploadedFile } from "@/lib/chat/types";
import { FileRequirementCard } from "./FileRequirementCard";
import { MessageTurn } from "./MessageTurn";
import { PortalFetchFlow } from "./PortalFetchFlow";
import type { RevealTracker } from "./reveal";

const REFRESH_MS = 1400;

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

// Shown between the (unlocked) summary and the schedule CTA for a scripted multi-round
// reconciliation that doesn't yet include every document. Optional by design: the schedule CTA
// below it is never hidden or gated on this. Each missing document is its own upload (or GST
// Portal fetch, where the round offers one) right here, in any order; "Refresh" then folds
// whatever is ready into the result, and what's still missing stays on offer with a "continue
// without" way out.
export function AccuracyBoostCard({
  itemKey,
  tracker,
  providedFileNames,
  remaining,
  pending,
  appliedCount,
  uploads,
  fileSource,
  portalFetch,
  onUpload,
  onAdvanceStatus,
  onRemove,
  onChooseFileSource,
  onSubmitPortalGstin,
  onPortalFetchComplete,
  onRefresh,
  onDismiss,
}: {
  itemKey: string;
  tracker: RevealTracker;
  providedFileNames: string[];
  remaining: { index: number; checkpoint: ReconciliationCheckpoint }[];
  pending: number[];
  appliedCount: number;
  uploads: Record<string, UploadedFile>;
  fileSource: Record<string, FileSourceChoice>;
  portalFetch: Record<string, PortalFetchStage>;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
  onChooseFileSource: (fileId: string, source: FileSourceChoice) => void;
  onSubmitPortalGstin: (fileId: string) => void;
  onPortalFetchComplete: (fileId: string, fileName: string) => void;
  onRefresh: () => void;
  onDismiss: () => void;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  });
  useEffect(() => {
    if (!refreshing) return;
    const id = window.setTimeout(() => {
      setRefreshing(false);
      onRefreshRef.current();
    }, REFRESH_MS);
    return () => window.clearTimeout(id);
  }, [refreshing]);

  const provided = joinNames(providedFileNames);
  const missingNames = joinNames(remaining.flatMap(({ checkpoint }) => checkpoint.files.map((f) => f.name)));
  const pendingNames = joinNames(
    remaining.filter(({ index }) => pending.includes(index)).flatMap(({ checkpoint }) => checkpoint.files.map((f) => f.name)),
  );

  if (remaining.length === 0) {
    return (
      <div className="rounded-2xl border border-navy-hairline p-5">
        <p className="text-[13.5px] leading-relaxed text-navy-body">
          Your result now includes every document, so this is the tightest number this reconciliation can give.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="dt-eyebrow dt-eyebrow-accent">Optional</p>
        <p className="mt-2 text-[15px] font-medium text-navy">
          {appliedCount === 0 ? "Want a sharper number?" : "Updated. Want it even sharper?"}
        </p>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-navy-body">
          {appliedCount === 0
            ? `This result reconciles your sales against ${provided}. Adding ${remaining.length === 1 ? "the document" : "any of the documents"} below narrows the gap between what your books show and what the GST returns say, so the figure you act on is closer to what an auditor would land on.`
            : `Your result now includes ${provided}. Add ${missingNames} below for a tighter number, or carry on without ${remaining.length === 1 ? "it" : "them"}.`}
        </p>
      </div>

      {remaining.map(({ checkpoint }) =>
        checkpoint.files.map((file) => {
          const upload = uploads[file.fileId];
          const canFetch = checkpoint.portalFetchFileIds?.includes(file.fileId) ?? false;
          if (!upload && canFetch && fileSource[file.fileId] === "portal") {
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
          return (
            <FileRequirementCard
              key={file.fileId}
              requirement={{ ...file, level: "optional", why: checkpoint.accuracyBenefit ?? file.why }}
              upload={upload}
              onUpload={(fileId, fileName) => {
                onChooseFileSource(fileId, "upload");
                onUpload(fileId, fileName);
              }}
              onAdvanceStatus={onAdvanceStatus}
              onRemove={onRemove}
              onChoosePortal={canFetch ? () => onChooseFileSource(file.fileId, "portal") : undefined}
            />
          );
        }),
      )}

      {pending.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {refreshing ? (
            <MessageTurn speaker="DataTwin" text={`Adding ${pendingNames} and recalculating...`} />
          ) : (
            <button
              type="button"
              onClick={() => setRefreshing(true)}
              className="dt-button h-12 w-fit rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90"
            >
              Refresh my result with {pendingNames}
            </button>
          )}
        </div>
      )}

      {appliedCount > 0 && !refreshing && (
        <button
          type="button"
          onClick={onDismiss}
          className="w-fit text-[13.5px] font-medium text-navy-muted underline decoration-navy-hairline underline-offset-4 transition-colors hover:text-navy"
        >
          Continue without {missingNames}
        </button>
      )}

      {appliedCount === 0 && (
        <p className="text-[12.5px] text-navy-faint">
          You can skip this. Scheduling a conversation below works with what you&apos;ve already shared.
        </p>
      )}
    </div>
  );
}
