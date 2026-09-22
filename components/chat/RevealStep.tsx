import type { ReconciliationTopic } from "@/lib/chat/types";
import { BlurredInsightPreview } from "./BlurredInsightPreview";

export function RevealStep({ topic }: { topic: ReconciliationTopic }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          DataTwin
        </span>
        <p className="dt-display text-2xl font-semibold tracking-[-0.01em] text-navy">Recovery analysis unlocked</p>
      </div>

      <BlurredInsightPreview rows={topic.mockResult.previewRows} revealed />

      <div className="rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
        <p className="text-[13.5px] font-medium text-navy">Suggested next actions</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {topic.mockResult.nextActions.map((action) => (
            <li key={action} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-navy-body">
              <span aria-hidden="true" className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
              {action}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[12px] text-navy-faint">
        Prototype data — these categories, amounts and next actions are illustrative examples, not a real
        analysis of your records.
      </p>
    </div>
  );
}
