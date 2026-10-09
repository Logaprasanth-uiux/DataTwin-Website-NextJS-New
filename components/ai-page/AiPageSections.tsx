import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { RecoveryCtaButton } from "@/components/chat/RecoveryCtaButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";
import { Header, SoonPill } from "@/components/darp-page/DarpPageSections";
import {
  AgentsToLedgerArt,
  AiIcon,
  BoundaryIcon,
  EngineArt,
  GatesArt,
  LoopArt,
  OrchestratorConnector,
  PracticeArt,
} from "./AiArt";
import { ARCH, CHANGES, ENGINES, HERO, HITL, LINE, LOOP, PRACTICE } from "./ai-page-data";

// Section rhythm, top to bottom: canvas hero (dark in the Dark Theme), white (architecture), navy (engines),
// cream (in practice), white (closed loop), cream (human-in-the-loop), navy (the line we do not cross), white
// (what changes), then the global closing CTA + footer on the canvas. No two neighbours share a background.

const BAND = "pb-3 sm:pb-5 lg:pb-8";
const PAD_L = "py-24 sm:py-28 lg:py-36";
const GUTTER = "px-6 sm:px-8 lg:px-10";

// "A closing question, then the one action": the page's repeated call to action.
function Closing({ prompt, children, dark = false }: { prompt: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="dt-reveal mx-auto mt-14 flex max-w-3xl flex-col items-center gap-7 text-center sm:mt-16">
      <p
        className={`dt-display text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.01em] text-balance sm:text-[1.875rem] ${dark ? "text-white" : "text-navy"}`}
      >
        {prompt}
      </p>
      {children}
    </div>
  );
}

// ---- Hero ------------------------------------------------------------------------------------------------

