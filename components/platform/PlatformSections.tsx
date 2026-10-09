import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { RecoveryCtaButton } from "@/components/chat/RecoveryCtaButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";
import { DashboardShowcase } from "./DashboardShowcase";
import { EngineDiagram } from "./EngineDiagram";
import { PlatformIcon } from "./PlatformIcons";
import { AiCallout, FeatureCard, StageHeader } from "./PlatformParts";
import { ACQUISITION, ACROSS, AI_NATIVE, DASHBOARDS, HERO_PROOF, PROCESSING } from "./platform-data";

// Section rhythm, top to bottom: canvas hero, white engine, cream (01), navy (02), white (03), cream
// (AI-native), white (across the platform), then the global closing CTA + footer on the canvas. Every
// contained band is wrapped in the same `pb-3 sm:pb-5 lg:pb-8` gap the homepage uses.

const BAND = "pb-3 sm:pb-5 lg:pb-8";
const PAD_L = "py-24 sm:py-28 lg:py-36";
const PAD_M = "py-20 sm:py-24 lg:py-32";

function CenteredHeader({ eyebrow, id, children, body }: { eyebrow: string; id: string; children: React.ReactNode; body?: string }) {
  return (
    <div className="text-center">
      <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">{eyebrow}</p>
      <h2
        id={id}
        className="dt-display dt-reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.5rem]"
      >
        {children}
      </h2>
      {body && <p className="dt-body dt-reveal mx-auto mt-8 max-w-3xl text-[17px] text-balance sm:text-lg">{body}</p>}
    </div>
  );
}

// ---- Hero ------------------------------------------------------------------------------------------------

