"use client";

import { useRef } from "react";
import { visibleRequiredFiles } from "@/lib/chat/engine";
import type {
  FileRequirement,
  FileSourceChoice as FileSourceChoiceValue,
  FileValidationStage,
  ReconciliationTopic,
  UploadedFile,
} from "@/lib/chat/types";
import { useMockFileValidation } from "./useMockFileValidation";

const STATUS_LABEL: Record<UploadedFile["status"], string> = {
  uploaded: "Uploading…",
  recognised: "Checking…",
  ready: "Uploaded",
};

// Mock affected-data rows for the file drawer's "issue" preview (see FileValidationFlow) — never
// real file contents, just plausible-looking placeholder data with the flagged column called out.
const MOCK_PREVIEW_ROWS = [
  { invoice: "INV-2231", vendor: "Orion Traders", gstin: "27AAECA1234F1Z8", amount: "₹84,200" },
  { invoice: "INV-2232", vendor: "Blue Harbor Pvt Ltd", gstin: "", amount: "₹1,12,500" },
  { invoice: "INV-2233", vendor: "Nexa Components", gstin: "24AAKCS5678D1Z3", amount: "₹46,900" },
  { invoice: "INV-2234", vendor: "Ridgeline Supplies", gstin: "", amount: "₹67,300" },
];

function CompactFileCard({
  requirement,
  upload,
  inPortalFlow,
  validationStage,
  previewOpen,
  onUpload,
  onAdvanceStatus,
  onRemove,
  onTogglePreview,
}: {
  requirement: FileRequirement;
  upload: UploadedFile | undefined;
  /** True while this file is mid GST-Portal fetch (see PortalFetchFlow) — the real interaction
   * lives in the conversation, so this card shows status only, not a competing upload trigger. */
  inPortalFlow: boolean;
  /** Set only for the first required file — see ReconciliationTopic/FileValidationFlow. */
  validationStage: FileValidationStage | undefined;
  previewOpen: boolean;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
  onTogglePreview: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useMockFileValidation(upload, requirement.fileId, onAdvanceStatus, Boolean(validationStage));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) onUpload(requirement.fileId, selected.name);
    event.target.value = "";
  };

  const isReady = upload?.status === "ready";
  const hasIssue = validationStage === "issue" || validationStage === "acknowledged";

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

      {!upload && inPortalFlow && (
        <span className="mt-0.5 text-[11.5px] font-medium text-navy-faint">Fetching via GST Portal…</span>
      )}

      {!upload && !inPortalFlow && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-0.5 text-left text-[11.5px] font-medium text-accent transition-colors hover:text-navy"
        >
          + Add file
        </button>
      )}

      {upload && hasIssue && (
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-crimson">
          <IssueIcon className="h-3 w-3 flex-shrink-0" />
          Issue found
        </span>
      )}

      {upload && !hasIssue && (
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-navy-muted">
          {isReady ? (
            <CheckIcon className="h-3 w-3 flex-shrink-0 text-accent" />
          ) : (
            <SpinnerIcon className="h-3 w-3 flex-shrink-0 animate-spin text-navy-faint" />
          )}
          {STATUS_LABEL[upload.status]}
        </span>
      )}

      {upload && (
        <div className="flex items-center gap-1">
          {hasIssue && (
            <button
              type="button"
              onClick={onTogglePreview}
              title={previewOpen ? "Hide affected data" : "View affected data"}
              aria-label={previewOpen ? "Hide affected data" : "View affected data"}
              className="rounded-md p-1 text-crimson transition-colors hover:bg-crimson/[0.08]"
            >
              <EyeIcon className="h-3 w-3" />
            </button>
          )}
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
      )}
    </div>
  );
}

// The mock "affected data" preview — a small illustrative table standing in for a real document
// viewer, with the flagged column called out. Rendered full-width below the file grid (not inside
// one narrow grid cell) so it's actually legible.
function FileIssuePreview({ requirement }: { requirement: FileRequirement }) {
  return (
    <div className="dt-fade-up mt-3 flex flex-col gap-2.5 rounded-xl border border-crimson/25 bg-crimson/[0.03] p-3.5">
      <p className="text-[10.5px] font-semibold tracking-[0.06em] text-crimson uppercase">
        Affected data — {requirement.name}
      </p>
      <div className="overflow-x-auto rounded-lg border border-navy-hairline bg-white">
        <table className="w-full min-w-[260px] text-left text-[11px]">
          <thead>
            <tr className="border-b border-navy-hairline text-navy-muted">
              <th className="px-2 py-1.5 font-medium">Invoice No.</th>
              <th className="px-2 py-1.5 font-medium">Vendor</th>
              <th className="bg-crimson/[0.08] px-2 py-1.5 font-medium text-crimson">GSTIN</th>
              <th className="px-2 py-1.5 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-navy-body">
            {MOCK_PREVIEW_ROWS.map((row) => (
              <tr key={row.invoice} className="border-b border-navy-hairline last:border-0">
                <td className="px-2 py-1.5 whitespace-nowrap">{row.invoice}</td>
                <td className="px-2 py-1.5 whitespace-nowrap">{row.vendor}</td>
                <td
                  className={`px-2 py-1.5 whitespace-nowrap ${row.gstin ? "bg-crimson/[0.03]" : "bg-crimson/[0.08] font-medium text-crimson"}`}
                >
                  {row.gstin || "Missing"}
                </td>
                <td className="px-2 py-1.5 whitespace-nowrap">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11.5px] leading-relaxed text-navy-body">
        The highlighted <span className="font-medium text-navy">GSTIN</span> column is missing for some rows —
        without it, those rows can&apos;t be confidently matched during reconciliation.
      </p>
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
  fileSource,
  fileValidation,
  filePreviewOpen,
  onUpload,
  onAdvanceStatus,
  onRemove,
  onTogglePreview,
}: {
  topic: ReconciliationTopic | null;
  uploads: Record<string, UploadedFile>;
  maxRevealed: number;
  fileSource: Record<string, FileSourceChoiceValue>;
  fileValidation: Record<string, FileValidationStage>;
  filePreviewOpen: Record<string, boolean>;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
  onTogglePreview: (fileId: string) => void;
}) {
  if (!topic) return null;
  const visibleRequired = visibleRequiredFiles(topic, uploads, maxRevealed);
  const requiredReady = topic.requiredFiles.every((f) => uploads[f.fileId]?.status === "ready");
  const files = requiredReady ? [...visibleRequired, ...topic.optionalFiles] : visibleRequired;
  const flaggedFile = files.find(
    (f) => fileValidation[f.fileId] === "issue" || fileValidation[f.fileId] === "acknowledged",
  );

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
              inPortalFlow={fileSource[file.fileId] === "portal"}
              validationStage={fileValidation[file.fileId]}
              previewOpen={Boolean(filePreviewOpen[file.fileId])}
              onUpload={onUpload}
              onAdvanceStatus={onAdvanceStatus}
              onRemove={onRemove}
              onTogglePreview={() => onTogglePreview(file.fileId)}
            />
          ))}
        </div>
        {flaggedFile && filePreviewOpen[flaggedFile.fileId] && <FileIssuePreview requirement={flaggedFile} />}
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

function IssueIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 5.25v3.5M8 10.75h.01" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
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
