import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { RecoveryCtaButton } from "@/components/chat/RecoveryCtaButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";
import { DarpGlyph } from "@/components/darp/DarpGlyph";
import type { DarpStageKey } from "@/components/darp/darp-data";
import { DpIcon, FundsConnector, NWayArt, PopulationGrid, TwoDirectionsDiagram, TwoWayArt } from "./DarpArt";
import { APPLIES, AUDIT, COST, ENGINE, FAQ, FINDS, HERO, HOW, PAID, WHY } from "./darp-page-data";

// Section rhythm, top to bottom: canvas hero (dark in the Dark Theme), white (how it works, plain white so it
// does not repeat the hero's curved warm gradient), cream (why DARP), navy (one engine), white (what Discover
// finds), navy (auditors), white (how it is paid for), cream (cost), navy (where it applies), cream (FAQ),
// then the global closing CTA + footer on the canvas. No two neighbours share a background. Same band gap
// and padding as the Platform page.

const BAND = "pb-3 sm:pb-5 lg:pb-8";
const PAD_L = "py-24 sm:py-28 lg:py-36";
const PAD_M = "py-20 sm:py-24 lg:py-32";
const GUTTER = "px-6 sm:px-8 lg:px-10";

const STAGE_ORDER: readonly DarpStageKey[] = ["discover", "assess", "recover", "prevent"];

function Header({
  eyebrow,
  id,
  body,
  dark = false,
  children,
}: {
  eyebrow: string;
  id: string;
  body?: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">{eyebrow}</p>
      <h2
        id={id}
        className={`dt-display dt-reveal mx-auto mt-5 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.5rem] ${dark ? "text-white" : "text-navy"}`}
      >
        {children}
      </h2>
      {body && (
        <p
          className={`dt-reveal mx-auto mt-8 max-w-3xl text-[17px] leading-[1.65] text-balance sm:text-lg ${dark ? "text-white/70" : "text-navy-body"}`}
        >
          {body}
        </p>
      )}
    </div>
  );
}

// A link to something that is not published yet: same pill shape as CtaLink, visibly inert.
function SoonPill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      aria-disabled="true"
      className={`dt-button inline-flex h-11 cursor-not-allowed items-center gap-3 rounded-full border border-dashed px-5 text-[14px] ${
        dark ? "border-white/25 text-white/60" : "border-navy-hairline text-navy-muted"
      }`}
    >
      {children}
      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10.5px] font-semibold tracking-[0.12em] text-accent uppercase">
        Soon
      </span>
    </span>
  );
}

// ---- Hero ------------------------------------------------------------------------------------------------

