import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TrustedTicker } from "@/components/darp/TrustedTicker";

// Pulled out of DarpSection so it reads as its own beat between "How DARP works" and "Solutions &
// use cases" rather than being buried at the bottom of the DARP card.
export function TrustedBySection() {
  return (
    <Section id="trusted-by" background="white" contained={false} className="py-16 sm:py-20 lg:py-24">
      <Container className="px-6 sm:px-8 lg:px-10">
        <TrustedTicker />
      </Container>
    </Section>
  );
}
