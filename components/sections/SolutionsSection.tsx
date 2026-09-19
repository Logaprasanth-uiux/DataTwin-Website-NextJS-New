import "@/components/solutions/solutions.css";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CtaLink } from "@/components/ui/CtaLink";
import { MORE_USE_CASES } from "@/components/solutions/solutions-data";
import { SolutionsNetwork } from "@/components/solutions/SolutionsNetwork";

export function SolutionsSection() {
  return (
    <Section id="solutions" background="white" contained={false} className="py-24 sm:py-28 lg:py-36">
      <Container className="px-6 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">Solutions &amp; use cases</p>
          <h2 className="dt-display dt-reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.5rem]">
            <span className="block text-accent">One engine.</span>
            <span className="block text-navy">Every place money is calculated, owed or moved.</span>
          </h2>
          <p className="dt-body dt-reveal mx-auto mt-8 max-w-3xl text-[17px] sm:text-lg">
            DataTwin isn&apos;t a suite of products stitched together. It&apos;s one engine that reads the
            population, rebuilds what should have happened, values the difference, pointed at a different
            set of agreements and controls for each process below. Each one runs the same DARP sequence.
          </p>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <SolutionsNetwork />
        </div>

        {/* The trunk carries on from the engine: the six above are examples, not the limit */}
        <div aria-hidden="true" className="mx-auto mt-0 h-12 w-px bg-navy-hairline lg:h-14" />

        <div className="mx-auto max-w-4xl text-center">
          <h3 className="dt-display dt-reveal text-[2rem] leading-tight font-semibold tracking-[-0.01em] text-navy sm:text-4xl">
            And many more…
          </h3>

          <ul className="mx-auto mt-8 flex flex-wrap justify-center gap-x-2.5 gap-y-3 sm:mt-10">
            {MORE_USE_CASES.map((useCase) => (
              <li
                key={useCase}
                className="dt-reveal inline-flex h-9 items-center rounded-full border border-navy-hairline px-4 text-[13.5px] font-medium text-navy-body transition-colors hover:border-accent hover:text-navy sm:text-[14px]"
              >
                {useCase}
              </li>
            ))}
          </ul>

          <p className="dt-body dt-reveal mx-auto mt-14 max-w-3xl text-[17px] sm:mt-16 sm:text-lg">
            Wherever a reconciliation is needed, where the terms that govern it sit in contracts,
            agreements and documents outside your systems, and the data that settles it is spread across
            several more, the same four stages of DARP apply.
          </p>

          <div className="mt-10 flex justify-center">
            <CtaLink href="#contact">+ Tell us Yours</CtaLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
