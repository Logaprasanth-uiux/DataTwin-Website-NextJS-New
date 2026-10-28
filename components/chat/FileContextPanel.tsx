"use client";

import { useEffect, useRef, useState } from "react";
import { visibleRequiredFiles } from "@/lib/chat/engine";
import {
  MOCK_ISSUE_MISSING_COUNT,
  MOCK_ISSUE_ROWS,
  issueFileName,
} from "@/lib/chat/mockFileIssue";
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
  onView,
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
  onRemove: (fileId: string, fileName?: string) => void;
  onTogglePreview: () => void;
  onView: (fileName?: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // With several files allowed, nothing is checked until the user says they are all in (see FileRequirementCard).
  const collecting = Boolean(
    requirement.multiple && upload && !upload.filesConfirmed,
  );
  useMockFileValidation(
    collecting ? undefined : upload,
    requirement.fileId,
    onAdvanceStatus,
    Boolean(validationStage),
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    for (const file of requirement.multiple ? selected : selected.slice(0, 1))
      onUpload(requirement.fileId, file.name);
    event.target.value = "";
  };
  const fileNames = upload ? (upload.fileNames ?? [upload.fileName]) : [];
  const fileCount = fileNames.length;
  // Several files sit under one requirement: list them so each can be told apart, checked and removed.
  const grouped = Boolean(requirement.multiple && fileCount > 1);
  const [expanded, setExpanded] = useState<boolean | null>(null);

  const isReady = upload?.status === "ready";
  const hasIssue =
    validationStage === "issue" || validationStage === "acknowledged";
  const open = grouped && (expanded ?? hasIssue);
  const flaggedName = upload && hasIssue ? issueFileName(upload) : undefined;

  return (
    <div
      className={`flex flex-col gap-1.5 rounded-xl border border-navy-hairline bg-white p-3 ${grouped ? "col-span-2" : ""}`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <span className="text-[12px] leading-snug font-semibold text-navy">
          {requirement.name}
        </span>
        {requirement.level !== "required" && (
          <span className="flex-shrink-0 text-[9.5px] font-semibold tracking-[0.05em] text-navy-faint uppercase">
            {requirement.level === "conditional" ? "Cond." : "Opt."}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={requirement.multiple}
        className="hidden"
        onChange={handleFileChange}
        aria-label={`Upload ${requirement.name}`}
      />

      {!upload && inPortalFlow && (
        <span className="mt-0.5 text-[11.5px] font-medium text-navy-faint">
          Fetching via GST Portal…
        </span>
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
          {grouped ? `Issue in 1 of ${fileCount} files` : "Issue found"}
        </span>
      )}

      {upload && !hasIssue && (
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-navy-muted">
          {isReady ? (
            <CheckIcon className="h-3 w-3 flex-shrink-0 text-accent" />
          ) : (
            <SpinnerIcon className="h-3 w-3 flex-shrink-0 animate-spin text-navy-faint" />
          )}
          {collecting ? "Add more or continue" : STATUS_LABEL[upload.status]}
          {fileCount > 1 && ` · ${fileCount} files`}
        </span>
      )}

      {grouped && (
        <button
          type="button"
          onClick={() => setExpanded(!open)}
          aria-expanded={open}
          className="flex items-center gap-1 text-left text-[11px] font-medium text-accent transition-colors hover:text-navy"
        >
          <ChevronIcon
            className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
          {open ? "Hide files" : "Show files"}
        </button>
      )}

      {open && (
        <ul className="flex flex-col gap-1 border-t border-navy-hairline pt-1.5">
          {fileNames.map((name) => {
            const flagged = name === flaggedName;
            return (
              <li key={name} className="flex items-center gap-1">
                {flagged ? (
                  <IssueIcon className="h-3 w-3 flex-shrink-0 text-crimson" />
                ) : isReady || hasIssue ? (
                  <CheckIcon className="h-3 w-3 flex-shrink-0 text-accent" />
                ) : (
                  <SpinnerIcon className="h-3 w-3 flex-shrink-0 text-navy-faint" />
                )}
                <span
                  title={name}
                  className={`min-w-0 flex-1 truncate text-[11px] ${flagged ? "font-medium text-crimson" : "text-navy-muted"}`}
                >
                  {name}
                </span>
                <button
                  type="button"
                  onClick={flagged ? onTogglePreview : () => onView(name)}
                  title={
                    flagged
                      ? previewOpen
                        ? "Hide affected data"
                        : "View affected data"
                      : `View ${name}`
                  }
                  aria-label={
                    flagged ? `Affected data in ${name}` : `View ${name}`
                  }
                  className={`rounded-md p-0.5 transition-colors ${flagged ? "text-crimson hover:bg-crimson/[0.08]" : "text-navy-muted hover:bg-navy/[0.06] hover:text-accent"}`}
                >
                  <EyeIcon className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(requirement.fileId, name)}
                  title={`Remove ${name}`}
                  aria-label={`Remove ${name}`}
                  className="rounded-md p-0.5 text-navy-faint transition-colors hover:bg-crimson/[0.06] hover:text-crimson"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {upload && grouped && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-left text-[11px] font-medium text-accent transition-colors hover:text-navy"
        >
          + Add another file
        </button>
      )}

      {upload && !grouped && (
        <div className="flex items-center gap-1">
          {hasIssue ? (
            <button
              type="button"
              onClick={onTogglePreview}
              title={previewOpen ? "Hide affected data" : "View affected data"}
              aria-label={
                previewOpen ? "Hide affected data" : "View affected data"
              }
              className="rounded-md p-1 text-crimson transition-colors hover:bg-crimson/[0.08]"
            >
              <EyeIcon className="h-3 w-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onView()}
              title="View file"
              aria-label={`View ${requirement.name}`}
              className="rounded-md p-1 text-navy-muted transition-colors hover:bg-navy/[0.06] hover:text-accent"
            >
              <EyeIcon className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            title={requirement.multiple ? "Add another file" : "Replace file"}
            aria-label={`${requirement.multiple ? "Add to" : "Replace"} ${requirement.name}`}
            className="rounded-md p-1 text-navy-muted transition-colors hover:bg-navy/[0.06] hover:text-accent"
          >
            <ReplaceIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(requirement.fileId)}
            title={fileCount > 1 ? "Remove all files" : "Remove file"}
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

// The mock "affected data" preview — stands in for a real document viewer, with the flagged
// column called out. Rendered as a dedicated right-side drawer that overlays the Files panel
// (fixed positioning takes it out of that layout entirely) instead of expanding inline, so it has
// real width/height to show a useful number of rows and columns rather than a tiny snippet, and so
// opening it never reflows the panel or the conversation behind it. Dismissible via the close
// button, the backdrop, or Escape — never disturbs the underlying chat.
function FileIssueDrawer({
  requirement,
  onClose,
  mode = "issue",
  fileName,
}: {
  requirement: FileRequirement;
  onClose: () => void;
  /** "preview" is the plain view of a healthy file: same mock table, nothing flagged. */
  mode?: "issue" | "preview";
  fileName?: string;
}) {
  const isIssue = mode === "issue";
  // A healthy file has no blank GSTINs, so the preview fills the gaps with plausible values.
  const rows = isIssue
    ? MOCK_ISSUE_ROWS
    : MOCK_ISSUE_ROWS.map((row, i) => ({
        ...row,
        gstin: row.gstin || `27AABCD${1000 + i * 37}K1Z${i % 10}`,
      }));
  // Mounts closed and transitions open on the next frame, so the slide-in actually animates
  // instead of the drawer just appearing already in place.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Downloads the same mock table shown below as a CSV — there's no real document behind this
  // (see mockFileIssue.ts), so this hands back the identical illustrative data rather than
  // fabricating a second, inconsistent mock on the way out.
  const handleDownload = () => {
    const csvField = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const header = ["Invoice No.", "Vendor", "GSTIN", "Amount"]
      .map(csvField)
      .join(",");
    const csvRows = rows.map((row) =>
      [row.invoice, row.vendor, row.gstin || "Missing", row.amount]
        .map(csvField)
        .join(","),
    );
    const csv = [header, ...csvRows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${requirement.name.replace(/[^a-z0-9]+/gi, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-navy/10 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${isIssue ? "Affected data" : "File preview"} — ${requirement.name}`}
        className={`fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col border-l border-navy-hairline bg-white shadow-soft transition-transform duration-300 ease-out sm:max-w-lg ${
          shown ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-navy-hairline p-5">
          <div>
            <p
              className={`text-[10.5px] font-semibold tracking-[0.06em] uppercase ${isIssue ? "text-crimson" : "text-navy-faint"}`}
            >
              {isIssue ? "Affected data" : "File preview"}
            </p>
            <h3 className="mt-1 text-[15px] font-semibold text-navy">
              {requirement.name}
            </h3>
            {fileName && (
              <p className="mt-0.5 break-all text-[12px] text-navy-muted">
                {fileName}
              </p>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleDownload}
              title="Download"
              aria-label={`Download ${requirement.name}`}
              className="rounded-md p-1.5 text-navy-muted transition-colors hover:bg-navy/[0.06] hover:text-navy"
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close"
              aria-label="Close"
              className="rounded-md p-1.5 text-navy-muted transition-colors hover:bg-navy/[0.06] hover:text-navy"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="dt-thin-scroll flex-1 overflow-y-auto p-5">
          <div className="overflow-x-auto rounded-lg border border-navy-hairline">
            <table className="w-full min-w-[440px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-navy-hairline text-navy-muted">
                  <th className="px-3 py-2 font-medium">Invoice No.</th>
                  <th className="px-3 py-2 font-medium">Vendor</th>
                  <th
                    className={`px-3 py-2 font-medium ${isIssue ? "bg-crimson/[0.08] text-crimson" : ""}`}
                  >
                    GSTIN
                  </th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="text-navy-body">
                {rows.map((row) => (
                  <tr
                    key={row.invoice}
                    className="border-b border-navy-hairline last:border-0"
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.invoice}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.vendor}
                    </td>
                    <td
                      className={`px-3 py-2 whitespace-nowrap ${!isIssue ? "" : row.gstin ? "bg-crimson/[0.03]" : "bg-crimson/[0.08] font-medium text-crimson"}`}
                    >
                      {row.gstin || "Missing"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isIssue ? (
            <p className="mt-4 text-[13px] leading-relaxed text-navy-body">
              The highlighted{" "}
              <span className="font-medium text-navy">GSTIN</span> column is
              missing for {MOCK_ISSUE_MISSING_COUNT} of {MOCK_ISSUE_ROWS.length}{" "}
              rows — without it, those rows cannot be confidently matched during
              reconciliation.
            </p>
          ) : (
            <p className="mt-4 text-[12.5px] leading-relaxed text-navy-muted">
              Sample view of the first {rows.length} rows.
            </p>
          )}
        </div>
      </aside>
    </>
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
  optionalGroups,
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
  /** The groups answered on the optional-documents question, so only the offered documents are listed. */
  optionalGroups?: string[];
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string, fileName?: string) => void;
  onTogglePreview: (fileId: string) => void;
}) {
  const [viewing, setViewing] = useState<{ id: string; name?: string } | null>(
    null,
  );
  if (!topic) return null;
  const visibleRequired = visibleRequiredFiles(topic, uploads, maxRevealed);
  const requiredReady = topic.requiredFiles.every(
    (f) => uploads[f.fileId]?.status === "ready",
  );
  // Optional/conditional files only ever get introduced in the conversation once the required
  // files are ready AND the topic doesn't skip straight to verification via autoAdvanceMessage
  // (see FileUploadStep, which gates its own optional-file offer the same way) — mirror that here
  // so the panel never lists a document with "+ Add file" before the chat has actually asked for
  // it. One already uploaded stays visible regardless (nothing to hide once it's part of the
  // conversation).
  const optionalFilesIntroduced = requiredReady && !topic.autoAdvanceMessage;
  const visibleOptional = topic.optionalFiles.filter(
    (f) => optionalFilesIntroduced || uploads[f.fileId],
  );
  // The optional documents of a scripted check live in its checkpoints and are offered together once
  // the required ones are in (and, where the topic asks which groups apply, only the chosen groups').
  // They are listed here as soon as they are on offer, with whatever is already added.
  const offeredOptional = (topic.furtherCheckpoints ?? [])
    .filter((checkpoint) => {
      if (checkpoint.files.some((f) => uploads[f.fileId])) return true;
      if (!requiredReady || !topic.autoAdvanceMessage) return false;
      if (!topic.optionalGroups) return true;
      return (
        optionalGroups !== undefined &&
        checkpoint.group !== undefined &&
        optionalGroups.includes(checkpoint.group)
      );
    })
    .flatMap((checkpoint) =>
      checkpoint.files.map((f) => ({ ...f, level: "optional" as const })),
    );
  const seen = new Set<string>();
  const files = [
    ...visibleRequired,
    ...visibleOptional,
    ...offeredOptional,
  ].filter((f) => {
    if (seen.has(f.fileId)) return false;
    seen.add(f.fileId);
    return true;
  });
  const flaggedFile = files.find(
    (f) =>
      fileValidation[f.fileId] === "issue" ||
      fileValidation[f.fileId] === "acknowledged",
  );

  const viewingFile =
    files.find((f) => f.fileId === viewing?.id && uploads[f.fileId]) ?? null;

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
              onView={(name) => setViewing({ id: file.fileId, name })}
            />
          ))}
        </div>
      </div>
      {viewingFile && (
        <FileIssueDrawer
          mode="preview"
          requirement={viewingFile}
          fileName={viewing?.name ?? uploads[viewingFile.fileId]?.fileName}
          onClose={() => setViewing(null)}
        />
      )}
      {flaggedFile && filePreviewOpen[flaggedFile.fileId] && (
        <FileIssueDrawer
          requirement={flaggedFile}
          fileName={issueFileName(uploads[flaggedFile.fileId])}
          onClose={() => onTogglePreview(flaggedFile.fileId)}
        />
      )}
    </aside>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IssueIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 5.25v3.5M8 10.75h.01"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.25"
      />
      <path
        d="M14 8a6 6 0 00-6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 2.5v7M8 9.5L5 6.5M8 9.5l3-3M3 11.5v1.5A1.5 1.5 0 004.5 14.5h7a1.5 1.5 0 001.5-1.5v-1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReplaceIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
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