export function DarpHero() {
  return (
    // id="hero" is what the header looks for to match its dark-canvas treatment, exactly as on the homepage.
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

        {/* The four stages as a rail: three that read the history, then the one that turns forwards. */}
        <ol className="mt-12 flex w-full max-w-3xl items-start justify-center sm:mt-14" aria-label="Discover, Assess, Recover, Prevent">
          {STAGE_ORDER.map((key, i) => (
            <li key={key} className="relative flex flex-1 flex-col items-center">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-7 left-[calc(-50%+36px)] h-px w-[calc(100%-72px)] sm:top-8 sm:left-[calc(-50%+40px)] sm:w-[calc(100%-80px)] ${i === 3 ? "bg-accent" : "bg-navy-hairline"}`}
                />
              )}
              <div className="flex flex-col items-center gap-3">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full border sm:h-16 sm:w-16 ${
                    key === "prevent" ? "border-accent bg-accent/10 text-navy" : "border-navy-hairline text-navy"
                  }`}
                >
                  <DarpGlyph stage={key} className="h-7 w-7 sm:h-8 sm:w-8" />
                </span>
                <span className="dt-display text-[15px] font-semibold text-navy sm:text-[1.0625rem]">
                  {key[0].toUpperCase() + key.slice(1)}.
                </span>
              </div>
            </li>
          ))}
        </ol>

        <p className="dt-body mt-10 max-w-3xl text-[17px] text-balance sm:text-lg">{HERO.body}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <RecoveryCtaButton entryContext="recovery-cta" variant="solid">
            Discover your number
          </RecoveryCtaButton>
          <CtaLink href="#how-it-works" variant="outline">
            See the four stages
          </CtaLink>
        </div>

        <ul className="mt-14 grid w-full max-w-5xl border-y border-navy-hairline sm:mt-16 sm:grid-cols-2 lg:grid-cols-5">
          {HERO.proof.map((item, i) => (
            <li
              key={item}
              className={`flex items-center justify-center gap-3 border-navy-divider px-4 py-5 text-[14px] leading-snug font-medium text-navy sm:py-6 ${
                i > 0 ? "border-t sm:border-t-0" : ""
              } ${i % 2 === 1 ? "sm:border-l" : ""} ${i >= 2 ? "sm:border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l" : ""}`}
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

// ---- Why DARP --------------------------------------------------------------------------------------------

export function WhySection() {
  return (
    <div className={BAND}>
      <Section id="why" background="cream-gradient" className={PAD_L}>
        <LongSectionContextLabel label="Why the DARP Framework" headingId="why-title" />
        <Container className={GUTTER}>
          <Header eyebrow={WHY.eyebrow} id="why-title" body={WHY.body}>
            {WHY.title}
          </Header>

          <p className="dt-eyebrow dt-reveal mt-16 text-center sm:mt-20">{WHY.offeredLabel}</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:gap-6">
            {WHY.offered.map((o) => (
              <article
                key={o.who}
                className="dt-reveal flex flex-col rounded-[24px] border border-dashed border-navy-hairline bg-white/50 p-7 sm:p-8"
              >
                <p className="text-[12px] font-semibold tracking-[0.14em] text-navy-muted uppercase">{o.who}</p>
                <p className="dt-display mt-4 text-[1.1875rem] leading-[1.3] font-semibold text-navy">{o.pitch}</p>
                <p className="mt-6 flex gap-3 border-t border-navy-divider pt-5 text-[15px] leading-[1.6] text-navy-body">
                  <span aria-hidden="true" className="mt-[9px] h-px w-4 flex-shrink-0 bg-loss" />
                  <span>{o.flaw}</span>
                </p>
              </article>
            ))}
          </div>

          <div className="dt-reveal mt-16 flex items-center justify-center gap-4 sm:mt-20">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            <p className="dt-eyebrow dt-eyebrow-accent">{WHY.insteadLabel}</p>
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:gap-6">
            {WHY.instead.map((x) => (
              <article
                key={x.letter}
                className="dt-reveal group flex gap-6 rounded-[24px] border border-navy-hairline bg-white p-7 transition-colors hover:border-accent sm:p-8"
              >
                <span className="dt-display flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[1.5rem] font-semibold text-accent">
                  {x.letter}
                </span>
                <div>
                  <h3 className="dt-display text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.01em] text-navy sm:text-[1.5rem]">
                    {x.title}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-[1.65] text-navy-body">{x.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- One engine, two directions --------------------------------------------------------------------------

export function EngineSection() {
  const cols = [ENGINE.backwards, ENGINE.rules, ENGINE.forwards];
  return (
    <div className={BAND}>
      <Section id="one-engine" background="navy" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={ENGINE.eyebrow} id="one-engine-title" body={ENGINE.body} dark>
            {ENGINE.title}
          </Header>

          <div className="dt-reveal mt-16 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:mt-20 sm:p-8 lg:p-10">
            <TwoDirectionsDiagram className="h-auto w-full text-white" />
            <div className="mt-6 grid gap-px overflow-hidden rounded-[18px] border border-white/10 bg-white/10 sm:mt-8 lg:grid-cols-3">
              {cols.map((c, i) => (
                <div key={c.tag} className={`p-6 sm:p-7 ${i === 1 ? "bg-accent/[0.07]" : "bg-navy"}`}>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase sm:text-[12px]">{c.tag}</p>
                  <h3 className="dt-display mt-3 text-[1.25rem] font-semibold text-white">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-white/70">{c.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dt-reveal mt-14 flex flex-col items-center gap-6 text-center sm:mt-16">
            <p className="dt-display text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.01em] text-balance text-white sm:text-[1.875rem]">
              {ENGINE.oneliner}
            </p>
            <SoonPill dark>{ENGINE.cta}</SoonPill>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- How it works ----------------------------------------------------------------------------------------

function StageRail({ children, line, node }: { children: React.ReactNode; line: "accent" | "faint" | "none"; node: React.ReactNode }) {
  return (
    <li className="dt-reveal grid grid-cols-[48px_1fr] gap-x-4 sm:grid-cols-[64px_1fr] sm:gap-x-8">
      <div className="flex flex-col items-center">
        {node}
        {line !== "none" && (
          <span
            aria-hidden="true"
            className={`mt-2 w-px flex-1 ${line === "accent" ? "bg-accent" : "bg-navy-hairline"}`}
          />
        )}
      </div>
      <div className="pb-8 sm:pb-10">{children}</div>
    </li>
  );
}

export function HowSection() {
  return (
    <div className={`${BAND} pt-3 sm:pt-5 lg:pt-8`}>
      <Section id="how-it-works" background="white" className={PAD_L}>
        <LongSectionContextLabel label="How it works" headingId="how-title" />
        <Container className={GUTTER}>
          <Header eyebrow={HOW.eyebrow} id="how-title" body={HOW.body}>
            {HOW.title}
          </Header>

          <ol className="mx-auto mt-16 max-w-5xl sm:mt-20">
            {HOW.stages.map((s, i) => (
              <div key={s.key} className="contents">
                <StageRail
                  line={i === 0 ? "accent" : i === HOW.stages.length - 1 ? "none" : "faint"}
                  node={
                    <span
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border sm:h-16 sm:w-16 ${
                        s.key === "prevent"
                          ? "border-accent bg-navy text-accent"
                          : "border-navy-hairline bg-white text-navy"
                      }`}
                    >
                      <DarpGlyph stage={s.key} className="h-6 w-6 sm:h-8 sm:w-8" />
                    </span>
                  }
                >
                  <article className="rounded-[24px] border border-navy-hairline bg-cream-50 p-6 sm:p-9">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <p className="text-[12px] font-semibold tracking-[0.14em] text-crimson uppercase">
                        Stage {String(i + 1).padStart(2, "0")}
                      </p>
                      <span className="rounded-full border border-navy-hairline px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-navy-muted uppercase">
                        {s.timing}
                      </span>
                    </div>
                    <h3 className="dt-display mt-4 text-[2rem] leading-[1.05] font-semibold tracking-[-0.02em] text-navy sm:text-[2.5rem]">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-3xl text-[16.5px] leading-[1.65] text-navy-body">{s.intro}</p>

                    {s.key === "discover" && (
                      <ol className="mt-7 grid gap-3 sm:grid-cols-3">
                        {HOW.discoverSteps.map((d, j) => (
                          <li key={d.title} className="rounded-[16px] border border-navy-divider bg-white p-4">
                            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-accent/60 text-[10px]">
                                {j + 1}
                              </span>
                              {d.tag}
                            </p>
                            <p className="dt-display mt-2 text-[1rem] font-semibold text-navy">{d.title}</p>
                            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-navy-body">{d.body}</p>
                          </li>
                        ))}
                      </ol>
                    )}

                    <div className="mt-7 grid gap-6 border-t border-navy-divider pt-7 md:grid-cols-2 md:gap-8">
                      <div>
                        <p className="dt-eyebrow">What we need</p>
                        <p className="mt-2.5 text-[15px] leading-[1.65] text-navy-body">{s.need}</p>
                      </div>
                      <div>
                        <p className="dt-eyebrow dt-eyebrow-accent">What you get</p>
                        <p className="mt-2.5 text-[15px] leading-[1.65] text-navy">{s.get}</p>
                      </div>
                    </div>
                  </article>
                </StageRail>

                {i === 0 && (
                  <StageRail
                    line="faint"
                    node={
                      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-canvas sm:h-16 sm:w-16">
                        <DpIcon name="contract" className="h-6 w-6 sm:h-8 sm:w-8" />
                      </span>
                    }
                  >
                    <div className="grid gap-6 rounded-[24px] bg-navy p-7 sm:p-9 lg:grid-cols-12 lg:items-center lg:gap-x-10">
                      <div className="lg:col-span-8">
                        <p className="text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">Decision point</p>
                        <h3 className="dt-display mt-3 text-[1.75rem] leading-[1.1] font-semibold text-white sm:text-[2rem]">
                          {HOW.contract.title}
                        </h3>
                        <p className="mt-3 text-[15.5px] leading-[1.65] text-white/75">{HOW.contract.body}</p>
                      </div>
                      <div className="lg:col-span-4 lg:justify-self-end">
                        <RecoveryCtaButton entryContext="recovery-cta" variant="dark" className="border-white/40! hover:border-accent!">
                          {HOW.contract.cta}
                        </RecoveryCtaButton>
                      </div>
                    </div>
                  </StageRail>
                )}
              </div>
            ))}
          </ol>

          <div className="dt-reveal mx-auto mt-6 flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className="dt-display text-[1.375rem] leading-[1.25] font-semibold tracking-[-0.01em] text-balance text-navy sm:text-[1.625rem]">
              {HOW.compounding}
            </p>
            <p className="text-[13px] leading-[1.6] font-medium tracking-[0.02em] text-navy-faint">{HOW.note}</p>
            <RecoveryCtaButton entryContext="recovery-cta">{HOW.cta}</RecoveryCtaButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- What Discover finds ---------------------------------------------------------------------------------

export function FindsSection() {
  return (
    <div className={BAND}>
      <Section id="finds" background="white" className={PAD_L}>
        <LongSectionContextLabel label="What Discover finds" headingId="finds-title" />
        <Container className={GUTTER}>
          <Header eyebrow={FINDS.eyebrow} id="finds-title" body={FINDS.body}>
            {FINDS.title}
          </Header>

          {/* The four outcome types as one bar: the first two put cash back, the others do not. */}
          <div className="dt-reveal mx-auto mt-14 max-w-4xl sm:mt-16" aria-hidden="true">
            <div className="grid grid-cols-4 gap-1.5">
              <span className="h-2.5 rounded-l-full bg-accent" />
              <span className="h-2.5 bg-accent" />
              <span className="h-2.5 bg-navy-hairline" />
              <span className="h-2.5 rounded-r-full border border-dashed border-navy-hairline" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[10.5px] font-semibold tracking-[0.1em] text-navy-muted uppercase sm:text-[11.5px]">
              <span className="col-span-2 text-crimson">Puts cash back</span>
              <span>No cash attached</span>
              <span>Why it recurs</span>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:gap-6">
            {FINDS.items.map((f) => (
              <article
                key={f.n}
                className="dt-reveal group flex flex-col rounded-[24px] border border-navy-hairline bg-cream-50 p-7 transition-colors hover:border-accent sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
                    <DpIcon name={f.kind} className="h-[24px] w-[24px]" />
                  </span>
                  <span className="text-[12px] font-semibold tracking-[0.14em] text-accent">{f.n}</span>
                </div>
                <h3 className="dt-display mt-6 text-[1.625rem] leading-[1.1] font-semibold tracking-[-0.01em] text-navy sm:text-[1.875rem]">
                  {f.title}
                </h3>
                <p className="mt-3 flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-6 bg-accent transition-[width] duration-300 group-hover:w-10" />
                  <span className="text-[11px] font-medium tracking-[0.14em] text-navy-muted uppercase sm:text-[12px]">{f.tag}</span>
                </p>
                <span
                  className={`mt-4 self-start rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase ${
                    f.kind === "cash" || f.kind === "tax"
                      ? "bg-accent/20 text-crimson"
                      : "border border-dashed border-navy-hairline text-navy-muted"
                  }`}
                >
                  {f.cashLabel}
                </span>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-navy-divider pt-6">
                  {f.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-[1.5] text-navy">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 rounded-[16px] bg-white p-5">
                  <p className="dt-eyebrow dt-eyebrow-accent">How it is valued</p>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-navy-body">{f.valuedBy}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="dt-reveal mx-auto mt-14 flex max-w-3xl flex-col items-center gap-7 text-center sm:mt-16">
            <p className="dt-display text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.01em] text-balance text-navy sm:text-[1.875rem]">
              {FINDS.prompt}
            </p>
            <RecoveryCtaButton entryContext="recovery-cta">{FINDS.cta}</RecoveryCtaButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- The objection ---------------------------------------------------------------------------------------

export function AuditSection() {
  const sides = [
    { ...AUDIT.audit, mode: "sample" as const, emphasis: false },
    { ...AUDIT.darp, mode: "full" as const, emphasis: true },
  ];
  return (
    <div className={BAND}>
      <Section id="auditors" background="navy" className={PAD_L}>
        <LongSectionContextLabel label="“Our auditors already do this”" headingId="auditors-title" />
        <Container className={GUTTER}>
          <Header eyebrow={AUDIT.eyebrow} id="auditors-title" body={AUDIT.body} dark>
            {AUDIT.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-2 lg:gap-6">
            {sides.map((s) => (
              <article
                key={s.label}
                className={`dt-reveal flex flex-col rounded-[28px] border p-7 sm:p-10 ${
                  s.emphasis ? "border-accent/50 bg-white/[0.06]" : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <PopulationGrid mode={s.mode} className="h-auto w-full text-white" />
                <p className={`mt-8 text-[12px] font-semibold tracking-[0.14em] uppercase ${s.emphasis ? "text-accent" : "text-white/60"}`}>
                  {s.label}
                </p>
                <h3 className="dt-display mt-3 text-[1.5rem] leading-[1.15] font-semibold tracking-[-0.01em] text-white sm:text-[1.75rem]">
                  {s.title}
                </h3>
                {s.paras.map((p) => (
                  <p key={p} className="mt-4 text-[15.5px] leading-[1.7] text-white/70">
                    {p}
                  </p>
                ))}
              </article>
            ))}
          </div>

          <div className="dt-reveal mx-auto mt-14 max-w-3xl text-center sm:mt-16">
            <p className="text-[17px] leading-[1.7] text-balance text-white/75 sm:text-lg">{AUDIT.closing}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              {AUDIT.soon.map((s) => (
                <SoonPill key={s} dark>
                  {s}
                </SoonPill>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- What it costs ---------------------------------------------------------------------------------------

export function CostSection() {
  return (
    <div className={BAND}>
      <Section id="cost" background="cream-gradient" className={PAD_M}>
        <Container className={GUTTER}>
          <Header eyebrow={COST.eyebrow} id="cost-title" body={COST.body}>
            {COST.title}
          </Header>

          <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-3 lg:gap-6">
            {COST.items.map((c) => (
              <article
                key={c.title}
                className="dt-reveal group flex flex-col rounded-[24px] border border-navy-hairline bg-white/75 p-7 transition-colors hover:border-accent sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
                  <DpIcon name={c.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="dt-display mt-7 text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em] text-navy">{c.title}</h3>
                <p className="mt-4 text-[15.5px] leading-[1.65] text-navy-body">{c.body}</p>
              </article>
            ))}
          </div>

          <div className="dt-reveal mt-12 flex flex-col items-center gap-6 text-center sm:mt-14">
            <p className="dt-display text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.01em] text-navy sm:text-[1.875rem]">
              {COST.ask}
            </p>
            <p
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
              aria-label={COST.equation.join(" plus ").replace(" plus you know", " equals you know")}
            >
              {COST.equation.map((part, i) => (
                <span key={part} className="contents">
                  {i > 0 && (
                    <span aria-hidden="true" className="dt-display text-[1.5rem] font-semibold text-accent">
                      {i === 1 ? "+" : "="}
                    </span>
                  )}
                  <span
                    className={`dt-display rounded-full px-5 py-3 text-[15px] font-semibold sm:text-[1.0625rem] ${
                      i === 2 ? "bg-navy text-accent" : "border border-navy-hairline bg-white text-navy"
                    }`}
                  >
                    {part}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- How it is paid for ----------------------------------------------------------------------------------

export function PaidSection() {
  return (
    <div className={BAND}>
      <Section id="paid-for" background="white" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={PAID.eyebrow} id="paid-title" body={PAID.body}>
            {PAID.title}
          </Header>

          <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
            <article className="dt-reveal rounded-[28px] bg-navy p-8 sm:p-11">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">{PAID.top.tag}</p>
              <h3 className="dt-display mt-4 text-[1.625rem] leading-[1.12] font-semibold tracking-[-0.01em] text-white sm:text-[2rem]">
                {PAID.top.title}
              </h3>
              <p className="mt-4 text-[16px] leading-[1.7] text-white/75">{PAID.top.body}</p>
            </article>

            <div className="dt-reveal relative flex justify-center py-3">
              <FundsConnector className="h-[88px] w-8 sm:h-[104px] sm:w-10" />
              <p className="absolute top-1/2 left-1/2 ml-8 max-w-[10rem] -translate-y-1/2 text-[12px] leading-snug font-semibold tracking-[0.14em] text-crimson uppercase sm:ml-10">
                {PAID.flow}
              </p>
            </div>

            <article className="dt-reveal rounded-[28px] border border-navy-hairline bg-cream-50 p-8 sm:p-11">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-crimson uppercase">{PAID.bottom.tag}</p>
              <h3 className="dt-display mt-4 text-[1.625rem] leading-[1.12] font-semibold tracking-[-0.01em] text-navy sm:text-[2rem]">
                {PAID.bottom.title}
              </h3>
              <p className="mt-4 text-[16px] leading-[1.7] text-navy-body">{PAID.bottom.body}</p>
            </article>
          </div>

          <div className="dt-reveal mx-auto mt-14 flex max-w-3xl flex-col items-center gap-7 text-center sm:mt-16">
            <p className="dt-display text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.01em] text-balance text-navy sm:text-[1.875rem]">
              {PAID.closing}
            </p>
            <RecoveryCtaButton entryContext="recovery-cta">{PAID.cta}</RecoveryCtaButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Where DARP applies ----------------------------------------------------------------------------------

export function AppliesSection() {
  return (
    <div className={BAND}>
      <Section id="applies" background="navy" className={PAD_L}>
        <LongSectionContextLabel label="Where DARP applies" headingId="applies-title" />
        <Container className={GUTTER}>
          <Header eyebrow={APPLIES.eyebrow} id="applies-title" body={APPLIES.body} dark>
            {APPLIES.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {APPLIES.items.map((a) => {
              const sharp = "badge" in a;
              return (
                <article
                  key={a.title}
                  className={`dt-reveal flex flex-col rounded-[24px] border p-7 transition-colors sm:p-8 ${
                    sharp ? "border-accent/60 bg-accent/[0.07]" : "border-white/10 bg-white/[0.04] hover:border-accent/60"
                  }`}
                >
                  {sharp && (
                    <span className="mb-4 self-start rounded-full bg-accent px-3 py-1 text-[10.5px] font-semibold tracking-[0.12em] text-canvas uppercase">
                      {a.badge}
                    </span>
                  )}
                  <h3 className="dt-display text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.01em] text-white">{a.title}</h3>
                  <p className="mt-4 text-[15px] leading-[1.65] text-white/70">{a.body}</p>
                </article>
              );
            })}
          </div>

          <div className="dt-reveal mt-5 grid gap-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-10 lg:mt-6 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:p-12">
            <div className="grid gap-4 lg:col-span-5">
              <div className="flex items-center justify-between gap-6 rounded-[20px] border border-white/10 px-6 py-5">
                <p className="text-[12px] font-semibold tracking-[0.14em] text-white/60 uppercase">{APPLIES.twoWay}</p>
                <TwoWayArt className="h-auto w-28 flex-shrink-0 text-white sm:w-32" />
              </div>
              <div className="flex items-center justify-between gap-6 rounded-[20px] border border-accent/50 bg-accent/[0.06] px-6 py-6">
                <p className="max-w-[9.5rem] text-[12px] leading-[1.6] font-semibold tracking-[0.14em] text-accent uppercase">
                  {APPLIES.nWay}
                </p>
                <NWayArt className="h-auto w-28 flex-shrink-0 text-white sm:w-36" />
              </div>
            </div>
            <p className="text-[17px] leading-[1.8] text-white/80 sm:text-[19px] lg:col-span-7">{APPLIES.nWayBody}</p>
          </div>

          <div className="dt-reveal mt-12 flex justify-center sm:mt-14">
            <RecoveryCtaButton entryContext="recovery-cta" variant="dark" className="border-white/40! hover:border-accent!">
              {APPLIES.cta}
            </RecoveryCtaButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- FAQ -------------------------------------------------------------------------------------------------

export function FaqSection() {
  return (
    <div className={BAND}>
      <Section id="faq" background="cream-gradient" className={PAD_L}>
        <LongSectionContextLabel label="Questions we get asked" headingId="faq-title" />
        <Container className={GUTTER}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">{FAQ.eyebrow}</p>
                <h2
                  id="faq-title"
                  className="dt-display dt-reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-navy sm:text-5xl"
                >
                  {FAQ.title}
                </h2>
                <p className="dt-reveal mt-8 text-[16px] leading-[1.6] text-navy-body">{FAQ.stillLabel}</p>
                <div className="dt-reveal mt-5">
                  <RecoveryCtaButton entryContext="direct">{FAQ.cta}</RecoveryCtaButton>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-navy-hairline overflow-hidden rounded-[24px] border border-navy-hairline bg-white/80">
                {FAQ.items.map((item, i) => (
                  <details key={item.q} className="group" {...(i === 0 ? { open: true } : {})}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-left marker:hidden sm:p-7 [&::-webkit-details-marker]:hidden">
                      <span className="dt-display text-[1.0625rem] leading-[1.3] font-semibold text-navy sm:text-[1.1875rem]">{item.q}</span>
                      <span className="dp-faq-plus flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-navy-hairline text-accent transition-transform duration-300">
                        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <div className="space-y-4 px-6 pb-7 sm:px-7">
                      {item.a.map((p) => (
                        <p key={p} className="max-w-2xl text-[15.5px] leading-[1.7] text-navy-body">
                          {p}
                        </p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
