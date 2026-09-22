"use client";

import { useEffect, useRef } from "react";
import type { FileRequirement, UploadedFile } from "@/lib/chat/types";

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

const STAGE_ORDER: UploadedFile["status"][] = ["uploaded", "recognised", "ready"];

export function FileRequirementCard({
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

  // Mock validation: a freshly "uploaded" file progresses through structure-recognition to
  // ready-for-analysis on its own, standing in for the real parsing/validation a backend would do.
  useEffect(() => {
    if (!upload) return;
    if (upload.status === "uploaded") {
      const id = window.setTimeout(() => onAdvanceStatus(requirement.fileId, "recognised"), 550);
      return () => window.clearTimeout(id);
    }
    if (upload.status === "recognised") {
      const id = window.setTimeout(() => onAdvanceStatus(requirement.fileId, "ready"), 650);
      return () => window.clearTimeout(id);
    }
  }, [upload, requirement.fileId, onAdvanceStatus]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) onUpload(requirement.fileId, selected.name);
    event.target.value = "";
  };

  const activeStageIndex = upload ? STAGE_ORDER.indexOf(upload.status) : -1;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[14.5px] font-semibold text-navy">{requirement.name}</h4>
        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.06em] uppercase ${
            requirement.level === "required"
              ? "bg-crimson/[0.08] text-crimson"
              : "bg-navy/[0.05] text-navy-muted"
          }`}
        >
          {LEVEL_LABEL[requirement.level]}
        </span>
      </div>
      <p className="text-[13.5px] leading-relaxed text-navy-body">{requirement.why}</p>

      {!upload && (
        <>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            aria-label={`Upload ${requirement.name}`}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-navy-hairline px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:border-accent"
          >
            <UploadIcon className="h-3.5 w-3.5 text-accent" />
            Upload file
          </button>
        </>
      )}

      {upload && (
        <div className="mt-1 flex flex-col gap-2 rounded-xl bg-navy/[0.03] p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-medium text-navy">{upload.fileName}</span>
            <button
              type="button"
              onClick={() => onRemove(requirement.fileId)}
              className="flex-shrink-0 text-[12px] font-medium text-navy-faint transition-colors hover:text-crimson"
            >
              Remove
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {CHECKLIST_STAGES.map((stage, index) => {
              const done = index <= activeStageIndex;
              return (
                <li
                  key={stage.status}
                  className={`flex items-center gap-2 text-[12.5px] transition-opacity duration-300 ${
                    done ? "text-navy opacity-100" : "text-navy-faint opacity-50"
                  }`}
                >
                  {done ? (
                    <CheckIcon className="h-3 w-3 flex-shrink-0 text-accent" />
                  ) : (
                    <span aria-hidden="true" className="h-3 w-3 flex-shrink-0 rounded-full border border-navy-hairline" />
                  )}
                  {stage.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function UploadIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
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

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
