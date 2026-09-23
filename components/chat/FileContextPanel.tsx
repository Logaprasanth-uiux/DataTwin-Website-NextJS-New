"use client";

import { useRef } from "react";
import { visibleRequiredFiles } from "@/lib/chat/engine";
import type { FileRequirement, ReconciliationTopic, UploadedFile } from "@/lib/chat/types";
import { useMockFileValidation } from "./useMockFileValidation";

const STATUS_LABEL: Record<UploadedFile["status"], string> = {
  uploaded: "Uploading…",
  recognised: "Checking…",
  ready: "Uploaded",
};

function CompactFileCard({
  requirement,
  upload,
  onUpload,
  onAdvanceStatus,
  onRemove,
}: {
  requirement: FileRequirement;
  upload: UploadedFile | undefined;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useMockFileValidation(upload, requirement.fileId, onAdvanceStatus);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) onUpload(requirement.fileId, selected.name);
    event.target.value = "";
  };

  const isReady = upload?.status === "ready";

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-navy-hairline bg-white p-3">
      <div className="flex items-start justify-between gap-1.5">
        <span className="text-[12px] leading-snug font-semibold text-navy">{requirement.name}</span>
        {requirement.level !== "required" && (
          <span className="flex-shrink-0 text-[9.5px] font-semibold tracking-[0.05em] text-navy-faint uppercase">
            {requirement.level === "conditional" ? "Cond." : "Opt."}
          </span>
        )}
      </div>

      <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} aria-label={`Upload ${requirement.name}`} />

      {!upload && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-0.5 text-left text-[11.5px] font-medium text-accent transition-colors hover:text-navy"
        >
          + Add file
        </button>
      )}

      {upload && (
        <>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-navy-muted">
            {isReady ? (
              <CheckIcon className="h-3 w-3 flex-shrink-0 text-accent" />
            ) : (
              <SpinnerIcon className="h-3 w-3 flex-shrink-0 animate-spin text-navy-faint" />
            )}
            {STATUS_LABEL[upload.status]}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              title="Replace file"
              aria-label={`Replace ${requirement.name}`}
              className="rounded-md p-1 text-navy-muted transition-colors hover:bg-navy/[0.06] hover:text-accent"
            >
              <ReplaceIcon className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(requirement.fileId)}
              title="Remove file"
              aria-label={`Remove ${requirement.name}`}
              className="rounded-md p-1 text-navy-faint transition-colors hover:bg-crimson/[0.06] hover:text-crimson"
            >
              <TrashIcon className="h-3 w-3" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// The persistent, compact status board for the current reconciliation's files — mirrors the
// conversation's own progressive reveal (see visibleRequiredFiles) rather than dumping every
// required/optional document up front, and only as tall as its content: it never reserves empty
// space, and simply grows as more files come into view.
export function FileContextPanel({
  topic,
  uploads,
  maxRevealed,
  onUpload,
  onAdvanceStatus,
  onRemove,
}: {
  topic: ReconciliationTopic | null;
  uploads: Record<string, UploadedFile>;
  maxRevealed: number;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
}) {
  if (!topic) return null;
  const visibleRequired = visibleRequiredFiles(topic, uploads, maxRevealed);
  const requiredReady = topic.requiredFiles.every((f) => uploads[f.fileId]?.status === "ready");
  const files = requiredReady ? [...visibleRequired, ...topic.optionalFiles] : visibleRequired;

  return (
    <aside className="w-full border-t border-navy-hairline bg-white/60 lg:w-72 lg:flex-shrink-0 lg:border-t-0 lg:border-l">
      <div className="p-5 lg:sticky lg:top-16">
        <p className="dt-eyebrow px-1">Files</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {files.map((file) => (
            <CompactFileCard
              key={file.fileId}
              requirement={file}
              upload={uploads[file.fileId]}
              onUpload={onUpload}
              onAdvanceStatus={onAdvanceStatus}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

function ReplaceIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 7.5a5 5 0 018.5-3.5M13 4v3.5H9.5M13 8.5a5 5 0 01-8.5 3.5M3 12v-3.5h3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4.5 4.5V13a1 1 0 001 1h5a1 1 0 001-1V4.5M6.5 7.5v4M9.5 7.5v4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
