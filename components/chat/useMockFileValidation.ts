"use client";

import { useEffect } from "react";
import type { UploadedFile } from "@/lib/chat/types";

// Mock validation: a freshly "uploaded" file progresses through structure-recognition to
// ready-for-analysis on its own, standing in for the real parsing/validation a backend would do.
// Shared by every place a file card can appear (the conversation turn, the compact workspace
// panel) so the timing only lives in one place.
export function useMockFileValidation(
  upload: UploadedFile | undefined,
  fileId: string,
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void,
) {
  useEffect(() => {
    if (!upload) return;
    if (upload.status === "uploaded") {
      const id = window.setTimeout(() => onAdvanceStatus(fileId, "recognised"), 550);
      return () => window.clearTimeout(id);
    }
    if (upload.status === "recognised") {
      const id = window.setTimeout(() => onAdvanceStatus(fileId, "ready"), 650);
      return () => window.clearTimeout(id);
    }
  }, [upload, fileId, onAdvanceStatus]);
}
