import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { RecoveryCtaButton } from "@/components/chat/RecoveryCtaButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";
import { Header } from "@/components/darp-page/DarpPageSections";
import { DpIcon } from "@/components/darp-page/DarpArt";
import { AiIcon } from "@/components/ai-page/AiArt";
import { ApGateRail } from "./ApGateRail";
import { DiscountArt, GateArt, InvoiceToEntryArt, MonthArt, PortalArt, StopwatchArt } from "./ApArt";
import { CHANGES, GATES, HERO, HOOD, LIFE, MONTH, PAY, PORTAL, START, type Block, type Gate, type LifeNode } from "./ap-page-data";

// Section rhythm, top to bottom: canvas hero (dark in the Dark Theme), white (the lifecycle), cream (the five
// gates), navy (bill to payment), white (month end), navy (vendor portal), cream (under the hood), white (what
// changes), cream (start here), then the global closing CTA + footer on the canvas. No two neighbours match.

const BAND = "pb-3 sm:pb-5 lg:pb-8";
const PAD_L = "py-24 sm:py-28 lg:py-36";
const GUTTER = "px-6 sm:px-8 lg:px-10";
const DARK_BTN = "border-white/40! hover:border-accent!";

// ---- Hero ------------------------------------------------------------------------------------------------

export function ApHero() {
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

        <p className="dt-body mt-8 max-w-3xl text-[17px] text-balance sm:text-lg">{HERO.body}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <RecoveryCtaButton entryContext="recovery-cta" variant="solid">
            {HERO.primary}
          </RecoveryCtaButton>
          <CtaLink href={HERO.secondary.href} variant="outline">
            {HERO.secondary.label}
          </CtaLink>
        </div>

        <InvoiceToEntryArt className="mt-14 h-auto w-full max-w-2xl text-navy sm:mt-16" />

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
  );
}

// ---- One invoice, end to end: the lifecycle --------------------------------------------------------------

