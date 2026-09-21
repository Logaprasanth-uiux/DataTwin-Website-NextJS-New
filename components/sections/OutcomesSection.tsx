import "@/components/outcomes/outcomes.css";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";
import { OutcomesJourney } from "@/components/outcomes/OutcomesJourney";

export function OutcomesSection() {
  return (
    <Section id="outcomes" background="white" contained={false} className="py-24 sm:py-28 lg:py-36">
      <LongSectionContextLabel label="Outcomes" headingId="outcomes-title" />
      <Container className="px-6 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">Outcomes</p>
          <h2 id="outcomes-title" className="dt-display dt-reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-navy sm:text-5xl lg:text-[3.5rem]">
            What you get, in the order you get it
          </h2>
          <p className="dt-body dt-reveal mx-auto mt-8 max-w-4xl text-[17px] text-balance sm:text-lg">
            The first three arrive before you&apos;ve adopted anything. The rest come with observability.
          </p>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <OutcomesJourney />
        </div>
      </Container>
    </Section>
  );
}
