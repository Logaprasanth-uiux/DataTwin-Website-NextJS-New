import "@/components/journey/journey.css";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { JOURNEY_ICONS } from "@/components/journey/JourneyIcons";
import { JOURNEY_STEPS } from "@/components/journey/journey-data";
import { ViewGate } from "@/components/solutions/ViewGate";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";

// One dark, contained canvas (the same rounded navy container as "How DARP works") holding the heading
// and the journey together.
//
// The journey is a plain grid:
// - From lg (1024px) it is four equal columns. Each stage is a subgrid spanning five shared rows
//   (number, ring, title, label, description), so every row lines up across all four stages whatever
//   length a title wraps to.
// - Below lg it is a single column: ring and line on the left, text beside them.
// From lg, each stage's number and ring are centred in its equal column, and the text beneath stays
// left-aligned in that column. The connecting line is not one long element: each stage owns the segment
// that leads to the next ring (see journey.css). At lg it is positioned from the edge of its own ring
// (column centre + the ring's 42px radius) to the edge of the next ring, so every ring sits on the same
// axis and the line meets each one cleanly.
//
// Horizontal grid: the same global Container and gutters the header uses (max 1200px, px-6 / sm:px-8 /
// lg:px-10), placed inside the full-width dark canvas exactly as "How DARP works" does. The heading and
// the journey therefore share the header's left and right content edges.

export function NextStepsSection() {
  return (
    <div id="next" className="pb-3 sm:pb-5 lg:pb-8">
      <Section background="navy" className="py-20 sm:py-24 lg:py-32">
        <LongSectionContextLabel label="What happens next" headingId="next-title" />
        <Container className="px-6 sm:px-8 lg:px-10">
          <div className="text-center">
            <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">What happens next</p>
            <h2 id="next-title" className="dt-display dt-reveal mt-5 text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.02em] text-balance sm:text-6xl lg:text-[4.5rem]">
              <span className="block text-accent">You&apos;ll have a number</span>
              <span className="block text-white">before you have a contract.</span>
            </h2>
            <p className="dt-reveal mx-auto mt-8 max-w-3xl text-[17px] leading-[1.7] text-balance text-white/70 sm:text-lg">
              No gated demo, no discovery call before you know what we do, and no commitment until the
              figure is in front of you. Four steps, and you control how far you go.
            </p>
          </div>

          <ViewGate className="mt-16 sm:mt-20 lg:mt-24">
            <ol className="mx-auto grid max-w-3xl auto-rows-auto [--jn-gap:2rem] lg:max-w-none lg:grid-cols-4 lg:gap-x-[var(--jn-gap)] xl:[--jn-gap:3rem]">
              {JOURNEY_STEPS.map((step, index) => {
                const Icon = JOURNEY_ICONS[index];
                const stage = index + 1;
                const isLast = index === JOURNEY_STEPS.length - 1;
                return (
                  <li
                    key={step.number}
                    className="dt-reveal grid grid-cols-[64px_1fr] gap-x-5 lg:row-span-5 lg:grid-cols-1 lg:grid-rows-subgrid lg:gap-x-0"
                  >
                    <span className="col-start-2 row-start-1 h-5 text-[12px] leading-5 font-semibold tracking-[0.14em] text-accent lg:col-start-1 lg:mb-5 lg:text-center">
                      {step.number}
                    </span>

                    {/* The ring, and the line segment that leads on to the next ring */}
                    <div className="col-start-1 row-span-2 row-start-1 flex flex-col items-center lg:relative lg:row-span-1 lg:row-start-2 lg:flex-row lg:justify-center">
                      <div
                        className={`jn-node jn-node-${stage}${isLast ? " jn-node-final" : ""} flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-navy text-white lg:h-[84px] lg:w-[84px]`}
                      >
                        <Icon />
                      </div>
                      {!isLast && (
                        <div
                          aria-hidden="true"
                          className={`jn-seg-${stage} relative w-px flex-1 bg-white/15 lg:absolute lg:top-[calc(50%-0.5px)] lg:left-[calc(50%+42px)] lg:h-px lg:w-[calc(100%+var(--jn-gap)-84px)] lg:flex-none`}
                        >
                          <div className="jn-fill">
                            <span className="jn-dot" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`col-start-2 row-start-2 lg:contents${isLast ? "" : " pb-12"}`}>
                      <h3 className="dt-display mt-2 text-[1.625rem] leading-[1.1] font-semibold tracking-[-0.01em] text-white sm:text-[1.75rem] lg:mt-9 lg:text-[1.5rem] xl:text-[1.75rem]">
                        {step.title}
                      </h3>
                      <p className="mt-4 flex items-center gap-3 lg:mt-5">
                        <span aria-hidden="true" className="h-px w-6 flex-shrink-0 bg-accent" />
                        <span className="text-[11px] leading-[1.6] font-medium tracking-[0.14em] text-white/60 uppercase sm:text-[12px]">
                          {step.label}
                        </span>
                      </p>
                      <p className="mt-4 max-w-md text-[16px] leading-[1.65] text-white/70 lg:mt-5 lg:max-w-none lg:text-[15px] xl:text-[16px]">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </ViewGate>
        </Container>
      </Section>
    </div>
  );
}