function NodeRow({ nodes }: { nodes: readonly LifeNode[] }) {
  return (
    <ol className="flex flex-col items-stretch lg:flex-row lg:items-stretch">
      {nodes.map((n, i) => (
        <li key={n.title} className="flex flex-col items-stretch lg:min-w-0 lg:flex-1 lg:flex-row lg:items-center">
          <a
            href={n.href}
            className={`group flex-1 rounded-[12px] border px-3 py-2.5 text-center transition-colors lg:flex lg:flex-col lg:justify-center ${
              n.end
                ? "border-accent/70 bg-accent/[0.1] hover:border-accent"
                : "border-white/15 bg-white/[0.05] hover:border-accent/70"
            }`}
          >
            <span className="dt-display block text-[0.875rem] leading-[1.2] font-semibold text-white">{n.title}</span>
            <span className="mt-0.5 block text-[11.5px] leading-[1.35] text-white/60">{n.sub}</span>
          </a>
          {i < nodes.length - 1 && (
            <span aria-hidden="true" className="relative mx-auto h-4 w-px flex-shrink-0 bg-accent/45 lg:mx-0 lg:h-px lg:w-8 lg:self-center">
              <span
                className="ap-hop absolute top-0 left-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] lg:top-1/2 lg:left-0 lg:-translate-x-1/2"
                style={{ "--i": i } as React.CSSProperties}
              />
              <svg viewBox="0 0 10 12" className="absolute -right-px -bottom-0.5 h-2.5 w-2 rotate-90 text-accent lg:top-1/2 lg:right-0 lg:bottom-auto lg:-translate-y-1/2 lg:rotate-0" fill="none">
                <path d="M2 1.5l6 4.5-6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function LifecycleSection() {
  return (
    <div className={`${BAND} pt-3 sm:pt-5 lg:pt-8`}>
      <Section id="lifecycle" background="white" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={LIFE.eyebrow} id="lifecycle-title">
            {LIFE.title}
          </Header>

          <div className="dt-reveal mt-16 overflow-hidden rounded-[28px] border border-white/10 bg-navy sm:mt-20">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 sm:px-8">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase sm:text-[12px]">{LIFE.card.title}</p>
              <p className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase sm:text-[12px]">
                <span aria-hidden="true" className="ap-live h-2 w-2 rounded-full bg-accent" />
                {LIFE.card.live}
              </p>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-6">
              {LIFE.phases.map((ph) => (
                <div key={ph.n}>
                  <p className="flex items-center gap-3">
                    <span className="flex h-6 items-center rounded-lg border border-accent/50 px-2 text-[12px] font-semibold tracking-[0.1em] text-accent">{ph.n}</span>
                    <span className="dt-display text-[1.125rem] font-semibold text-white">{ph.title}</span>
                  </p>
                  <div className="mt-3.5">
                    <NodeRow nodes={ph.nodes} />
                  </div>
                  {ph.banner && (
                    <div className="mt-3.5 flex items-start gap-3.5 rounded-[14px] border border-accent/40 bg-accent/[0.08] p-3.5 sm:items-center">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-canvas">
                        <AiIcon name="learning" className="h-5 w-5" />
                      </span>
                      <p className="text-[13.5px] leading-[1.55] text-white/80">
                        <span className="font-semibold text-white">{ph.banner.label}</span> {ph.banner.body}
                      </p>
                    </div>
                  )}
                  {ph.note && <p className="mt-2.5 text-[13px] text-white/55 italic">{ph.note}</p>}
                </div>
              ))}
            </div>

            <p className="border-t border-white/10 bg-white/[0.04] px-6 py-3.5 text-[12.5px] leading-[1.55] text-white/65 sm:px-8">{LIFE.footer}</p>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Invoice to bill, gate by gate -----------------------------------------------------------------------

function BlockRow({ b }: { b: Block }) {
  return (
    <div className="grid gap-4 border-t border-navy-divider py-7 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-4">
        <div className="flex items-center gap-3">
          {b.icon && (
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
              <AiIcon name={b.icon} className="h-[20px] w-[20px]" />
            </span>
          )}
          <p className="text-[12px] font-semibold tracking-[0.14em] text-crimson uppercase">{b.tag}</p>
        </div>
        {b.title && <h4 className="dt-display mt-3 text-[1.25rem] leading-[1.2] font-semibold tracking-[-0.01em] text-navy">{b.title}</h4>}
      </div>
      <div className="md:col-span-8">
        <p className="text-[15.5px] leading-[1.7] text-navy">{b.body}</p>
        {b.points && (
          <ul className="mt-4 space-y-2.5">
            {b.points.map((p) => (
              <li key={p} className="flex gap-3 text-[14.5px] leading-[1.55] text-navy-body">
                <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function GateArticle({ g }: { g: Gate }) {
  return (
    <article id={g.id} className="dt-reveal scroll-mt-32 rounded-[28px] border border-navy-hairline bg-white/80 p-6 sm:p-10">
      <div className="flex items-center gap-4">
        <span className="dt-display flex h-12 w-12 items-center justify-center rounded-full bg-navy text-[1.25rem] font-semibold text-accent">{g.n}</span>
        <p className="dt-eyebrow dt-eyebrow-accent">Gate {g.n}</p>
      </div>
      <h3 className="dt-display mt-5 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.02em] text-balance text-navy sm:text-[2.125rem]">{g.title}</h3>
      <p className="mt-5 max-w-3xl text-[16.5px] leading-[1.7] text-navy-body">{g.lead}</p>

      <div className="mt-8 rounded-[20px] border border-navy-divider bg-cream-50 px-4 py-6 text-navy sm:px-8">
        <GateArt gate={g.art} className="mx-auto h-auto w-full max-w-[560px]" />
      </div>

      {g.compact ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {g.blocks.map((b) => (
            <div key={b.tag} className="rounded-[20px] border border-navy-hairline bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                {b.icon && (
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-navy-hairline text-navy">
                    <AiIcon name={b.icon} className="h-[20px] w-[20px]" />
                  </span>
                )}
                <h4 className="dt-display text-[1.125rem] font-semibold text-navy">{b.tag}</h4>
              </div>
              <p className="mt-3 text-[14.5px] leading-[1.65] text-navy-body">{b.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          {g.blocks.map((b) => (
            <BlockRow key={b.tag} b={b} />
          ))}
        </div>
      )}

      {g.callout && (
        <div className="mt-8 rounded-[22px] bg-navy p-6 sm:p-8">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">{g.callout.tag}</p>
          <h4 className="dt-display mt-3 text-[1.375rem] leading-[1.2] font-semibold text-white sm:text-[1.625rem]">{g.callout.title}</h4>
          <p className="mt-3 text-[15.5px] leading-[1.7] text-white/75">{g.callout.body}</p>
        </div>
      )}

      {g.link && (
        <div className="mt-8">
          <CtaLink href={g.link.href} variant="outline">
            {g.link.label}
          </CtaLink>
        </div>
      )}
    </article>
  );
}

export function GatesSection() {
  return (
    <div className={BAND}>
      <Section id="gates" background="cream-gradient" className={PAD_L}>
        <LongSectionContextLabel label="Invoice to bill, gate by gate" headingId="gates-title" />
        <Container className={GUTTER}>
          <Header eyebrow={GATES.eyebrow} id="gates-title">
            {GATES.title}
          </Header>

          <div className="mt-16 grid gap-10 sm:mt-20 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
            <ApGateRail gates={GATES.items} />
            <div className="space-y-6 lg:space-y-8">
              {GATES.items.map((g) => (
                <GateArticle key={g.id} g={g} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Bill to payment -------------------------------------------------------------------------------------

export function PaySection() {
  const c = PAY.callout;
  return (
    <div className={BAND}>
      <Section id="bill-to-payment" background="navy" className={PAD_L}>
        <LongSectionContextLabel label="Bill to payment" headingId="pay-title" />
        <Container className={GUTTER}>
          <Header eyebrow={PAY.eyebrow} id="pay-title" body={PAY.body} dark>
            {PAY.title}
          </Header>

          <div className="mt-16 grid gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-14">
            <ol className="space-y-4 lg:col-span-7">
              {PAY.steps.map((s, i) => (
                <li key={s.n} className="dt-reveal relative flex gap-5 rounded-[22px] border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-accent/60 sm:gap-6 sm:p-6">
                  <span className="dt-display relative flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-full border border-accent bg-canvas text-[1.25rem] font-semibold text-accent">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="dt-display text-[1.375rem] leading-[1.15] font-semibold text-white">{s.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-[1.7] text-white/70">{s.body}</p>
                  </div>
                  {/* Link to the next step: centred under this step's number. */}
                  {i < PAY.steps.length - 1 && (
                    <span aria-hidden="true" className="absolute top-full left-[47px] h-4 w-px -translate-x-1/2 bg-accent/60 sm:left-[51px]" />
                  )}
                </li>
              ))}
            </ol>

            <aside className="dt-reveal self-start rounded-[28px] border border-accent/50 bg-accent/[0.07] p-7 sm:p-9 lg:sticky lg:top-32 lg:col-span-5">
              <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-5">
                <DiscountArt className="mx-auto h-auto w-full max-w-[260px] text-white" />
              </div>
              <p className="mt-7 text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">{c.tag}</p>
              <h3 className="dt-display mt-3 text-[1.5rem] leading-[1.15] font-semibold text-white sm:text-[1.75rem]">{c.title}</h3>
              <p className="mt-4 text-[15.5px] leading-[1.7] text-white/75">{c.body}</p>
              <div className="mt-7">
                <CtaLink href={c.link.href} variant="dark" className={DARK_BTN}>
                  {c.link.label}
                </CtaLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Month end -------------------------------------------------------------------------------------------

export function MonthSection() {
  return (
    <div className={BAND}>
      <Section id="month-end" background="white" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={MONTH.eyebrow} id="month-title" body={MONTH.body}>
            {MONTH.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-3 lg:gap-6">
            {MONTH.items.map((m) => (
              <article key={m.tag} className="dt-reveal group flex flex-col rounded-[28px] border border-navy-hairline bg-cream-50 p-6 transition-colors hover:border-accent sm:p-8">
                <div className="rounded-[18px] border border-navy-divider bg-white px-4 py-5 text-navy">
                  <MonthArt kind={m.kind} className="mx-auto h-auto w-full max-w-[240px]" />
                </div>
                <p className="mt-7 text-[12px] font-semibold tracking-[0.14em] text-crimson uppercase">{m.tag}</p>
                <h3 className="dt-display mt-3 text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em] text-navy">{m.title}</h3>
                <p className="mt-4 text-[15px] leading-[1.7] text-navy-body">{m.body}</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-navy-divider pt-6">
                  {m.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[14.5px] leading-[1.55] text-navy">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="dt-reveal mt-12 flex justify-center sm:mt-14">
            <CtaLink href={MONTH.link.href} variant="outline">
              {MONTH.link.label}
            </CtaLink>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Vendor portal ---------------------------------------------------------------------------------------

export function PortalSection() {
  const a = PORTAL.alert;
  return (
    <div className={BAND}>
      <Section id="vendor-portal" background="navy" className={PAD_L}>
        <LongSectionContextLabel label="Vendor portal" headingId="portal-title" />
        <Container className={GUTTER}>
          <Header eyebrow={PORTAL.eyebrow} id="portal-title" body={PORTAL.body} dark>
            {PORTAL.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2 lg:gap-6">
            {PORTAL.items.map((p) => (
              <article key={p.tag} className="dt-reveal flex flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-accent/60 sm:p-8">
                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-5">
                  <PortalArt kind={p.kind} className="mx-auto h-auto w-full max-w-[260px] text-white" />
                </div>
                <p className="mt-7 text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">{p.tag}</p>
                <h3 className="dt-display mt-3 text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em] text-white">{p.title}</h3>
                <p className="mt-4 text-[15px] leading-[1.7] text-white/70">{p.body}</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/10 pt-6">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[14.5px] leading-[1.55] text-white/80">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="dt-reveal mt-5 flex gap-5 rounded-[28px] border border-accent/60 bg-accent/[0.08] p-6 sm:mt-6 sm:items-center sm:gap-7 sm:p-9">
            <span className="dt-display flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[1.5rem] font-semibold text-canvas">!</span>
            <div>
              <h3 className="dt-display text-[1.375rem] leading-[1.15] font-semibold text-white sm:text-[1.5rem]">{a.title}</h3>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-white/80">{a.body}</p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Under the hood --------------------------------------------------------------------------------------

export function HoodSection() {
  return (
    <div className={BAND}>
      <Section id="under-the-hood" background="cream-gradient" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={HOOD.eyebrow} id="hood-title" body={HOOD.body}>
            {HOOD.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-3 lg:gap-6">
            {HOOD.items.map((h) => (
              <article key={h.title} className="dt-reveal group flex flex-col rounded-[24px] border border-navy-hairline bg-white/80 p-7 transition-colors hover:border-accent sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
                  <AiIcon name={h.icon} className="h-[22px] w-[22px]" />
                </span>
                <p className="mt-6 text-[12px] font-semibold tracking-[0.14em] text-crimson uppercase">{h.tag}</p>
                <h3 className="dt-display mt-3 text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em] text-navy">{h.title}</h3>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-navy-body">{h.body}</p>
              </article>
            ))}
          </div>

          <div className="dt-reveal mt-12 flex flex-col items-center justify-center gap-3 sm:mt-14 sm:flex-row sm:gap-4">
            {HOOD.links.map((l) => (
              <CtaLink key={l.label} href={l.href} variant="outline">
                {l.label}
              </CtaLink>
            ))}
          </div>
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
          <Header eyebrow={CHANGES.eyebrow} id="changes-title" body={CHANGES.body}>
            {CHANGES.title}
          </Header>

          {/* Desktop: three columns. */}
          <div className="dt-reveal mt-16 hidden overflow-hidden rounded-[28px] border border-navy-hairline sm:mt-20 md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-cream-50">
                  <th scope="col" className="w-[18%] px-6 py-5 text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase lg:px-8">
                    {c.point}
                  </th>
                  <th scope="col" className="w-[34%] px-5 py-5 text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">
                    {c.today}
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
                        {r.today}
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

          {/* Phones: one card per row. */}
          <div className="mt-14 grid gap-4 md:hidden">
            {CHANGES.rows.map((r) => (
              <article key={r.point} className="dt-reveal overflow-hidden rounded-[22px] border border-navy-hairline">
                <h3 className="dt-display bg-cream-50 px-5 py-4 text-[1.125rem] font-semibold text-navy">{r.point}</h3>
                <div className="px-5 py-4">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">{c.today}</p>
                  <p className="mt-1.5 text-[14.5px] leading-[1.55] text-navy-muted">{r.today}</p>
                </div>
                <div className="border-t border-accent/40 bg-navy px-5 py-4">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">{c.datatwin}</p>
                  <p className="mt-1.5 text-[14.5px] leading-[1.55] text-white">{r.datatwin}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Start here ------------------------------------------------------------------------------------------

export function StartSection() {
  return (
    <div className={BAND}>
      <Section id="start-here" background="cream-gradient" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={START.eyebrow} id="start-title" body={START.body}>
            {START.title}
          </Header>

          <div
            className="dt-reveal relative mt-16 overflow-hidden rounded-[32px] bg-navy p-8 sm:mt-20 sm:p-12 lg:p-14"
            style={{
              backgroundImage:
                "radial-gradient(55% 90% at 16% 50%, rgba(221,161,98,0.20), transparent 70%), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "auto, 36px 36px, 36px 36px",
            }}
          >
            <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-x-14">
              <div className="flex flex-col items-center text-center lg:col-span-5">
                <div className="relative aspect-square w-full max-w-[260px] text-white">
                  <StopwatchArt className="absolute inset-0 h-full w-full" />
                  <p className="dt-display absolute inset-0 flex flex-col items-center justify-center text-accent">
                    <span className="text-[6.5rem] leading-[0.9] font-semibold tracking-[-0.05em] sm:text-[7.5rem]">{START.stat.value}</span>
                    <span className="mt-1 text-[1.25rem] font-semibold tracking-[0.22em] uppercase">{START.stat.unit}</span>
                  </p>
                </div>
                <p className="mt-6 max-w-[17rem] text-[15px] leading-[1.6] text-white/70">{START.stat.text}</p>
              </div>

              <div className="lg:col-span-7">
                <p className="text-[17px] leading-[1.75] text-white/85 sm:text-[19px]">{START.how}</p>
                <ul className="mt-8 flex flex-wrap items-center gap-2.5" aria-label="What goes in, and what comes out">
                  {START.flow.map((f, i) => (
                    <li key={f} className="flex items-center gap-2.5">
                      {i === 1 && (
                        <span aria-hidden="true" className="text-[15px] font-semibold text-accent">
                          +
                        </span>
                      )}
                      {i > 1 && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3 text-accent" fill="none" aria-hidden="true">
                          <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      <span className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[0.04em] ${i === START.flow.length - 1 ? "border-accent/70 text-accent" : "border-white/20 text-white/80"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4 lg:gap-6">
            {START.items.map((it) => (
              <article key={it.title} className="dt-reveal group flex flex-col rounded-[24px] border border-navy-hairline bg-white/80 p-6 transition-colors hover:border-accent sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
                  <DpIcon name={it.kind} className="h-[24px] w-[24px]" />
                </span>
                <h3 className="dt-display mt-6 text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.01em] text-navy">{it.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-navy-body">{it.body}</p>
              </article>
            ))}
          </div>

          <div className="dt-reveal mt-12 flex flex-col items-center justify-center gap-3 sm:mt-14 sm:flex-row sm:gap-4">
            <RecoveryCtaButton entryContext="recovery-cta">{START.cta}</RecoveryCtaButton>
            <CtaLink href={START.link.href} variant="outline">
              {START.link.label}
            </CtaLink>
          </div>
        </Container>
      </Section>
    </div>
  );
}
