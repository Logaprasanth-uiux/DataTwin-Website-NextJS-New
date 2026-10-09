import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { RecoveryCtaButton } from "@/components/chat/RecoveryCtaButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";
import { Header } from "@/components/darp-page/DarpPageSections";
import { DpIcon } from "@/components/darp-page/DarpArt";
import { AiIcon } from "@/components/ai-page/AiArt";
import { StopwatchArt } from "@/components/ap-page/ApArt";
import { ApGateRail } from "@/components/ap-page/ApGateRail";
import { Motif, ProductHeroArt } from "./ProductArt";
import type { Block, Lane, ProductPageData } from "./product-types";

// One composer for every product page. The hero is always the dark/themed canvas; the sections that follow keep
// a fixed order, and their backgrounds are assigned here so no two neighbours ever match and the page always
// ends on a light section above the dark footer.

const BAND = "pb-3 sm:pb-5 lg:pb-8";
const PAD_L = "py-24 sm:py-28 lg:py-36";
const GUTTER = "px-6 sm:px-8 lg:px-10";
const DARK_BTN = "border-white/40! hover:border-accent!";

type Key = "hub" | "dar" | "duo" | "cards" | "lanes" | "matrix" | "prevent" | "hood" | "changes" | "start";
type Bg = "white" | "cream" | "navy";

// `dar` and `prevent` like to be navy; everything else is light. A navy section is only used where it does not
// touch another dark one (the hero counts) and is not the last.
function plan(keys: readonly Key[]): Record<Key, Bg> {
  const out = {} as Record<Key, Bg>;
  let prevDark = true;
  let lastLight: "white" | "cream" = "cream";
  keys.forEach((k, i) => {
    let dark = k === "dar" || k === "duo" || k === "cards" || k === "prevent";
    if (dark && (prevDark || i === keys.length - 1)) dark = false;
    if (dark) {
      out[k] = "navy";
    } else {
      lastLight = lastLight === "white" ? "cream" : "white";
      out[k] = lastLight;
    }
    prevDark = dark;
  });
  return out;
}

export function ProductPage({ data }: { data: ProductPageData }) {
  const order: readonly Key[] = data.matrix?.before
    ? ["hub", "dar", "duo", "cards", "matrix", "lanes", "prevent", "hood", "changes", "start"]
    : ["hub", "dar", "duo", "cards", "lanes", "matrix", "prevent", "hood", "changes", "start"];
  const keys = order.filter((k) => k === "lanes" || k === "start" || data[k]);
  const bgs = plan(keys);

  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        <Hero data={data} />
        {keys.map((k, i) => {
          const first = i === 0;
          const bg = bgs[k];
          const common = { bg, first };
          switch (k) {
            case "hub":
              return <HubSection key={k} hub={data.hub!} {...common} />;
            case "dar":
              return <DarSection key={k} dar={data.dar!} {...common} />;
            case "duo":
              return <DuoSection key={k} duo={data.duo!} {...common} />;
            case "cards":
              return <CardsSection key={k} cards={data.cards!} {...common} />;
            case "matrix":
              return <MatrixSection key={k} matrix={data.matrix!} {...common} />;
            case "lanes":
              return <LanesSection key={k} lanes={data.lanes} {...common} />;
            case "prevent":
              return <PreventSection key={k} prevent={data.prevent!} {...common} />;
            case "hood":
              return <HoodSection key={k} hood={data.hood!} {...common} />;
            case "changes":
              return <ChangesSection key={k} changes={data.changes!} {...common} />;
            case "start":
              return <StartSection key={k} start={data.start} {...common} />;
          }
        })}
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}

type SecProps = { bg: Bg; first: boolean };

function Band({ id, bg, first, children }: SecProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={`${BAND} ${first ? "pt-3 sm:pt-5 lg:pt-8" : ""}`}>
      <Section id={id} background={bg === "navy" ? "navy" : bg === "cream" ? "cream-gradient" : "white"} className={PAD_L}>
        {children}
      </Section>
    </div>
  );
}

