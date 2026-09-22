import type { ReconciliationTopic, UploadedFile } from "@/lib/chat/types";
import { FileRequirementCard } from "./FileRequirementCard";
import { MessageTurn } from "./MessageTurn";
import { UserReveal, type RevealTracker } from "./reveal";

export function FileUploadStep({
  itemKey,
  tracker,
  topic,
  uploads,
  resolved,
  requiredReady,
  onUpload,
  onAdvanceStatus,
  onRemove,
  onContinue,
}: {
  itemKey: string;
  tracker: RevealTracker;
  topic: ReconciliationTopic;
  uploads: Record<string, UploadedFile>;
  resolved: boolean;
  requiredReady: boolean;
  onUpload: (fileId: string, fileName: string) => void;
  onAdvanceStatus: (fileId: string, status: UploadedFile["status"]) => void;
  onRemove: (fileId: string) => void;
  onContinue: () => void;
}) {
  if (resolved) {
    const providedNames = topic.requiredFiles.map((req) => uploads[req.fileId]?.fileName).filter(Boolean);
    return (
      <UserReveal itemKey={`${itemKey}:resolved`} tracker={tracker}>
        <MessageTurn speaker="You" text={`Files provided — ${providedNames.join(", ")}`} />
      </UserReveal>
    );
  }

  const allFiles = [...topic.requiredFiles, ...topic.optionalFiles];

  return (
    <div className="dt-fade-up flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {allFiles.map((requirement) => (
          <FileRequirementCard
            key={requirement.fileId}
            requirement={requirement}
            upload={uploads[requirement.fileId]}
            onUpload={onUpload}
            onAdvanceStatus={onAdvanceStatus}
            onRemove={onRemove}
          />
        ))}
      </div>

      {requiredReady && (
        <button
          type="button"
          onClick={onContinue}
          className="dt-button h-12 w-fit rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90"
        >
          Continue to verification
        </button>
      )}
    </div>
  );
}