export function AiHero() {
  return (
    // id="hero" is what the header looks for to match its dark-canvas treatment, exactly as on the homepage.
    <Section id="hero" background="canvas" className="pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      <Container className={`flex flex-col items-center text-center ${GUTTER}`}>
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
          <p className="dt-eyebrow max-w-sm text-balance sm:max-w-none">{HERO.eyebrow}</p>
          <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
        </div>

        <h1 className="dt-display mt-8 text-4xl leading-[1.04] font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          <span className="block text-navy">{HERO.lead[0]}</span>
          <span className="block text-accent">{HERO.lead[1]}</span>
        </h1>

        <p className="dt-body mt-8 max-w-3xl text-[17px] text-balance sm:text-lg">{HERO.body}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <RecoveryCtaButton entryContext="recovery-cta" variant="solid">
            Discover your number
          </RecoveryCtaButton>
          <CtaLink href="#architecture" variant="outline">
            See the architecture
          </CtaLink>
        </div>

        <AgentsToLedgerArt className="mt-14 h-auto w-full max-w-2xl text-navy sm:mt-16" />

        <ul className="mt-12 grid w-full max-w-6xl gap-4 text-left sm:mt-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 [&>li:last-child]:sm:col-span-2 [&>li:last-child]:lg:col-span-1">
          {HERO.capabilities.map((c) => (
            <li key={c.n} className="rounded-[22px] border border-navy-hairline p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-hairline text-navy">
                  <AiIcon name={c.icon} className="h-[22px] w-[22px]" />
                </span>
                <span className="text-[12px] font-semibold tracking-[0.14em] text-accent">{c.n}</span>
              </div>
              <h2 className="dt-display mt-5 text-[1.0625rem] leading-[1.2] font-semibold text-navy">{c.title}</h2>
              <p className="mt-2.5 text-[14px] leading-[1.6] text-navy-body">{c.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

// ---- The architecture ------------------------------------------------------------------------------------

export function ArchitectureSection() {
  const o = ARCH.orchestrator;
  return (
    <div className={`${BAND} pt-3 sm:pt-5 lg:pt-8`}>
      <Section id="architecture" background="white" className={PAD_L}>
        <LongSectionContextLabel label="The architecture" headingId="architecture-title" />
        <Container className={GUTTER}>
          <Header eyebrow={ARCH.eyebrow} id="architecture-title" body={ARCH.body}>
            {ARCH.title}
          </Header>

          <div className="dt-reveal mx-auto mt-16 flex max-w-3xl flex-col items-center gap-5 rounded-[28px] border border-accent/60 bg-cream-50 p-7 text-center sm:mt-20 sm:p-10">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-accent">
              <AiIcon name={o.icon} className="h-7 w-7" />
            </span>
            <h3 className="dt-display text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.01em] text-navy sm:text-[1.75rem]">{o.name}</h3>
            <p className="text-[15.5px] leading-[1.7] text-navy-body">{o.body}</p>
          </div>

          <OrchestratorConnector className="hidden h-[72px] w-full text-navy lg:block" />
          <span aria-hidden="true" className="mx-auto block h-10 w-px bg-accent lg:hidden" />

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-0">
            {ARCH.groups.map((g, gi) => (
              <div key={g.title} className="dt-reveal flex flex-col lg:px-3">
                <div className="text-center">
                  <p className="text-[12px] font-semibold tracking-[0.14em] text-crimson">{String(gi + 1).padStart(2, "0")}</p>
                  <h3 className="dt-display mt-2 text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.01em] text-navy">{g.title}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-[14.5px] leading-[1.6] text-navy-body">{g.sub}</p>
                </div>
                <div className="mt-6 flex flex-1 flex-col gap-3">
                  {g.agents.map((a) => (
                    <article
                      key={a.name}
                      className="group rounded-[20px] border border-navy-hairline bg-cream-50 p-5 transition-colors hover:border-accent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
                          <AiIcon name={a.icon} className="h-[20px] w-[20px]" />
                        </span>
                        <h4 className="dt-display text-[1.0625rem] leading-[1.2] font-semibold text-navy">{a.name}</h4>
                      </div>
                      <p className="mt-3 text-[14.5px] leading-[1.6] text-navy-body">{a.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Underneath the agents -------------------------------------------------------------------------------

export function EnginesSection() {
  return (
    <div className={BAND}>
      <Section id="engines" background="navy" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={ENGINES.eyebrow} id="engines-title" dark>
            {ENGINES.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-3 lg:gap-6">
            {ENGINES.items.map((e) => (
              <article key={e.title} className="dt-reveal flex flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-accent/60 sm:p-8">
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-5">
                  <EngineArt kind={e.kind} className="h-auto w-full text-white" />
                </div>
                <p className="mt-7 text-[11px] leading-[1.6] font-semibold tracking-[0.14em] text-accent uppercase sm:text-[12px]">{e.tag}</p>
                <h3 className="dt-display mt-3 text-[1.625rem] leading-[1.1] font-semibold tracking-[-0.01em] text-white">{e.title}</h3>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-white/70">{e.body}</p>
              </article>
            ))}
          </div>

          <div className="dt-reveal mx-auto mt-14 flex max-w-3xl flex-col items-center gap-6 text-center sm:mt-16">
            <p className="text-[16.5px] leading-[1.7] text-balance text-white/75">{ENGINES.vocabulary}</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              {ENGINES.soon.map((s) => (
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

// ---- In practice -----------------------------------------------------------------------------------------

export function PracticeSection() {
  return (
    <div className={BAND}>
      <Section id="in-practice" background="cream-gradient" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={PRACTICE.eyebrow} id="practice-title" body={PRACTICE.body}>
            {PRACTICE.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2 lg:gap-6">
            {PRACTICE.items.map((p) => (
              <article key={p.title} className="dt-reveal group flex flex-col rounded-[28px] border border-navy-hairline bg-white/80 p-6 transition-colors hover:border-accent sm:p-8">
                <div className="rounded-[20px] border border-navy-divider bg-cream-50 px-5 py-5 text-navy">
                  <PracticeArt kind={p.kind} className="mx-auto h-auto w-full max-w-[300px]" />
                </div>
                <h3 className="dt-display mt-7 text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em] text-navy">{p.title}</h3>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-navy-body">{p.body}</p>
              </article>
            ))}
          </div>

          <Closing prompt={PRACTICE.prompt}>
            <RecoveryCtaButton entryContext="recovery-cta">Discover your number</RecoveryCtaButton>
          </Closing>
        </Container>
      </Section>
    </div>
  );
}

// ---- Closed-loop assurance -------------------------------------------------------------------------------

function LoopCard({ side, accent = false }: { side: typeof LOOP.preventive | typeof LOOP.corrective; accent?: boolean }) {
  return (
    <article
      className={`dt-reveal flex flex-col rounded-[28px] border bg-cream-50 p-7 sm:p-9 ${accent ? "border-accent/70" : "border-navy-hairline"}`}
    >
      <p className="text-[12px] font-semibold tracking-[0.14em] text-crimson uppercase">{side.tag}</p>
      <h3 className="dt-display mt-3 text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em] text-navy sm:text-[1.75rem]">{side.title}</h3>
      <ul className="mt-6 flex-1 space-y-3 border-t border-navy-divider pt-6">
        {side.points.map((p) => (
          <li key={p} className="flex gap-3 text-[15px] leading-[1.55] text-navy">
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <p className="mt-7 rounded-[14px] bg-white px-4 py-3 text-[13.5px] leading-[1.5] text-navy-body">
        <span className="font-semibold text-navy">{LOOP.agentsLabel}</span> {side.agents}
      </p>
    </article>
  );
}

export function LoopSection() {
  return (
    <div className={BAND}>
      <Section id="closed-loop" background="white" className={PAD_L}>
        <LongSectionContextLabel label="Closed-loop assurance" headingId="loop-title" />
        <Container className={GUTTER}>
          <Header eyebrow={LOOP.eyebrow} id="loop-title" body={LOOP.body}>
            {LOOP.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-[1fr_120px_1fr] lg:items-stretch lg:gap-4">
            <LoopCard side={LOOP.preventive} />
            <div className="hidden items-center justify-center text-navy lg:flex">
              <LoopArt className="h-auto w-full" />
            </div>
            <LoopCard side={LOOP.corrective} accent />
          </div>

          <h3 className="dt-display dt-reveal mt-20 text-center text-[1.5rem] leading-[1.15] font-semibold tracking-[-0.01em] text-navy sm:mt-24 sm:text-[1.875rem]">
            {LOOP.flowTitle}
          </h3>
          <ol className="relative mt-12 grid gap-8 sm:grid-cols-5 sm:gap-4">
            <span aria-hidden="true" className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-accent sm:block" />
            {LOOP.steps.map((s) => (
              <li key={s.n} className="dt-reveal relative flex gap-5 sm:flex-col sm:items-center sm:gap-0 sm:text-center">
                <span className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-accent bg-white text-[13px] font-semibold tracking-[0.1em] text-crimson">
                  {s.n}
                </span>
                <div className="sm:mt-5">
                  <h4 className="dt-display text-[1.125rem] font-semibold text-navy">{s.title}</h4>
                  <p className="mt-2 text-[14px] leading-[1.6] text-navy-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {/* The last step feeds back into the first. */}
          <div aria-hidden="true" className="relative mx-[10%] mt-6 hidden h-9 rounded-b-[28px] border-x border-b border-dashed border-accent sm:block">
            <svg viewBox="0 0 12 12" fill="none" className="absolute -top-0.5 -left-[6.5px] h-3 w-3 text-accent">
              <path d="M2 8l4-5 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <Closing prompt={LOOP.prompt}>
            <RecoveryCtaButton entryContext="recovery-cta">{LOOP.cta}</RecoveryCtaButton>
          </Closing>
        </Container>
      </Section>
    </div>
  );
}

// ---- Human-in-the-loop -----------------------------------------------------------------------------------

export function HitlSection() {
  return (
    <div className={BAND}>
      <Section id="human-in-the-loop" background="cream-gradient" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={HITL.eyebrow} id="hitl-title" body={HITL.body}>
            {HITL.title}
          </Header>

          <div className="dt-reveal mt-16 rounded-[28px] border border-navy-hairline bg-white/80 px-4 py-6 text-navy sm:mt-20 sm:px-8 sm:py-8">
            <GatesArt className="h-auto w-full" />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {HITL.items.map((h) => (
              <article key={h.title} className="dt-reveal group flex flex-col rounded-[24px] border border-navy-hairline bg-white/80 p-7 transition-colors hover:border-accent sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
                  <AiIcon name={h.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="dt-display mt-6 text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.01em] text-navy">{h.title}</h3>
                <p className="mt-3 text-[15.5px] leading-[1.65] text-navy-body">{h.body}</p>
              </article>
            ))}
          </div>

          <Closing prompt={HITL.prompt}>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              <SoonPill>{HITL.caseStudy}</SoonPill>
              <CtaLink href={HITL.writing.href} variant="outline">
                {HITL.writing.label}
              </CtaLink>
            </div>
          </Closing>
        </Container>
      </Section>
    </div>
  );
}

// ---- The line we do not cross ----------------------------------------------------------------------------

function LinePill({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-full border px-4 py-1.5 text-center text-[12.5px] font-semibold tracking-[0.06em] sm:whitespace-nowrap ${
        accent ? "border-accent/70 text-accent" : "border-white/25 text-white/75"
      }`}
    >
      {children}
    </span>
  );
}

// One end of a row: its picture in a box, with its label beneath. `link` hangs a dotted line down to the item
// below it (evidence supports the entry), crossing the row gap.
function LineEnd({
  kind,
  label,
  accent = false,
  link = false,
}: {
  kind: "reasoning" | "evidence" | "rules" | "books";
  label: string;
  accent?: boolean;
  link?: boolean;
}) {
  return (
    <div className="relative flex w-24 flex-col items-center gap-3 sm:w-40">
      <span
        className={`flex h-16 w-full items-center justify-center rounded-[18px] border ${
          accent ? "border-accent/60 bg-accent/[0.06]" : "border-white/15 bg-white/[0.04]"
        }`}
      >
        <BoundaryIcon kind={kind} className="h-10 w-16 text-white" />
      </span>
      <LinePill accent={accent}>{label}</LinePill>
      {link && <span aria-hidden="true" className="absolute top-full left-1/2 h-10 border-l border-dotted border-white/40" />}
    </div>
  );
}

// The line between the two ends, level with the middle of the pictures (h-16). Dashed and muted where reasoning
// only attaches as evidence; solid amber, through a gate, where a rule posts.
function LineConnector({ accent = false, gate = false }: { accent?: boolean; gate?: boolean }) {
  return (
    <div className="relative flex h-16 items-center">
      <span
        aria-hidden="true"
        className={`h-px flex-1 ${accent ? "bg-accent" : "border-t border-dashed border-white/40"}`}
      />
      {gate && (
        <span className="absolute left-1/2 flex h-9 w-6 -translate-x-1/2 items-center justify-center rounded-[9px] border-2 border-accent bg-canvas text-accent">
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path d="M2.5 6.5l2.2 2.2L9.5 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      <svg viewBox="0 0 10 12" className={`h-3 w-2.5 flex-shrink-0 ${accent ? "text-accent" : "text-white/40"}`} fill="none" aria-hidden="true">
        <path d="M2 1.5l6 4.5-6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function LineSection() {
  const L = LINE.legend;
  return (
    <div className={BAND}>
      <Section id="the-line" background="navy" className={PAD_L}>
        <Container className={GUTTER}>
          <div className="text-center">
            <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">{LINE.eyebrow}</p>
            <h2
              id="the-line-title"
              className="dt-display dt-reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]"
            >
              <span className="block text-white">{LINE.lead[0]}</span>
              <span className="block text-accent">{LINE.lead[1]}</span>
            </h2>
          </div>

          {/* Two plain rows, each centred on the page: reasoning only ever becomes evidence; only versioned rules
              reach your books, and only through the gate. */}
          <div className="dt-reveal mx-auto mt-16 max-w-3xl rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 sm:mt-20 sm:px-10 sm:py-10">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-10 sm:gap-x-6">
              <LineEnd kind="reasoning" label={L.reasoning} />
              <LineConnector />
              <LineEnd kind="evidence" label={L.evidence} link />
              <LineEnd kind="rules" label={L.rules} accent />
              <LineConnector accent gate />
              <LineEnd kind="books" label={L.books} accent />
            </div>
          </div>

          <div className="dt-reveal mx-auto mt-14 max-w-3xl space-y-6 text-center sm:mt-16">
            {LINE.paras.map((p) => (
              <p key={p} className="text-[17px] leading-[1.75] text-balance text-white/75 sm:text-lg">
                {p}
              </p>
            ))}
          </div>

          <Closing prompt={LINE.prompt} dark>
            <RecoveryCtaButton entryContext="recovery-cta" variant="dark" className="border-white/40! hover:border-accent!">
              {LINE.cta}
            </RecoveryCtaButton>
          </Closing>
        </Container>
      </Section>
    </div>
  );
}

// ---- What changes ----------------------------------------------------------------------------------------

export function ChangesSection() {
  const c = CHANGES.columns;
  return (
    <div className={BAND}>
      <Section id="what-changes" background="white" className={PAD_L}>
        <LongSectionContextLabel label="What changes" headingId="changes-title" />
        <Container className={GUTTER}>
          <Header eyebrow={CHANGES.eyebrow} id="changes-title">
            {CHANGES.title}
          </Header>

          {/* Desktop: three columns. */}
          <div className="dt-reveal mt-16 hidden overflow-hidden rounded-[28px] border border-navy-hairline md:block sm:mt-20">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-cream-50">
                  <th scope="col" className="w-[18%] px-6 py-5 text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase lg:px-8">
                    {c.point}
                  </th>
                  <th scope="col" className="w-[34%] px-5 py-5 text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">
                    {c.traditional}
                  </th>
                  <th scope="col" className="w-[48%] border-l border-accent/40 bg-navy px-6 py-5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase lg:px-8">
                    {c.datatwin}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CHANGES.rows.map((r) => (
                  <tr key={r.point} className="border-t border-navy-divider">
                    <th scope="row" className="dt-display px-6 py-5 align-top text-[1.0625rem] font-semibold text-navy lg:px-8">
                      {r.point}
                    </th>
                    <td className="px-5 py-5 align-top text-[15px] leading-[1.55] text-navy-muted">
                      <span className="flex gap-3">
                        <span aria-hidden="true" className="mt-[10px] h-px w-3 flex-shrink-0 bg-loss" />
                        {r.traditional}
                      </span>
                    </td>
                    <td className="border-l border-accent/30 bg-cream-50 px-6 py-5 align-top text-[15px] leading-[1.55] font-medium text-navy lg:px-8">
                      <span className="flex gap-3">
                        <svg viewBox="0 0 12 12" className="mt-[5px] h-3.5 w-3.5 flex-shrink-0 text-accent" fill="none" aria-hidden="true">
                          <path d="M2.5 6.5l2.2 2.2L9.5 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {r.datatwin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones: one card per critical point. */}
          <div className="mt-14 grid gap-4 md:hidden">
            {CHANGES.rows.map((r) => (
              <article key={r.point} className="dt-reveal overflow-hidden rounded-[22px] border border-navy-hairline">
                <h3 className="dt-display bg-cream-50 px-5 py-4 text-[1.125rem] font-semibold text-navy">{r.point}</h3>
                <div className="px-5 py-4">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">{c.traditional}</p>
                  <p className="mt-1.5 text-[14.5px] leading-[1.55] text-navy-muted">{r.traditional}</p>
                </div>
                <div className="border-t border-accent/40 bg-navy px-5 py-4">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">{c.datatwin}</p>
                  <p className="mt-1.5 text-[14.5px] leading-[1.55] text-white">{r.datatwin}</p>
                </div>
              </article>
            ))}
          </div>

          <Closing prompt={CHANGES.prompt}>
            <RecoveryCtaButton entryContext="recovery-cta">Discover your number</RecoveryCtaButton>
          </Closing>
        </Container>
      </Section>
    </div>
  );
}
