import { DARP_STEPS, ENGINE_COPY, MODULES, STAGES } from "./engine-data";

// The information that sits beside the diagram. The reference drew it inside the picture at 12 to 15px; here
// it is real HTML, so it reflows and stays readable on a phone. One panel per view, cross-faded by
// EngineDiagram.

// Three concentric rings with a leader to each stage name: the "rings in this view, the bands in the other".
function StageRings() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14 flex-shrink-0" aria-hidden="true">
      <circle cx="32" cy="32" r="30" className="stroke-navy" strokeOpacity="0.85" />
      <circle cx="32" cy="32" r="20" className="stroke-navy" strokeOpacity="0.55" />
      <circle cx="32" cy="32" r="10" className="stroke-navy" strokeOpacity="0.35" />
      <circle cx="32" cy="32" r="3.5" className="fill-accent" />
    </svg>
  );
}

export function PlanInfo() {
  return (
    <div>
      <p className="dt-eyebrow dt-eyebrow-accent">Inside DataTwin</p>
      <p className="dt-display mt-2 text-[1.25rem] leading-[1.15] font-semibold tracking-[-0.01em] text-navy">
        Six modules, one shared engine
      </p>

      <ul className="mt-4 divide-y divide-navy-divider border-y border-navy-divider">
        {MODULES.map((m) => (
          <li key={m.code} className="flex gap-3.5 py-2.5">
            <span className="dt-display mt-0.5 flex h-7 w-9 flex-shrink-0 items-center justify-center rounded-[5px] bg-navy text-[12px] font-semibold tracking-[0.04em] text-white">
              {m.code}
            </span>
            <div>
              <p className="dt-display text-[14.5px] leading-snug font-semibold text-navy">{m.name}</p>
              <p className="mt-0.5 text-[13px] leading-[1.42] text-navy-body">{m.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-4">
        <StageRings />
        <div>
          <p className="text-[11.5px] font-semibold tracking-[0.14em] text-navy uppercase">The shared engine</p>
          <p className="mt-1 text-[13px] leading-[1.45] text-navy-muted">
            every module runs the same three stages — the rings in this view, the bands in the other
          </p>
        </div>
      </div>
      <ol className="mt-3 flex flex-wrap gap-2">
        {STAGES.map((s, i) => (
          <li
            key={s}
            className="flex items-center gap-2 rounded-full border border-navy-hairline px-3 py-1.5 text-[12.5px] font-medium text-navy"
          >
            <span className="text-[11px] font-semibold tracking-[0.1em] text-accent">{String(i + 1).padStart(2, "0")}</span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

// The four DARP steps as a vertical timeline, in the same visual language as the homepage's "What happens
// next": ring nodes joined by a hairline with a small amber dot travelling down it.
export function SectionInfo() {
  return (
    <div>
      <p className="dt-eyebrow dt-eyebrow-accent">DARP</p>
      <p className="dt-display mt-3 text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.01em] text-navy">
        How every module is delivered
      </p>

      <ol className="mt-7">
        {DARP_STEPS.map((step, i) => {
          const last = i === DARP_STEPS.length - 1;
          return (
            <li key={step.name} className="grid grid-cols-[48px_1fr] gap-x-5">
              <div className="flex flex-col items-center">
                <span className="dt-display flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-navy-hairline bg-white text-[17px] font-semibold text-navy">
                  {step.letter}
                </span>
                {!last && (
                  <span aria-hidden="true" className="ed-seg relative my-1 w-px flex-1 bg-navy-divider">
                    <span className="ed-dot" style={{ animationDelay: `${i * 0.9}s` }} />
                  </span>
                )}
              </div>
              <div className={last ? "" : "pb-7"}>
                <p className="dt-display pt-2.5 text-[1.125rem] leading-tight font-semibold text-navy">{step.name}</p>
                <p className="mt-1.5 flex items-start gap-3 text-[14px] leading-[1.55] text-navy-body">
                  <span aria-hidden="true" className="mt-[11px] h-px w-5 flex-shrink-0 bg-accent" />
                  {step.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-white px-4 py-3 text-[13.5px] leading-[1.5] text-navy">
        <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
        {ENGINE_COPY.exceptions}
      </p>
    </div>
  );
}
