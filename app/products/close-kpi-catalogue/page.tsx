import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { FinalCta } from "@/components/sections/FinalCta";
import { RecoveryCtaButton } from "@/components/chat/RecoveryCtaButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { Header } from "@/components/darp-page/DarpPageSections";
import { ProductHeroArt } from "@/components/product-page/ProductArt";
import { KpiTable } from "@/components/kpi-catalogue/KpiTable";

export const metadata: Metadata = {
  title: "The Close KPI Catalogue: all 204 metrics | DataTwin",
  description:
    "Every metric in the FSCP framework: 8 domains, 56 close processes and 204 close-blocker metrics, each with the population it is measured against. Filter by domain, search by text, or download the whole catalogue as a PDF.",
};

const PDF = "/close-kpi-catalogue.pdf";
const BAND = "pb-3 sm:pb-5 lg:pb-8";
const PAD_L = "py-24 sm:py-28 lg:py-36";
const GUTTER = "px-6 sm:px-8 lg:px-10";

const HERO = {
  eyebrow: "Close KPI Catalogue",
  lead: ["All 204 of them.", "Every one a close blocker."],
  body: "This is the full FSCP register: eight domains, 56 close processes and 204 metrics. Every one measures something that can hold up a close, never a completion percentage, and every one carries the population it is measured against. Filter by domain, search for the thing you are worried about, or take the whole catalogue away as a PDF.",
  proof: ["8 domains · 56 close processes · 204 metrics", "Every metric is a blocker, not a statistic", "Free to use, whether or not you talk to us"],
};

const READING = {
  eyebrow: "Reading the catalogue",
  title: "How to read a line",
  body: "Each metric is a count of things in a bad state, measured against the population it came from. That pairing is what turns a number into a decision: 14 unposted journals out of 140 is a different afternoon from 14 out of 14,000.",
  items: [
    { tag: "Domain and close process", body: "Which of the eight domains it belongs to, and which close process inside it. A metric means the same thing in March as it does in September." },
    { tag: "The close blocker", body: "What is being counted, always stated as a problem: pending, unmatched, unposted, breaching, missing or unapproved. Never a completion rate." },
    { tag: "Measured against", body: "The denominator. Value over total count gives the issue percentage, and your thresholds turn that into a colour. Nothing else is entered." },
  ],
};

const CATALOGUE = {
  eyebrow: "All 204 metrics",
  title: "The catalogue",
  body: "Filter by domain or search across every field. Thresholds are yours to set; the questions are the same for everybody.",
  columns: ["Domain", "Close process", "Close blocker metric", "Measured against"],
  empty: "No metric matches that search.",
  download: "Download as a PDF",
};

const START = {
  eyebrow: "Get started",
  title: "We can score a close you have already signed.",
  body: "Send us the data for a period you have already closed. We run all 204 metrics across the full population, not a sample, and come back with what was blocking that close and what it was worth. Nothing changes in your systems, and it happens before there is anything to sign.",
  cta: "Score my last close",
};

export default function CloseKpiCataloguePage() {
  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        {/* id="hero" is what the header looks for to match its dark-canvas treatment, exactly as on the homepage. */}
        <Section id="hero" background="canvas" className="pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
          <Container className={`flex flex-col items-center text-center ${GUTTER}`}>
            <div className="flex items-center justify-center gap-4">
              <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
              <p className="dt-eyebrow">{HERO.eyebrow}</p>
              <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
            </div>
            <h1 className="dt-display mt-8 text-4xl leading-[1.04] font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              <span className="block text-navy">{HERO.lead[0]}</span>
              <span className="block text-accent">{HERO.lead[1]}</span>
            </h1>
            <p className="dt-body mt-8 max-w-3xl text-[17px] text-balance sm:text-lg">{HERO.body}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <RecoveryCtaButton entryContext="recovery-cta" variant="solid">
                Score my last close
              </RecoveryCtaButton>
              <CtaLink href="/products/fscp" variant="outline">
                How FSCP works
              </CtaLink>
              <a
                href={PDF}
                download
                className="dt-button group inline-flex h-11 items-center gap-2.5 rounded-full border border-navy-hairline px-5 text-[14px] text-navy transition-colors hover:border-accent focus-visible:border-accent"
              >
                Download the catalogue as a PDF
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-accent" aria-hidden="true">
                  <path d="M8 2v9M4.5 7.5L8 11l3.5-3.5M3 14h10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <ProductHeroArt glyphs={["bank", "doc", "calendar"]} out="register" className="mt-14 h-auto w-full max-w-2xl text-navy sm:mt-16" />

            <ul className="mt-12 grid w-full max-w-5xl border-y border-navy-hairline sm:mt-14 md:grid-cols-3">
              {HERO.proof.map((item, i) => (
                <li
                  key={item}
                  className={`flex items-center justify-center gap-3 border-navy-divider px-4 py-5 text-[14px] leading-snug font-medium text-navy sm:py-6 ${
                    i > 0 ? "border-t md:border-t-0 md:border-l" : ""
                  }`}
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <div className={`${BAND} pt-3 sm:pt-5 lg:pt-8`}>
          <Section id="reading" background="white" className={PAD_L}>
            <Container className={GUTTER}>
              <Header eyebrow={READING.eyebrow} id="reading-title" body={READING.body}>
                {READING.title}
              </Header>
              <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-3 lg:gap-6">
                {READING.items.map((r) => (
                  <article key={r.tag} className="dt-reveal rounded-[24px] border border-navy-hairline bg-cream-50 p-7 transition-colors hover:border-accent sm:p-8">
                    <h3 className="dt-display text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.01em] text-navy">{r.tag}</h3>
                    <p className="mt-4 text-[15.5px] leading-[1.7] text-navy-body">{r.body}</p>
                  </article>
                ))}
              </div>
            </Container>
          </Section>
        </div>

        <div className={BAND}>
          <Section id="catalogue" background="cream-gradient" className={PAD_L}>
            <Container className={GUTTER}>
              <Header eyebrow={CATALOGUE.eyebrow} id="catalogue-title" body={CATALOGUE.body}>
                {CATALOGUE.title}
              </Header>
              <div className="dt-reveal mt-14 sm:mt-16">
                <KpiTable columns={CATALOGUE.columns} empty={CATALOGUE.empty} download={{ label: CATALOGUE.download, href: PDF }} />
              </div>
            </Container>
          </Section>
        </div>

        <div className={BAND}>
          <Section id="start-here" background="white" className="py-20 sm:py-24 lg:py-28">
            <Container className={GUTTER}>
              <Header eyebrow={START.eyebrow} id="start-title" body={START.body}>
                {START.title}
              </Header>
              <div className="dt-reveal mt-10 flex justify-center">
                <RecoveryCtaButton entryContext="recovery-cta">{START.cta}</RecoveryCtaButton>
              </div>
            </Container>
          </Section>
        </div>
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}
