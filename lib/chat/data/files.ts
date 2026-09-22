import type { FileRequirement } from "../types";

// Human-friendly file descriptions, distilled from the DataTwin reconciliation source data
// (File_Requirements). Internal file IDs (F01, F02, ...) are kept only as an internal key —
// they are never rendered in the UI.

const FILE_LIBRARY = {
  F01: {
    name: "GSTR-2B Detail",
    optionalWhy: "Can help investigate supplier-upload or amendment-related differences.",
  },
  F02: {
    name: "GSTR-2B Detail",
    requiredWhy:
      "Helps identify eligible ITC available in the portal and compare it against your books and claims.",
    optionalWhy: "Adds portal-availability context alongside what's already been claimed.",
  },
  F03: {
    name: "GSTR-3B Filing Summary",
    requiredWhy: "Shows what was actually claimed in the filed return, by tax period.",
  },
  F05: {
    name: "Vendor Bill Register",
    requiredWhy:
      "Establishes the invoices recorded in your books and helps identify invoices missing from the portal.",
    optionalWhy: "Helps cross-check eligible ITC against what's actually booked.",
  },
  F10: {
    name: "ITC Claim Working",
    requiredWhy: "Shows what your team determined was eligible and what was actually claimed, invoice by invoice.",
    optionalWhy: "Adds invoice-level detail to strengthen the audit trail.",
  },
} as const;

type FileId = keyof typeof FILE_LIBRARY;

function file(id: FileId, level: FileRequirement["level"]): FileRequirement {
  const entry = FILE_LIBRARY[id];
  const why =
    level === "optional"
      ? (entry as { optionalWhy?: string }).optionalWhy ?? (entry as { requiredWhy: string }).requiredWhy
      : (entry as { requiredWhy: string }).requiredWhy;
  return { fileId: id, name: entry.name, level, why };
}

export const FILES = {
  gstr2bRequired: () => file("F02", "required"),
  gstr2bOptional: () => file("F02", "optional"),
  gstr2aOptional: () => file("F01", "optional"),
  gstr3bRequired: () => file("F03", "required"),
  vendorBillRequired: () => file("F05", "required"),
  vendorBillOptional: () => file("F05", "optional"),
  itcClaimWorkingRequired: () => file("F10", "required"),
  itcClaimWorkingOptional: () => file("F10", "optional"),
};
