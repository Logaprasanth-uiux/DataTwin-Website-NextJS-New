// A single turn in the transcript. DataTwin stays left-aligned with an open, card-free
// presentation (the AI as the conversational guide); the user's own turns are right-aligned in a
// solid navy bubble, so the two sides read apart at a glance without becoming a generic chat
// bubble-and-avatar template.
export function MessageTurn({ speaker, text }: { speaker: "You" | "DataTwin"; text: string }) {
  if (speaker === "You") {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[85%] flex-col items-end gap-1.5 sm:max-w-[70%]">
          <span className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">You</span>
          <p className="rounded-2xl rounded-br-md bg-navy px-4 py-2.5 text-[14.5px] leading-relaxed text-white">
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        DataTwin
      </span>
      <p className="max-w-2xl text-[15.5px] leading-relaxed text-navy-body">{text}</p>
    </div>
  );
}
