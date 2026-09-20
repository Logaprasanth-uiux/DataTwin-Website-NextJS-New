import { OutcomeIcon } from "./OutcomeIcons";
import {
  PHASE_ONE,
  PHASE_ONE_LABEL,
  PHASE_TWO,
  PHASE_TWO_LABEL,
  type Outcome,
} from "./outcomes-data";
import { ViewGate } from "@/components/solutions/ViewGate";

// One vertical editorial flow with a fine spine down the left, aligned to the page's left content edge:
//
//   . BEFORE YOU'VE ADOPTED ANYTHING
//   |     icon   01 / Title ................ Description
//   |     icon   02 / Title ................ Description
//   |     icon   03 / Title ................ Description
//   o OBSERVABILITY
//   . WITH OBSERVABILITY
//   |     icon   04 / Title ................ Description
//   |     icon   05 ...
//   |     icon   06 ...
//
// It is deliberately not a numbered list, a timeline of dots, or a set of cards: the spine carries only
// three small nodes (the two phase labels and the turning point), the outcomes hang off it with no
// markers of their own, and the numbers are small static labels. The spine is the left border of three
// stacked blocks, so it is one continuous line with no positioning to keep in step. A small orange
// signal travels down it (see outcomes.css), lights the OBSERVABILITY turning point as it passes, and
// carries on down through the second phase.
//
// Below md the row stacks (icon, number, title, description) and the spine indent shrinks.

const EYEBROW = "text-[11px] leading-[1.6] font-medium tracking-[0.14em] uppercase sm:text-[12px]";

// The spine: a left border, with the content indented from it (32px, 64px from md).
const SPINE = "relative border-l border-navy-hairline pl-8 md:pl-16";

// The orange progress laid over the spine, and the signal riding its end. `n` picks its keyframes.
function SpineFill({ n }: { n: 1 | 2 }) {
  return (
    <span aria-hidden="true" className={`oc-sp oc-sp-${n}`}>
      <span className="oc-fill">
        <span className="oc-head" />
      </span>
    </span>
  );
}

// A phase heading: a small node on the spine, a short rule, then the label and a hairline. The negative
// margin pulls the row back onto the spine so the node sits on it (the node is 9px: 5px left of the
// spine's centre line).
function PhaseLabel({ children, live = false }: { children: string; live?: boolean }) {
  return (
    <div className="-ml-[calc(2rem+5px)] flex items-center md:-ml-[calc(4rem+5px)]">
      <span aria-hidden="true" className="h-[9px] w-[9px] flex-shrink-0 rounded-full bg-accent" />
      <span aria-hidden="true" className="mr-2 h-px w-5 flex-shrink-0 bg-accent md:w-[52px]" />
      <p className={`${EYEBROW} ${live ? "text-accent" : "text-navy-muted"}`}>{children}</p>
      <span aria-hidden="true" className="ml-4 h-px flex-1 bg-navy-divider" />
    </div>
  );
}

function OutcomeRow({ outcome, stage }: { outcome: Outcome; stage: number }) {
  return (
    <li
      className={`oc-s${stage} grid pt-10 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-12 md:pt-14`}
    >
      <div className="md:col-start-1 md:row-span-2 md:row-start-1 md:mt-1">
        <OutcomeIcon name={outcome.key} />
      </div>

      <span className="mt-5 text-[12px] leading-5 font-semibold tracking-[0.14em] text-accent md:col-start-2 md:row-start-1 md:mt-0">
        {outcome.number}
      </span>

      <h3 className="dt-display mt-2 text-[1.625rem] leading-[1.1] font-semibold tracking-[-0.01em] text-navy sm:text-[1.75rem] md:col-start-2 md:row-start-2 md:mt-3 lg:text-[2rem]">
        {outcome.title}
      </h3>

      <p className="mt-3 max-w-md text-[16px] leading-[1.65] text-navy-body md:col-start-3 md:row-start-2 md:mt-3 md:max-w-none md:pt-[3px]">
        {outcome.description}
      </p>
    </li>
  );
}

export function OutcomesJourney() {
  return (
    <ViewGate>
      {/* Phase one */}
      <div className={`${SPINE} pb-10 md:pb-14`}>
        <SpineFill n={1} />
        <PhaseLabel>{PHASE_ONE_LABEL}</PhaseLabel>
        <ol>
          {PHASE_ONE.map((outcome, index) => (
            <OutcomeRow key={outcome.key} outcome={outcome} stage={index + 1} />
          ))}
        </ol>
      </div>

      {/* The turning point: the spine reaches OBSERVABILITY */}
      <div className={`${SPINE} pb-10 md:pb-12`}>
        <div className="-ml-[calc(2rem+8px)] flex items-center md:-ml-[calc(4rem+8px)]">
          <span aria-hidden="true" className="oc-tnode h-[15px] w-[15px] flex-shrink-0 rounded-full border" />
          <span aria-hidden="true" className="mr-2 h-px w-[17px] flex-shrink-0 bg-accent md:w-[49px]" />
          <span className={`oc-pill ${EYEBROW} inline-flex h-9 items-center rounded-full border px-5`}>
            Observability
          </span>
        </div>
      </div>

      {/* Phase two: the same system, continued */}
      <div className={SPINE}>
        <SpineFill n={2} />
        <PhaseLabel live>{PHASE_TWO_LABEL}</PhaseLabel>
        <ol>
          {PHASE_TWO.map((outcome, index) => (
            <OutcomeRow key={outcome.key} outcome={outcome} stage={index + 4} />
          ))}
        </ol>
      </div>
    </ViewGate>
  );
}
