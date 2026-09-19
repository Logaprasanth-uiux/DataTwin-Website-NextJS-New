import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { DarpEngine } from "@/components/darp/DarpEngine";
import { DarpExplanation } from "@/components/darp/DarpExplanation";
import { TrustedTicker } from "@/components/darp/TrustedTicker";

export function DarpSection() {
  return (
    <div className="pb-3 sm:pb-5 lg:pb-8">
      <Section id="darp" background="navy" className="py-20 sm:py-24 lg:py-32">
        <Container className="px-6 sm:px-8 lg:px-10">
          <p className="dt-eyebrow dt-eyebrow-accent dt-reveal text-center">
            Discover · Assess · Recover · Prevent
          </p>
          <h2 className="dt-display dt-reveal mt-5 text-center text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
            How DARP works
          </h2>

          <div className="dt-reveal mx-auto mt-14 max-w-6xl sm:mt-16 lg:mt-20">
            <DarpEngine />
          </div>

          <DarpExplanation />
          <TrustedTicker />
        </Container>
      </Section>
    </div>
  );
}
