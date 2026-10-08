import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { RecoveryCtaButton } from "@/components/chat/RecoveryCtaButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";
import { Header } from "@/components/darp-page/DarpPageSections";
import { ControlsTabs } from "./ControlsTabs";
import { AdminArt, AuditorArt, ReadOnlyHeroArt, ReadOnlyLane, SecIcon, StageArt, WriteBackLane } from "./SecurityArt";
import { CONTROLS, DATA, FAQ, HERO, POSTURE, RBAC, type Cell } from "./security-page-data";

// Section rhythm, top to bottom: canvas hero (dark in the Dark Theme), white (default posture), cream
// (controls), navy (role-based access), white (where the data sits), cream (security review), then the
// global closing CTA + footer on the canvas. No two neighbours share a background.

const BAND = "pb-3 sm:pb-5 lg:pb-8";
const PAD_L = "py-24 sm:py-28 lg:py-36";
const GUTTER = "px-6 sm:px-8 lg:px-10";

// ---- Hero ------------------------------------------------------------------------------------------------

export function SecurityHero() {
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
          <CtaLink href="#posture" variant="outline">
            See the default posture
          </CtaLink>
        </div>

        <ReadOnlyHeroArt className="mt-14 h-auto w-full max-w-2xl text-navy sm:mt-16" />

        <ul className="mt-12 grid w-full max-w-5xl gap-4 text-left sm:mt-14 md:grid-cols-3 lg:gap-5">
          {HERO.certs.map((c) => (
            <li key={c.title} className="rounded-[24px] border border-navy-hairline p-6 sm:p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-hairline text-navy">
                <SecIcon name={c.icon} className="h-[24px] w-[24px]" />
              </span>
              <h2 className="dt-display mt-5 text-[1.25rem] leading-[1.15] font-semibold text-navy">{c.title}</h2>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-navy-body">{c.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

// ---- The default posture ---------------------------------------------------------------------------------

export function PostureSection() {
  return (
    <div className={`${BAND} pt-3 sm:pt-5 lg:pt-8`}>
      <Section id="posture" background="white" className={PAD_L}>
        <Container className={GUTTER}>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
            <div className="lg:col-span-6">
              <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">{POSTURE.eyebrow}</p>
              <h2
                id="posture-title"
                className="dt-display dt-reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-5xl lg:text-[3.25rem]"
              >
                <span className="block text-navy">{POSTURE.lead[0]}</span>
                <span className="block text-accent">{POSTURE.lead[1]}</span>
              </h2>
              <p className="dt-reveal mt-8 text-[16.5px] leading-[1.75] text-navy-body sm:text-[17px]">{POSTURE.body}</p>
            </div>

            <div className="dt-reveal rounded-[28px] border border-navy-hairline bg-cream-50 p-5 sm:p-8 lg:col-span-6">
              {POSTURE.lanes.map((lane, i) => (
                <div key={lane.tag} className={i > 0 ? "mt-7 border-t border-navy-divider pt-7" : ""}>
                  <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-[12px] font-semibold tracking-[0.14em] text-crimson uppercase">{lane.tag}</span>
                    <span className="dt-display text-[1.0625rem] font-semibold text-navy">{lane.title}</span>
                  </p>
                  <div className="mt-3">{i === 0 ? <ReadOnlyLane /> : <WriteBackLane />}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Controls --------------------------------------------------------------------------------------------

export function ControlsSection() {
  return (
    <div className={BAND}>
      <Section id="controls" background="cream-gradient" className={PAD_L}>
        <LongSectionContextLabel label="Controls" headingId="controls-title" />
        <Container className={GUTTER}>
          <Header eyebrow={CONTROLS.eyebrow} id="controls-title" body={CONTROLS.body}>
            {CONTROLS.title}
          </Header>
          <div className="dt-reveal mt-14 sm:mt-16 lg:mt-20">
            <ControlsTabs />
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Role-based access -----------------------------------------------------------------------------------

function Chip({ cell, dark = true }: { cell: Cell; dark?: boolean }) {
  if (cell.v === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[12.5px] font-semibold text-canvas">
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
          <path d="M2.5 6.5l2.2 2.2L9.5 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {cell.label}
      </span>
    );
  }
  if (cell.v === "part") {
    return (
      <span className="inline-flex items-center rounded-full border border-accent/70 px-3 py-1 text-[12.5px] font-semibold text-accent">
        {cell.label}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium ${dark ? "text-white/40" : "text-navy-muted"}`}>
      <span aria-hidden="true" className="h-px w-3 bg-current" />
      {cell.label}
    </span>
  );
}

// The two roles the note is about, with the capabilities that make the point (indices into RBAC.columns).
const SPOTLIGHT = [
  { role: "External auditor", Art: AuditorArt, cols: [1, 2] },
  { role: "Administrator", Art: AdminArt, cols: [2, 3, 4] },
] as const;

export function RbacSection() {
  return (
    <div className={BAND}>
      <Section id="rbac" background="navy" className={PAD_L}>
        <LongSectionContextLabel label="Role-based access" headingId="rbac-title" />
        <Container className={GUTTER}>
          <Header eyebrow={RBAC.eyebrow} id="rbac-title" body={RBAC.body} dark>
            {RBAC.title}
          </Header>

          {/* Desktop: the matrix. */}
          <div className="dt-reveal mt-16 hidden overflow-hidden rounded-[28px] border border-white/10 md:block sm:mt-20">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/[0.06]">
                  <th scope="col" className="px-6 py-5 text-[11px] font-semibold tracking-[0.14em] text-white/60 uppercase lg:px-8">
                    {RBAC.roleLabel}
                  </th>
                  {RBAC.columns.map((c) => (
                    <th key={c} scope="col" className="px-3 py-5 text-[11px] leading-snug font-semibold tracking-[0.12em] text-white/60 uppercase">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RBAC.rows.map((r) => (
                  <tr
                    key={r.role}
                    className={`border-t ${r.spotlight ? "border-accent/30 bg-accent/[0.08]" : "border-white/10"}`}
                  >
                    <th scope="row" className="dt-display px-6 py-5 text-[1.0625rem] font-semibold text-white lg:px-8">
                      {r.role}
                    </th>
                    {r.cells.map((cell, i) => (
                      <td key={i} className="px-3 py-5">
                        <Chip cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones: one card per role. */}
          <div className="mt-14 grid gap-4 md:hidden">
            {RBAC.rows.map((r) => (
              <article
                key={r.role}
                className={`dt-reveal rounded-[22px] border p-6 ${r.spotlight ? "border-accent/50 bg-accent/[0.08]" : "border-white/10 bg-white/[0.04]"}`}
              >
                <h3 className="dt-display text-[1.25rem] font-semibold text-white">{r.role}</h3>
                <dl className="mt-4 divide-y divide-white/10">
                  {RBAC.columns.map((c, i) => (
                    <div key={c} className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-[13.5px] text-white/70">{c}</dt>
                      <dd>
                        <Chip cell={r.cells[i]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <div className="dt-reveal mt-5 grid gap-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-10 lg:mt-6 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:p-12">
            <div className="grid gap-4 lg:col-span-5">
              {SPOTLIGHT.map((t) => {
                const row = RBAC.rows.find((r) => r.role === t.role)!;
                return (
                  <div key={t.role} className="flex items-center gap-5 rounded-[20px] border border-accent/40 bg-accent/[0.06] p-5">
                    <t.Art className="h-auto w-24 flex-shrink-0 text-white sm:w-28" />
                    <div className="min-w-0 flex-1">
                      <p className="dt-display text-[1.125rem] font-semibold text-white">{t.role}</p>
                      <dl className="mt-3 space-y-2">
                        {t.cols.map((c) => (
                          <div key={c} className="flex items-center justify-between gap-3">
                            <dt className="text-[12.5px] text-white/65">{RBAC.columns[c]}</dt>
                            <dd>
                              <Chip cell={row.cells[c]} />
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[16px] leading-[1.8] text-white/80 sm:text-[17px] lg:col-span-7">{RBAC.note}</p>
          </div>
        </Container>
      </Section>
    </div>
  );
}

// ---- Where the data sits ---------------------------------------------------------------------------------

export function DataSection() {
  return (
    <div className={BAND}>
      <Section id="data" background="white" className={PAD_L}>
        <Container className={GUTTER}>
          <Header eyebrow={DATA.eyebrow} id="data-title" body={DATA.body}>
            {DATA.title}
          </Header>

          <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-2 lg:gap-6">
            {DATA.stages.map((s) => (
              <article key={s.kind} className="dt-reveal flex flex-col rounded-[28px] border border-navy-hairline bg-cream-50 p-6 sm:p-9">
                <div className="rounded-[20px] border border-navy-divider bg-white px-4 py-5 text-navy sm:px-6">
                  <StageArt kind={s.kind} className="h-auto w-full" />
                  <p className="mt-2 flex justify-between gap-4 text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">
                    <span>{s.left}</span>
                    <span className="text-crimson">{s.right}</span>
                  </p>
                </div>
                <p className="mt-8 text-[12px] font-semibold tracking-[0.14em] text-crimson uppercase">{s.tag}</p>
                <h3 className="dt-display mt-3 text-[1.625rem] leading-[1.12] font-semibold tracking-[-0.01em] text-navy sm:text-[1.875rem]">
                  {s.title}
                </h3>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-navy-body">{s.body}</p>
                {s.kind === "estate" && (
                  <ul className="mt-auto flex flex-wrap gap-2.5 border-t border-navy-divider pt-6">
                    {DATA.providers.map((p) => (
                      <li key={p} className="dt-display rounded-full border border-navy-hairline bg-white px-4 py-2 text-[13.5px] font-semibold text-navy">
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

        </Container>
      </Section>
    </div>
  );
}

// ---- Security review -------------------------------------------------------------------------------------

export function SecurityFaqSection() {
  return (
    <div className={BAND}>
      <Section id="security-review" background="cream-gradient" className={PAD_L}>
        <LongSectionContextLabel label="Security review" headingId="security-review-title" />
        <Container className={GUTTER}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">{FAQ.eyebrow}</p>
                <h2
                  id="security-review-title"
                  className="dt-display dt-reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-navy sm:text-5xl"
                >
                  {FAQ.title}
                </h2>
                <div className="dt-reveal mt-8">
                  <RecoveryCtaButton entryContext="recovery-cta">Discover your number</RecoveryCtaButton>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-navy-hairline overflow-hidden rounded-[24px] border border-navy-hairline bg-white/80">
                {FAQ.items.map((item, i) => (
                  <details key={item.q} className="group" {...(i === 0 ? { open: true } : {})}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-left marker:hidden sm:p-7 [&::-webkit-details-marker]:hidden">
                      <span className="dt-display text-[1.0625rem] leading-[1.3] font-semibold text-navy sm:text-[1.1875rem]">{item.q}</span>
                      <span className="sp-faq-plus flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-navy-hairline text-accent transition-transform duration-300">
                        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-7 sm:px-7">
                      <p className="max-w-2xl text-[15.5px] leading-[1.7] text-navy-body">{item.a}</p>
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
