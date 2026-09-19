import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { HeroPrompt } from "./HeroPrompt";
import { HeroTrustSignals } from "./HeroTrustSignals";
import { HeroValueCallout } from "./HeroValueCallout";

export function Hero() {
  return (
    <Section
      background="cream-gradient"
      className="pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24"
    >
      <Container className="flex flex-col items-center px-6 text-center sm:px-8 lg:px-10">
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
          <p className="dt-eyebrow max-w-xs text-balance sm:max-w-none">
            Finance observability for the office of the CFO
          </p>
          <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
        </div>

        <h1 className="dt-display mt-8 text-4xl leading-[1.02] font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl">
          <span className="block text-accent">Recover first.</span>
          <span className="block text-navy">Never lose it again.</span>
        </h1>

        <p className="dt-body mt-6 max-w-2xl">
          We find what you have already lost &amp; get it back. Then use the
          same rules to check every transaction in real-time to ensure you
          don&apos;t lose anymore.
        </p>

        <div className="relative mt-12 w-full max-w-[34rem] text-left xl:mt-14">
          <HeroValueCallout className="mb-3 xl:mb-0" />
          <HeroPrompt />
        </div>

        <HeroTrustSignals className="mt-10 sm:mt-12" />
      </Container>
    </Section>
  );
}
