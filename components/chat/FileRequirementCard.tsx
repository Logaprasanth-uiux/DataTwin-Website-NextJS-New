"use client";

import { useRef, type ReactNode } from "react";
import type { FileRequirement, UploadedFile } from "@/lib/chat/types";
import { useMockFileValidation } from "./useMockFileValidation";

const LEVEL_LABEL: Record<FileRequirement["level"], string> = {
  required: "Required",
  optional: "Optional",
  conditional: "Conditional",
};

const CHECKLIST_STAGES: { status: UploadedFile["status"]; label: string }[] = [
  { status: "uploaded", label: "Uploaded" },
  { status: "recognised", label: "Structure recognised" },
  { status: "ready", label: "Ready for analysis" },
];

const STAGE_ORDER: UploadedFile["status"][] = [
  "uploaded",
  "recognised",
  "ready",
];

export function FileRequirementCard({
  requirement,
  upload,
  onUpload,
  onAdvanceStatus,
  onRemove,
  onConfirmFiles,
  holdAtRecognised = false,
  onChoosePortal,
  onChooseSap,
  sapNote,
  inlineFlow,
  showWhyLabel = false,
}: {
  requirement: FileRequirement;
  upload: UploadedFile | undefined;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string, fileName?: string) => void;
  /** For a requirement that takes several files: the user is done adding, so checking can start. */
  onConfirmFiles?: (fileId: string) => void;
  /** Stops the mock checklist at "Structure recognised" instead of auto-advancing to "ready" —
   * used only for the first required file, which the caller then takes over from (a mock
   * validation pass) rather than declaring ready silently. */
  holdAtRecognised?: boolean;
  /** Offers "fetch directly from the GST Portal" as a second way to satisfy this requirement,
   * alongside the ever-present "Upload file" — the SAME card either way (see
   * ReconciliationTopic.portalFetchFileIds), rather than a differently-styled choice step ahead of
   * it. Switches the caller over to PortalFetchFlow; this card plays no further part once chosen. */
  onChoosePortal?: () => void;
  /** Offers "Connect SAP" for a document that comes from the user's ERP (see SapConnectFlow). */
  onChooseSap?: () => void;
  /** Shown under the buttons when SAP is not connected yet, so the missing button is explained. */
  sapNote?: string;
  /** A fetch in progress (GST Portal or SAP), shown inside this card in place of the buttons, so the
   * card stays where it is in the grid instead of being swapped for a full-width row. */
  inlineFlow?: ReactNode;
  /** Leads the description with a bold "Why this helps:", used where it is the benefit of adding the
   * document (optional offers) rather than a plain description of the file. */
  showWhyLabel?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // With several files allowed, nothing is checked until the user says they are all in.
  const collecting = Boolean(
    requirement.multiple && upload && !upload.filesConfirmed && onConfirmFiles,
  );
  useMockFileValidation(
    collecting ? undefined : upload,
    requirement.fileId,
    onAdvanceStatus,
    holdAtRecognised,
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    // A requirement that takes several files adds every one picked; otherwise only the first counts.
    for (const file of requirement.multiple ? selected : selected.slice(0, 1))
      onUpload(requirement.fileId, file.name);
    event.target.value = "";
  };
  const fileNames = upload ? (upload.fileNames ?? [upload.fileName]) : [];

  const activeStageIndex = upload ? STAGE_ORDER.indexOf(upload.status) : -1;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[14.5px] font-semibold text-navy">
          {requirement.name}
        </h4>
        <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-1.5">
          {requirement.multiple && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/[0.14] px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.06em] text-navy uppercase">
              <FilesIcon className="h-3 w-3 text-accent" />
              Multiple files
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.06em] uppercase ${
              requirement.level === "required"
                ? "bg-crimson/[0.08] text-crimson"
                : "bg-navy/[0.05] text-navy-muted"
            }`}
          >
            {LEVEL_LABEL[requirement.level]}
          </span>
        </div>
      </div>
      {/* Same look as the "Why this helps" line under a request in MessageTurn: small, italic, faint. */}
      <p
        className={
          showWhyLabel
            ? "text-[13px] leading-relaxed text-navy-faint italic"
            : "text-[13.5px] leading-relaxed text-navy-body"
        }
      >
        {showWhyLabel && "Why this helps: "}
        {requirement.why}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple={requirement.multiple}
        className="hidden"
        onChange={handleFileChange}
        aria-label={`Upload ${requirement.name}`}
      />

      {!upload && requirement.multiple && (
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-navy">
            Add as many files as you need
          </p>
          <ul className="flex flex-wrap gap-2">
            {["Balance sheet", "Profit and loss", "Notes to accounts"].map(
              (name) => (
                <li
                  key={name}
                  className="rounded-full bg-accent/[0.12] px-3 py-1 text-[12px] font-medium text-navy"
                >
                  {name}
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {!upload && inlineFlow && <div className="mt-1">{inlineFlow}</div>}

      {!upload && !inlineFlow && (
        <div className="mt-1 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-navy-hairline px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:border-accent"
          >
            {requirement.multiple ? (
              <FilesIcon className="h-3.5 w-3.5 text-accent" />
            ) : (
              <UploadIcon className="h-3.5 w-3.5 text-accent" />
            )}
            {requirement.multiple ? "Upload files" : "Upload file"}
          </button>
          {onChoosePortal && (
            <button
              type="button"
              onClick={onChoosePortal}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-navy-hairline px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:border-accent"
            >
              <PortalIcon className="h-3.5 w-3.5 text-accent" />
              Fetch from GST Portal
            </button>
          )}
          {onChooseSap && (
            <button
              type="button"
              onClick={onChooseSap}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-navy-hairline px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:border-accent"
            >
              <SapIcon className="h-3.5 w-3.5 text-accent" />
              Fetch from SAP
            </button>
          )}
        </div>
      )}

      {!upload && !inlineFlow && sapNote && (
        <p className="-mt-1 text-[12px] text-navy-faint">{sapNote}</p>
      )}

      {upload && (
        <div className="mt-1 flex flex-col gap-2 rounded-xl bg-navy/[0.03] p-3.5">
          {requirement.multiple ? (
            <>
              <ul className="flex flex-col gap-1">
                {fileNames.map((name, index) => (
                  <li
                    key={`${name}-${index}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="truncate text-[13px] font-medium text-navy">
                      {name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(requirement.fileId, name)}
                      title="Remove file"
                      aria-label={`Remove ${name}`}
                      className="flex-shrink-0 rounded-md p-1.5 text-navy-faint transition-colors hover:bg-crimson/[0.06] hover:text-crimson"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              {(collecting || !onConfirmFiles) && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex w-fit items-center gap-1.5 text-[12.5px] font-medium text-accent transition-colors hover:text-navy"
                >
                  <UploadIcon className="h-3 w-3" />
                  Add another file
                </button>
              )}
              {collecting && (
                <button
                  type="button"
                  onClick={() => onConfirmFiles?.(requirement.fileId)}
                  className="dt-button mt-1 h-11 w-fit rounded-full bg-navy px-5 text-[13.5px] text-white transition-colors hover:bg-navy/90"
                >
                  Continue with {fileNames.length}{" "}
                  {fileNames.length === 1 ? "file" : "files"}
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[13px] font-medium text-navy">
                {upload.fileName}
              </span>
              <div className="flex flex-shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  title="Replace file"
                  aria-label={`Replace ${requirement.name}`}
                  className="rounded-md p-1.5 text-navy-muted transition-colors hover:bg-navy/[0.06] hover:text-accent"
                >
                  <ReplaceIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(requirement.fileId)}
                  title="Remove file"
                  aria-label={`Remove ${requirement.name}`}
                  className="rounded-md p-1.5 text-navy-faint transition-colors hover:bg-crimson/[0.06] hover:text-crimson"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
          {!collecting && (
            <ul className="flex flex-col gap-1">
              {CHECKLIST_STAGES.map((stage, index) => {
                const done = index <= activeStageIndex;
                return (
                  <li
                    key={stage.status}
                    className={`flex items-center gap-2 text-[12.5px] transition-opacity duration-300 ${
                      done
                        ? "text-navy opacity-100"
                        : "text-navy-faint opacity-50"
                    }`}
                  >
                    {done ? (
                      <CheckIcon className="h-3 w-3 flex-shrink-0 text-accent" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 flex-shrink-0 rounded-full border border-navy-hairline"
                      />
                    )}
                    {stage.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function UploadIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 10.5V2.5M8 2.5L5 5.5M8 2.5l3 3M3 11v1.5A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5V11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilesIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5.5 3.5V3a1 1 0 011-1H12a1 1 0 011 1v7a1 1 0 01-1 1h-.5M3.5 5h6a1 1 0 011 1v7a1 1 0 01-1 1h-6a1 1 0 01-1-1V6a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PortalIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 3.5H4.5a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V9M10.5 2.5H13.5V5.5M13 3L8.5 7.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SapIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse
        cx="8"
        cy="4"
        rx="4.5"
        ry="1.75"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M3.5 4v8c0 .97 2 1.75 4.5 1.75s4.5-.78 4.5-1.75V4M3.5 8c0 .97 2 1.75 4.5 1.75S12.5 8.97 12.5 8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
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
