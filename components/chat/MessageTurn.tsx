// A single turn in the transcript. DataTwin stays left-aligned with an open, card-free
// presentation (the AI as the conversational guide); the user's own turns are right-aligned in a
// solid navy bubble, so the two sides read apart at a glance without becoming a generic chat
// bubble-and-avatar template.
//
// `whitespace-pre-line` on both paragraphs: most copy in this app is single-line and unaffected,
// but some assistant messages are genuinely multi-paragraph (e.g. a "why this helps" callout), and
// the composer already lets a user enter their own line breaks with Shift+Enter — without this,
// both were being silently collapsed onto one line.
// Some assistant messages append a "Why this helps: ..." callout after a blank line (see
// reconciliation.ts's filesIntro/fileAckOverrides) — split it out so it reads as supporting
// context under the main request, not a continuation of equal weight.
const WHY_THIS_HELPS_MARKER = "\n\nWhy this helps:";

export function MessageTurn({ speaker, text }: { speaker: "You" | "DataTwin"; text: string }) {
  if (speaker === "You") {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[85%] flex-col items-end gap-1.5 sm:max-w-[70%]">
          <span className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">You</span>
          <p className="rounded-2xl rounded-br-md bg-navy px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-line text-white">
            {text}
          </p>
        </div>
      </div>
    );
  }

  const markerIndex = text.indexOf(WHY_THIS_HELPS_MARKER);
  const main = markerIndex === -1 ? text : text.slice(0, markerIndex);
  const whyThisHelps = markerIndex === -1 ? null : text.slice(markerIndex + 2);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        DataTwin
      </span>
      <p className="max-w-2xl text-[15.5px] leading-relaxed whitespace-pre-line text-navy-body">{main}</p>
      {whyThisHelps && (
        <p className="max-w-2xl text-[13px] leading-relaxed whitespace-pre-line text-navy-faint italic">{whyThisHelps}</p>
      )}
    </div>
  );
}
