"use client";

import { useEffect, useRef } from "react";
import { describeMockFileIssue } from "@/lib/chat/mockFileIssue";
import type { FileRequirement, FileValidationStage, UploadedFile } from "@/lib/chat/types";
import { FileRequirementCard } from "./FileRequirementCard";
import { MessageTurn } from "./MessageTurn";

const VERIFYING_MS = 1300;

// Wraps the FIRST required file's card only (see FileUploadStep) — every other file uses
// FileRequirementCard directly, unchanged. Once its upload reaches "Structure recognised", this
// runs one mock validation pass instead of silently continuing to "ready" like every other file:
// a brief "Verifying…" beat, then a mock finding (never real parsing), with two ways forward.
export function FileValidationFlow({
  requirement,
  upload,
  validationStage,
  previewOpen,
  onUpload,
  onAdvanceStatus,
  onBeginValidation,
  onFlagIssue,
  onContinueAnyway,
  onReplace,
  onTogglePreview,
}: {
  requirement: FileRequirement;
  upload: UploadedFile | undefined;
  validationStage: FileValidationStage | undefined;
  previewOpen: boolean;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onBeginValidation: (fileId: string) => void;
  onFlagIssue: (fileId: string) => void;
  onContinueAnyway: (fileId: string) => void;
  onReplace: (fileId: string) => void;
  onTogglePreview: (fileId: string) => void;
}) {
  const onBeginValidationRef = useRef(onBeginValidation);
  useEffect(() => {
    onBeginValidationRef.current = onBeginValidation;
  });
  // The moment the ordinary checklist reaches "recognised", kick off this file's own validation
  // pass instead of letting it continue straight to "ready" (see FileRequirementCard's
  // `holdAtRecognised`, which is what stops it from doing that on its own).
  useEffect(() => {
    if (upload?.status === "recognised" && !validationStage) {
      onBeginValidationRef.current(requirement.fileId);
    }
  }, [upload?.status, validationStage, requirement.fileId]);

  const onFlagIssueRef = useRef(onFlagIssue);
  useEffect(() => {
    onFlagIssueRef.current = onFlagIssue;
  });
  useEffect(() => {
    if (validationStage !== "verifying") return;
    const id = window.setTimeout(() => onFlagIssueRef.current(requirement.fileId), VERIFYING_MS);
    return () => window.clearTimeout(id);
  }, [validationStage, requirement.fileId]);

  if (!upload || upload.status !== "recognised" || !validationStage) {
    // Not yet at the point where validation matters — upload prompt, "Uploading…" and "Structure
    // recognised" all look exactly like they do for any other file.
    return (
      <FileRequirementCard
        requirement={requirement}
        upload={upload}
        onUpload={onUpload}
        onAdvanceStatus={onAdvanceStatus}
        onRemove={() => onReplace(requirement.fileId)}
        holdAtRecognised
      />
    );
  }

  if (validationStage === "verifying") {
    return (
      <div className="flex flex-col gap-2.5 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft">
        <h4 className="text-[14.5px] font-semibold text-navy">{requirement.name}</h4>
        <div className="flex items-center gap-2.5 text-[13px] text-navy-muted">
          <SpinnerIcon className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-accent" />
          Verifying file…
        </div>
      </div>
    );
  }

  // "issue" (awaiting a decision) or "acknowledged" (continued anyway — FileUploadStep swaps this
  // slot for the normal ready acknowledgement as soon as the upload itself reaches "ready", so
  // this branch is only ever visible for the brief moment in between).
  return (
    <div className="flex flex-col gap-3">
      <MessageTurn
        speaker="DataTwin"
        text={`We found an issue in ${requirement.name}. The GSTIN field appears to be missing for some records, so the reconciliation can currently use only part of the available data.`}
      />
      <div className="flex flex-col gap-3 rounded-2xl border border-crimson/25 bg-crimson/[0.03] p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <span className="truncate text-[13.5px] font-medium text-navy">{upload.fileName}</span>
          <span className="flex-shrink-0 rounded-full bg-crimson/[0.1] px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.06em] text-crimson uppercase">
            Issue found
          </span>
        </div>

        <p className="text-[12.5px] leading-relaxed text-crimson">{describeMockFileIssue()}</p>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onTogglePreview(requirement.fileId)}
            aria-pressed={previewOpen}
            className="dt-button inline-flex h-10 items-center gap-1.5 rounded-full border border-accent/40 px-4 text-[13px] font-medium text-accent transition-colors hover:border-accent hover:bg-accent/[0.06]"
          >
            <EyeIcon className="h-3.5 w-3.5" />
            {previewOpen ? "Hide affected data" : "View affected data"}
          </button>
          <button
            type="button"
            onClick={() => onContinueAnyway(requirement.fileId)}
            className="dt-button h-10 rounded-full bg-navy px-4 text-[13px] text-white transition-colors hover:bg-navy/90"
          >
            Continue anyway
          </button>
          <button
            type="button"
            onClick={() => onReplace(requirement.fileId)}
            className="dt-button h-10 rounded-full border border-navy-hairline px-4 text-[13px] text-navy transition-colors hover:border-accent"
          >
            Replace / re-upload file
          </button>
        </div>
      </div>
    </div>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