export function PlatformHero() {
  return (
    // id="hero" is what the header looks for to match its dark-canvas treatment, exactly as on the homepage.
    <Section id="hero" background="canvas" className="pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      <Container className="flex flex-col items-center px-6 text-center sm:px-8 lg:px-10">
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
          <p className="dt-eyebrow max-w-sm text-balance sm:max-w-none">
            The engine underneath the DARP framework, FSCP and everything that follows
          </p>
          <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
        </div>

        <h1 className="dt-display mt-8 text-4xl leading-[1.02] font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
          <span className="block text-accent">One engine.</span>
          <span className="block text-navy">Solve as many problems as you have.</span>
        </h1>

        <p className="dt-body mt-8 max-w-3xl text-[17px] text-balance sm:text-lg">
          Not a separate system for every problem. Each one runs the same framework: Discover, Assess and
          Recover to plug the leakage first, then the same rules go into Prevent to stop it coming back.
          The engine wraps the systems you already run. Nothing migrated, nothing switched off.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <RecoveryCtaButton entryContext="recovery-cta" variant="solid">
            Discover your Number
          </RecoveryCtaButton>
          <CtaLink href="/#darp" variant="outline">
            The DARP framework
          </CtaLink>
        </div>

        <ul className="mt-14 grid w-full max-w-5xl border-y border-navy-hairline sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_PROOF.map((item, i) => (
            <li
              key={item}
              className={`flex items-center justify-center gap-3 border-navy-divider px-4 py-5 text-[14px] leading-snug font-medium text-navy sm:py-6 ${
                i > 0 ? "border-t sm:border-t-0" : ""
              } ${i % 2 === 1 ? "sm:border-l" : ""} ${i === 2 ? "sm:border-t lg:border-t-0" : ""} ${i === 3 ? "sm:border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l" : ""}`}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

// ---- The shared engine -----------------------------------------------------------------------------------

export function EngineSection() {
  return (
    <div className={`${BAND} pt-3 sm:pt-5 lg:pt-8`}>
      <Section id="engine" background="white" className={PAD_M}>
        <LongSectionContextLabel label="The shared engine" headingId="engine-title" />
        <Container className="px-6 sm:px-8 lg:px-10">
          <CenteredHeader
            eyebrow="End to end"
            id="engine-title"
            body="The DARP framework and FSCP do not have separate building blocks. They are different questions asked of the same engine. Every problem is configuration on that engine."
          >
            <span className="block text-accent">One engine.</span>
            <span className="block text-navy">Every solution runs on it.</span>
          </CenteredHeader>

          <div className="dt-reveal mt-16 sm:mt-20">
            <p className="flex items-center justify-center gap-4">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              <span className="dt-eyebrow">The shared engine</span>
              <span className="dt-display text-[15px] font-semibold text-navy">Shared by every product.</span>
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
            </p>

            <div className="mt-8">
              <EngineDiagram />
            </div>
          </div>

          <p className="dt-body dt-reveal mx-auto mt-12 max-w-3xl text-center text-[17px] text-balance sm:mt-14 sm:text-lg">
            Custom build, SaaS or spreadsheet, it does not matter. We plug in, clean up and lock down
            control. A first pass through the engine returns your number in about two minutes.
          </p>
        </Container>
      </Section>
    </div>
  );
}

// ---- 01 Data acquisition & modeling ----------------------------------------------------------------------

export function AcquisitionSection() {
  return (
    <div className={BAND}>
      <Section id="acquisition" background="cream-gradient" className={PAD_L}>
        <LongSectionContextLabel label="Data acquisition & modeling" headingId="acquisition-title" />
        <Container className="px-6 sm:px-8 lg:px-10">
          <StageHeader
            number={ACQUISITION.number}
            title={ACQUISITION.title}
            intro={ACQUISITION.intro}
            headingId="acquisition-title"
          />
          <div className="mt-14 grid gap-5 sm:mt-16 lg:mt-20 lg:grid-cols-3 lg:gap-6">
            {ACQUISITION.features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>
          <div className="mt-5 lg:mt-6">
            <AiCallout {...ACQUISITION.ai} />
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- 02 Data processing & analysis -----------------------------------------------------------------------

export function ProcessingSection() {
  return (
    <div className={BAND}>
      <Section id="processing" background="navy" className={PAD_L}>
        <LongSectionContextLabel label="Data processing & analysis" headingId="processing-title" />
        <Container className="px-6 sm:px-8 lg:px-10">
          <StageHeader
            number={PROCESSING.number}
            title={PROCESSING.title}
            intro={PROCESSING.intro}
            headingId="processing-title"
            tone="dark"
          />
          <div className="mt-14 grid gap-5 sm:mt-16 lg:mt-20 lg:grid-cols-3 lg:gap-6">
            {PROCESSING.features.map((f) => (
              <FeatureCard key={f.title} feature={f} tone="dark" tagLines={2} />
            ))}
          </div>
          <div className="mt-5 lg:mt-6">
            <AiCallout {...PROCESSING.ai} tone="dark" />
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- 03 Dashboards & reporting ---------------------------------------------------------------------------

export function DashboardsSection() {
  return (
    <div className={BAND}>
      <Section id="dashboards" background="white" className={PAD_L}>
        <LongSectionContextLabel label="Dashboards & reporting" headingId="dashboards-title" />
        <Container className="px-6 sm:px-8 lg:px-10">
          <StageHeader
            number={DASHBOARDS.number}
            title={DASHBOARDS.title}
            intro={DASHBOARDS.intro}
            headingId="dashboards-title"
          />

          <div className="dt-reveal mt-14 sm:mt-16 lg:mt-20">
            <DashboardShowcase />
            <p className="mt-5 text-center text-[12.5px] font-medium tracking-[0.02em] text-navy-faint">
              {DASHBOARDS.disclaimer}
            </p>
          </div>

          <div className="dt-reveal mx-auto mt-14 max-w-3xl text-center sm:mt-16">
            <p className="dt-display text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.01em] text-balance text-navy sm:text-[1.875rem]">
              {DASHBOARDS.closing}
            </p>
            <div className="mt-8 flex justify-center">
              <RecoveryCtaButton entryContext="recovery-cta">Discover your Number</RecoveryCtaButton>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- AI-native -------------------------------------------------------------------------------------------

export function AiNativeSection() {
  return (
    <div className={BAND}>
      <Section id="ai-native" background="cream-gradient" className={PAD_L}>
        <LongSectionContextLabel label="AI-native" headingId="ai-native-title" />
        <Container className="px-6 sm:px-8 lg:px-10">
          <CenteredHeader eyebrow={AI_NATIVE.eyebrow} id="ai-native-title" body={AI_NATIVE.intro}>
            <span className="block text-navy">{AI_NATIVE.title}</span>
          </CenteredHeader>

          <ol className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2 lg:mt-24 lg:gap-6">
            {AI_NATIVE.points.map((p, i) => {
              const emphasis = "emphasis" in p && p.emphasis;
              return (
                <li
                  key={p.title}
                  className={`dt-reveal group flex gap-6 rounded-[24px] border p-7 transition-colors sm:p-8 ${
                    emphasis
                      ? "border-navy bg-navy text-white"
                      : "border-navy-hairline bg-white/75 hover:border-accent"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border ${
                      emphasis ? "border-accent/60 text-accent" : "border-navy-hairline bg-white text-navy"
                    }`}
                  >
                    <PlatformIcon name={p.icon} className="h-[22px] w-[22px]" />
                  </span>
                  <div>
                    <p className={`text-[12px] font-semibold tracking-[0.14em] ${emphasis ? "text-accent" : "text-accent"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3
                      className={`dt-display mt-2 text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.01em] sm:text-[1.5rem] ${emphasis ? "text-white" : "text-navy"}`}
                    >
                      {p.title}
                    </h3>
                    <p className={`mt-4 text-[15.5px] leading-[1.65] ${emphasis ? "text-white/75" : "text-navy-body"}`}>
                      {p.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="dt-reveal mt-12 flex justify-center sm:mt-14">
            <CtaLink href={AI_NATIVE.link.href} variant="outline">
              {AI_NATIVE.link.label}
            </CtaLink>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Across the platform ---------------------------------------------------------------------------------

export function AcrossSection() {
  return (
    <div className={BAND}>
      <Section id="across" background="white" className={PAD_M}>
        <Container className="px-6 sm:px-8 lg:px-10">
          <CenteredHeader eyebrow={ACROSS.eyebrow} id="across-title">
            <span className="block text-navy">{ACROSS.title}</span>
          </CenteredHeader>

          <div className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2 lg:gap-6">
            {ACROSS.items.map((item) => (
              <a
                key={item.title}
                id={item.href.split("/").pop()}
                href={item.href}
                className="dt-reveal group flex flex-col rounded-[24px] border border-navy-hairline bg-cream-50 p-8 transition-colors hover:border-accent sm:p-10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
                  <PlatformIcon name={item.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="dt-display mt-7 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.01em] text-navy">
                  {item.title}
                </h3>
                <p className="mt-4 flex-1 text-[16px] leading-[1.65] text-navy-body">{item.body}</p>
                <span className="mt-8 inline-flex items-center gap-2.5 text-[14px] font-semibold text-navy">
                  Read more
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            ))}
          </div>

          <div className="dt-reveal mt-16 flex flex-col items-center gap-6 border-t border-navy-divider pt-14 text-center sm:mt-20 sm:pt-16">
            <p className="dt-display text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.01em] text-balance text-navy sm:text-[2.25rem]">
              {ACROSS.prompt}
            </p>
            <RecoveryCtaButton entryContext="recovery-cta">Discover your Number</RecoveryCtaButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}