// ---- Hero ------------------------------------------------------------------------------------------------

function Hero({ data }: { data: ProductPageData }) {
  const h = data.hero;
  const cols = h.proof.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    // id="hero" is what the header looks for to match its dark-canvas treatment, exactly as on the homepage.
    <Section id="hero" background="canvas" className="pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      <Container className={`flex flex-col items-center text-center ${GUTTER}`}>
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
          <p className="dt-eyebrow">{h.eyebrow}</p>
          <span aria-hidden="true" className="hidden h-px w-10 bg-navy-hairline sm:block lg:w-14" />
        </div>

        <h1 className="dt-display mt-8 text-4xl leading-[1.04] font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          <span className="block text-navy">{h.lead[0]}</span>
          <span className="block text-accent">{h.lead[1]}</span>
        </h1>

        <p className="dt-body mt-8 max-w-3xl text-[17px] text-balance sm:text-lg">{h.body}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <RecoveryCtaButton entryContext="recovery-cta" variant="solid">
            {h.primary}
          </RecoveryCtaButton>
          <CtaLink href={h.secondary.href} variant="outline">
            {h.secondary.label}
          </CtaLink>
        </div>

        <ProductHeroArt glyphs={h.glyphs} out={h.out} className="mt-14 h-auto w-full max-w-2xl text-navy sm:mt-16" />

        <ul className={`mt-12 grid w-full max-w-5xl border-y border-navy-hairline sm:mt-14 ${cols}`}>
          {h.proof.map((item, i) => (
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

// ---- The evidence picture: what goes in, the engine, what comes back --------------------------------------

// A dot hops along the link, so the run reads left to right (top to bottom on phones).
function Hop({ i = 0 }: { i?: number }) {
  return (
    <span aria-hidden="true" className="relative mx-auto flex h-8 w-px flex-shrink-0 items-center justify-center bg-accent/45 lg:mx-0 lg:h-px lg:w-10 lg:self-center">
      <span
        className="ap-hop absolute top-0 left-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] lg:top-1/2 lg:left-0 lg:-translate-x-1/2"
        style={{ "--i": i, "--hop": "40px", "--hop-v": "32px" } as React.CSSProperties}
      />
      <svg viewBox="0 0 10 12" className="absolute -bottom-0.5 h-2.5 w-2 rotate-90 text-accent lg:top-1/2 lg:right-0 lg:bottom-auto lg:-translate-y-1/2 lg:rotate-0" fill="none">
        <path d="M2 1.5l6 4.5-6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function HubSection({ hub, bg, first }: { hub: NonNullable<ProductPageData["hub"]> } & SecProps) {
  return (
    <Band id="evidence" bg={bg} first={first}>
      <Container className={GUTTER}>
        <Header eyebrow={hub.eyebrow} id="evidence-title">
          {hub.title}
        </Header>

        <div className="dt-reveal mt-16 overflow-hidden rounded-[28px] border border-white/10 bg-navy sm:mt-20">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 sm:px-8">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase sm:text-[12px]">{hub.card.title}</p>
            <p className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase sm:text-[12px]">
              <span aria-hidden="true" className="ap-live h-2 w-2 rounded-full bg-accent" />
              {hub.card.live}
            </p>
          </div>

          <div className="grid items-center gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,0.8fr)_auto_minmax(0,1fr)] lg:gap-x-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">{hub.inputsLabel}</p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {hub.inputs.map((t, i) => (
                  <li key={`${t.title}-${i}`} className="rounded-[12px] border border-white/15 bg-white/[0.05] px-3.5 py-2.5">
                    <span className="dt-display block text-[0.875rem] leading-[1.2] font-semibold text-white">{t.title}</span>
                    <span className="mt-0.5 block text-[11.5px] leading-[1.35] text-white/60">{t.sub}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Hop />

            <div className="rounded-[20px] border border-accent/70 bg-accent/[0.1] p-5 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent text-canvas">
                <AiIcon name="orchestration" className="h-6 w-6" />
              </span>
              <p className="dt-display mt-3 text-[1.125rem] font-semibold text-white">{hub.engine.title}</p>
              <p className="mt-1.5 text-[13px] leading-[1.45] text-white/70">{hub.engine.sub}</p>
            </div>

            <Hop i={3} />

            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">{hub.outputsLabel}</p>
              <ul className="mt-4 grid gap-2.5">
                {hub.outputs.map((t, i) => (
                  <li key={`${t.title}-${i}`} className="rounded-[12px] border border-accent/40 bg-accent/[0.06] px-3.5 py-2.5">
                    <span className="dt-display block text-[0.875rem] leading-[1.2] font-semibold text-white">{t.title}</span>
                    <span className="mt-0.5 block text-[11.5px] leading-[1.35] text-white/60">{t.sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {hub.result && (
            <p className="border-t border-white/10 px-6 py-4 text-[14.5px] leading-[1.6] text-white/80 sm:px-8">
              {hub.resultLabel && <span className="font-semibold text-white">{hub.resultLabel} </span>}
              {hub.result}
            </p>
          )}
          <p className="border-t border-white/10 bg-white/[0.04] px-6 py-3.5 text-[12.5px] leading-[1.55] text-white/65 sm:px-8">{hub.footer}</p>
        </div>
      </Container>
    </Band>
  );
}

// ---- Discover · Assess · Recover ----------------------------------------------------------------------------

function DarSection({ dar, bg, first }: { dar: NonNullable<ProductPageData["dar"]> } & SecProps) {
  const dark = bg === "navy";
  return (
    <Band id="darp" bg={bg} first={first}>
      <Container className={GUTTER}>
        <Header eyebrow={dar.eyebrow} id="darp-title" body={dar.body} dark={dark}>
          {dar.title}
        </Header>

        <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-3 lg:gap-6">
          {dar.items.map((d) => (
            <article
              key={d.letter}
              className={`dt-reveal flex gap-5 rounded-[24px] border p-7 transition-colors sm:p-8 ${
                dark ? "border-white/10 bg-white/[0.04] hover:border-accent/60" : "border-navy-hairline bg-cream-50 hover:border-accent"
              }`}
            >
              <span className="dt-display flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[1.5rem] font-semibold text-canvas">{d.letter}</span>
              <div>
                <h3 className={`dt-display text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.01em] ${dark ? "text-white" : "text-navy"}`}>{d.title}</h3>
                <p className={`mt-3 text-[15px] leading-[1.7] ${dark ? "text-white/70" : "text-navy-body"}`}>{d.body}</p>
              </div>
            </article>
          ))}
        </div>

        {dar.link && (
          <div className="dt-reveal mt-12 flex justify-center sm:mt-14">
            <CtaLink href={dar.link.href} variant={dark ? "dark" : "outline"} className={dark ? DARK_BTN : ""}>
              {dar.link.label}
            </CtaLink>
          </div>
        )}
      </Container>
    </Band>
  );
}

// ---- A grid of short cards ------------------------------------------------------------------------------------

function CardsSection({ cards, bg, first }: { cards: NonNullable<ProductPageData["cards"]> } & SecProps) {
  const dark = bg === "navy";
  return (
    <Band id="engine" bg={bg} first={first}>
      <Container className={GUTTER}>
        <Header eyebrow={cards.eyebrow} id="engine-title" body={cards.body} dark={dark}>
          {cards.title}
        </Header>

        <div className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.items.map((c) => (
            <article
              key={c.tag}
              className={`dt-reveal flex flex-col rounded-[24px] border p-6 transition-colors sm:p-7 ${
                dark ? "border-white/10 bg-white/[0.04] hover:border-accent/60" : "border-navy-hairline bg-cream-50 hover:border-accent"
              }`}
            >
              <p className="text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">{c.tag}</p>
              <h3
                className={`dt-display mt-4 font-semibold tracking-[-0.01em] ${cards.stat ? "text-[3.25rem] leading-[1] tracking-[-0.03em] text-accent" : `text-[1.25rem] leading-[1.2] ${dark ? "text-white" : "text-navy"}`}`}
              >
                {c.title}
              </h3>
              {c.body && <p className={`mt-3 text-[14.5px] leading-[1.65] ${dark ? "text-white/70" : "text-navy-body"}`}>{c.body}</p>}
            </article>
          ))}
          {cards.outcome && (
            <article className="dt-reveal flex flex-col rounded-[24px] border border-accent/70 bg-accent/[0.1] p-6 sm:p-7">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">{cards.outcome.tag}</p>
              <h3 className={`dt-display mt-4 text-[1.25rem] leading-[1.2] font-semibold tracking-[-0.01em] ${dark ? "text-white" : "text-navy"}`}>{cards.outcome.title}</h3>
              <p className={`mt-3 text-[14.5px] leading-[1.65] ${dark ? "text-white/80" : "text-navy-body"}`}>{cards.outcome.body}</p>
            </article>
          )}
        </div>

        {cards.link && (
          <div className="dt-reveal mt-12 flex flex-col items-center gap-4 sm:mt-14">
            {cards.linkPrompt && <p className={`text-[15.5px] ${dark ? "text-white/70" : "text-navy-body"}`}>{cards.linkPrompt}</p>}
            <CtaLink href={cards.link.href} variant={dark ? "dark" : "outline"} className={dark ? DARK_BTN : ""}>
              {cards.link.label}
            </CtaLink>
          </div>
        )}
      </Container>
    </Band>
  );
}

// ---- A table of examples -----------------------------------------------------------------------------------------

function MatrixSection({ matrix, bg, first }: { matrix: NonNullable<ProductPageData["matrix"]> } & SecProps) {
  return (
    <Band id="in-practice" bg={bg} first={first}>
      <LongSectionContextLabel label={matrix.eyebrow} headingId="practice-title" />
      <Container className={GUTTER}>
        <Header eyebrow={matrix.eyebrow} id="practice-title" body={matrix.body}>
          {matrix.title}
        </Header>

        {/* Desktop: the table. */}
        <div className="dt-reveal mt-16 hidden overflow-hidden rounded-[28px] border border-navy-hairline sm:mt-20 md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className={bg === "cream" ? "bg-white" : "bg-cream-50"}>
                {matrix.columns.map((c, i) => (
                  <th key={c} scope="col" className={`px-5 py-5 text-[11px] font-semibold tracking-[0.14em] uppercase ${i === matrix.columns.length - 1 ? "text-crimson" : "text-navy-muted"} ${i === 0 ? "lg:px-8" : ""}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((r) => (
                <tr key={r[0]} className="border-t border-navy-divider">
                  {r.map((cell, i) => (
                    i === 0 ? (
                      <th key={i} scope="row" className="dt-display px-5 py-4 align-top text-[1rem] font-semibold text-navy lg:px-8">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className={`px-5 py-4 align-top text-[14.5px] leading-[1.55] ${i === r.length - 1 ? "font-medium text-navy" : "text-navy-body"}`}>
                        {cell}
                      </td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: one card per row. */}
        <div className="mt-14 grid gap-4 md:hidden">
          {matrix.rows.map((r) => (
            <article key={r[0]} className="dt-reveal overflow-hidden rounded-[22px] border border-navy-hairline">
              <h3 className="dt-display bg-cream-50 px-5 py-4 text-[1.125rem] font-semibold text-navy">{r[0]}</h3>
              <dl className="divide-y divide-navy-divider px-5">
                {r.slice(1).map((cell, i) => (
                  <div key={i} className="py-3">
                    <dt className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">{matrix.columns[i + 1]}</dt>
                    <dd className="mt-1 text-[14.5px] leading-[1.55] text-navy">{cell}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        {matrix.note && (
          <div className="dt-reveal mx-auto mt-10 max-w-3xl rounded-[24px] border border-accent/50 bg-accent/[0.07] p-6 text-center sm:p-8">
            <h3 className="dt-display text-[1.375rem] font-semibold text-navy">{matrix.note.title}</h3>
            <p className="mt-3 text-[15.5px] leading-[1.7] text-navy-body">{matrix.note.body}</p>
          </div>
        )}
      </Container>
    </Band>
  );
}

// ---- Two directions, and the clock over both -----------------------------------------------------------------

function DuoArrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d={dir === "left" ? "M20 12H5M10 7l-5 5 5 5" : "M4 12h15M14 7l5 5-5 5"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DuoSection({ duo, bg, first }: { duo: NonNullable<ProductPageData["duo"]> } & SecProps) {
  const dark = bg === "navy";
  return (
    <Band id="directions" bg={bg} first={first}>
      <Container className={GUTTER}>
        <Header eyebrow={duo.eyebrow} id="directions-title" body={duo.body} dark={dark}>
          {duo.title}
        </Header>

        <div className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2 lg:gap-6">
          {[duo.left, duo.right].map((side) => (
            <article
              key={side.title}
              className={`dt-reveal flex flex-col rounded-[28px] border p-7 sm:p-9 ${dark ? "border-white/10 bg-white/[0.04]" : "border-navy-hairline bg-cream-50"}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-canvas">
                <DuoArrow dir={side.arrow} />
              </span>
              {side.tag && <p className="mt-6 text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">{side.tag}</p>}
              <h3 className={`dt-display ${side.tag ? "mt-2" : "mt-6"} text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em] sm:text-[1.75rem] ${dark ? "text-white" : "text-navy"}`}>{side.title}</h3>
              <p className={`mt-4 text-[15.5px] leading-[1.7] ${dark ? "text-white/70" : "text-navy-body"}`}>{side.body}</p>
            </article>
          ))}
        </div>

        <div className="dt-reveal mt-5 flex gap-5 rounded-[28px] border border-accent/60 bg-accent/[0.08] p-6 sm:mt-6 sm:items-center sm:gap-7 sm:p-9">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-accent/60 bg-canvas text-white">
            <DpIcon name="clock" className="h-6 w-6" />
          </span>
          <div>
            <h3 className={`dt-display text-[1.375rem] leading-[1.15] font-semibold sm:text-[1.5rem] ${dark ? "text-white" : "text-navy"}`}>{duo.banner.title}</h3>
            <p className={`mt-3 text-[15.5px] leading-[1.7] ${dark ? "text-white/80" : "text-navy-body"}`}>{duo.banner.body}</p>
          </div>
        </div>
      </Container>
    </Band>
  );
}

// ---- The lanes: a sticky list, one article each -----------------------------------------------------------

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

function LaneArticle({ g, word }: { g: Lane; word: string }) {
  return (
    <article id={g.id} className="dt-reveal scroll-mt-32 rounded-[28px] border border-navy-hairline bg-white/80 p-6 sm:p-10">
      <div className="flex items-center gap-4">
        <span className="dt-display flex h-12 w-12 items-center justify-center rounded-full bg-navy text-[1.25rem] font-semibold text-accent">{g.n}</span>
        <p className="dt-eyebrow dt-eyebrow-accent">{g.eyebrow ?? `${word} ${g.n}`}</p>
      </div>
      <h3 className="dt-display mt-5 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.02em] text-balance text-navy sm:text-[2.125rem]">{g.title}</h3>
      <p className="mt-5 max-w-3xl text-[16.5px] leading-[1.7] text-navy-body">{g.lead}</p>

      <div className="mt-8 rounded-[20px] border border-navy-divider bg-cream-50 px-4 py-6 text-navy sm:px-8">
        <Motif kind={g.motif} className="mx-auto h-auto w-full max-w-[560px]" />
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
          {g.callout.title && <h4 className="dt-display mt-3 text-[1.375rem] leading-[1.2] font-semibold text-white sm:text-[1.625rem]">{g.callout.title}</h4>}
          <p className={`${g.callout.title ? "mt-3" : "mt-2"} text-[15.5px] leading-[1.7] text-white/75`}>{g.callout.body}</p>
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

function LanesSection({ lanes, bg, first }: { lanes: ProductPageData["lanes"] } & SecProps) {
  return (
    <Band id="lanes" bg={bg} first={first}>
      <LongSectionContextLabel label={lanes.eyebrow} headingId="lanes-title" />
      <Container className={GUTTER}>
        <Header eyebrow={lanes.eyebrow} id="lanes-title" body={lanes.body}>
          {lanes.title}
        </Header>

        <div className="mt-16 grid gap-10 sm:mt-20 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
          <ApGateRail gates={lanes.items} />
          <div className="space-y-6 lg:space-y-8">
            {lanes.items.map((g) => (
              <LaneArticle key={g.id} g={g} word={lanes.laneWord ?? "Part"} />
            ))}
          </div>
        </div>
      </Container>
    </Band>
  );
}

// ---- Prevent: the same rules, run forward --------------------------------------------------------------------

function PreventSection({ prevent, bg, first }: { prevent: NonNullable<ProductPageData["prevent"]> } & SecProps) {
  const dark = bg === "navy";
  return (
    <Band id="prevent" bg={bg} first={first}>
      <Container className={GUTTER}>
        <Header eyebrow={prevent.eyebrow} id="prevent-title" body={prevent.body} dark={dark}>
          {prevent.title}
        </Header>

        <ol className="relative mt-16 grid gap-6 sm:mt-20 lg:grid-cols-5 lg:gap-4">
          <span aria-hidden="true" className="absolute top-[27px] right-[10%] left-[10%] hidden h-px bg-accent/60 lg:block" />
          {prevent.steps.map((s) => (
            <li key={s.n} className="dt-reveal relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
              <span
                className={`dt-display relative flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-full border border-accent text-[1.25rem] font-semibold text-accent ${dark ? "bg-canvas" : "bg-white"}`}
              >
                {s.n}
              </span>
              <div className="lg:mt-5">
                <h3 className={`dt-display text-[1.25rem] leading-[1.15] font-semibold ${dark ? "text-white" : "text-navy"}`}>{s.title}</h3>
                <p className={`mt-2.5 text-[14.5px] leading-[1.65] ${dark ? "text-white/70" : "text-navy-body"}`}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {prevent.link && (
          <div className="dt-reveal mt-14 flex justify-center sm:mt-16">
            <CtaLink href={prevent.link.href} variant={dark ? "dark" : "outline"} className={dark ? DARK_BTN : ""}>
              {prevent.link.label}
            </CtaLink>
          </div>
        )}
      </Container>
    </Band>
  );
}

// ---- Under the hood --------------------------------------------------------------------------------------

function HoodSection({ hood, bg, first }: { hood: NonNullable<ProductPageData["hood"]> } & SecProps) {
  return (
    <Band id="under-the-hood" bg={bg} first={first}>
      <Container className={GUTTER}>
        <Header eyebrow={hood.eyebrow} id="hood-title" body={hood.body}>
          {hood.title}
        </Header>

        <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-3 lg:gap-6">
          {hood.items.map((h) => (
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
          {hood.links.map((l) => (
            <CtaLink key={l.label} href={l.href} variant="outline">
              {l.label}
            </CtaLink>
          ))}
        </div>
      </Container>
    </Band>
  );
}

// ---- What changes ------------------------------------------------------------------------------------------

function ChangesSection({ changes, bg, first }: { changes: NonNullable<ProductPageData["changes"]> } & SecProps) {
  const c = changes.columns;
  return (
    <Band id="what-changes" bg={bg} first={first}>
      <LongSectionContextLabel label={changes.eyebrow} headingId="changes-title" />
      <Container className={GUTTER}>
        <Header eyebrow={changes.eyebrow} id="changes-title" body={changes.body}>
          {changes.title}
        </Header>

        {/* Desktop: three columns. */}
        <div className="dt-reveal mt-16 hidden overflow-hidden rounded-[28px] border border-navy-hairline sm:mt-20 md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className={bg === "cream" ? "bg-white" : "bg-cream-50"}>
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
              {changes.rows.map((r) => (
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
                  <td className={`border-l border-accent/30 px-6 py-5 align-top text-[15px] leading-[1.55] font-medium text-navy lg:px-8 ${bg === "cream" ? "bg-white" : "bg-cream-50"}`}>
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
          {changes.rows.map((r) => (
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
        {changes.note && (
          <div className="dt-reveal mx-auto mt-10 max-w-3xl rounded-[24px] border border-accent/50 bg-accent/[0.07] p-6 text-center sm:p-8">
            <h3 className="dt-display text-[1.375rem] font-semibold text-navy">{changes.note.title}</h3>
            <p className="mt-3 text-[15.5px] leading-[1.7] text-navy-body">{changes.note.body}</p>
          </div>
        )}
      </Container>
    </Band>
  );
}

// ---- Start here --------------------------------------------------------------------------------------------

function StartSection({ start, bg, first }: { start: ProductPageData["start"] } & SecProps) {
  const n = start.items.length;
  const grid = n === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return (
    <Band id="start-here" bg={bg} first={first}>
      <Container className={GUTTER}>
        <Header eyebrow={start.eyebrow} id="start-title" body={start.body}>
          {start.title}
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
                  <span className="text-[6.5rem] leading-[0.9] font-semibold tracking-[-0.05em] sm:text-[7.5rem]">{start.stat.value}</span>
                  <span className="mt-1 text-[1.25rem] font-semibold tracking-[0.22em] uppercase">{start.stat.unit}</span>
                </p>
              </div>
              <p className="mt-6 max-w-[17rem] text-[15px] leading-[1.6] text-white/70">{start.stat.text}</p>
            </div>

            <div className="lg:col-span-7">
              <p className="text-[17px] leading-[1.75] text-white/85 sm:text-[19px]">{start.how}</p>
              <ul className="mt-8 flex flex-wrap items-center gap-2.5" aria-label="What goes in, and what comes out">
                {start.flow.map((f, i) => (
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
                    <span className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[0.04em] ${i === start.flow.length - 1 ? "border-accent/70 text-accent" : "border-white/20 text-white/80"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={`mt-5 grid gap-5 sm:grid-cols-2 lg:mt-6 lg:gap-6 ${grid}`}>
          {start.items.map((it) => (
            <article key={it.title} className="dt-reveal group flex flex-col rounded-[24px] border border-navy-hairline bg-white/80 p-6 transition-colors hover:border-accent sm:p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-hairline bg-white text-navy">
                <DpIcon name={it.kind} className="h-[24px] w-[24px]" />
              </span>
              <h3 className="dt-display mt-6 text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.01em] text-navy">{it.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.65] text-navy-body">{it.body}</p>
            </article>
          ))}
        </div>

        {start.note && <p className="dt-reveal mx-auto mt-10 max-w-3xl text-center text-[15.5px] leading-[1.7] text-navy-body">{start.note}</p>}

        <div className="dt-reveal mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4">
          <RecoveryCtaButton entryContext="recovery-cta">{start.cta}</RecoveryCtaButton>
          <CtaLink href={start.link.href} variant="outline">
            {start.link.label}
          </CtaLink>
        </div>
      </Container>
    </Band>
  );
}
