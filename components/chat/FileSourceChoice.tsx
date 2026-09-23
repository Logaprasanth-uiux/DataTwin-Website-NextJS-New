import type { FileRequirement, FileSourceChoice as FileSourceChoiceValue } from "@/lib/chat/types";

// The intro + "why this helps" text for the file this offers has already been shown (folded into
// the previous file's acknowledgement — see ReconciliationTopic.fileAckOverrides), so this is just
// the two ways forward: upload it directly, or pull it straight from the GST Portal instead.
// Styled to match OptionGroup's own choice buttons exactly, since this is the same kind of beat.
export function FileSourceChoice({
  file,
  onChoose,
}: {
  file: FileRequirement;
  onChoose: (source: FileSourceChoiceValue) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <button
        type="button"
        onClick={() => onChoose("upload")}
        className="rounded-xl border border-navy-hairline bg-white px-4 py-2.5 text-left text-[14px] font-medium text-navy shadow-soft transition-colors hover:border-accent hover:bg-accent/[0.05]"
      >
        Upload {file.name}
      </button>
      <button
        type="button"
        onClick={() => onChoose("portal")}
        className="rounded-xl border border-navy-hairline bg-white px-4 py-2.5 text-left text-[14px] font-medium text-navy shadow-soft transition-colors hover:border-accent hover:bg-accent/[0.05]"
      >
        Fetch directly from GST Portal
      </button>
    </div>
  );
}
