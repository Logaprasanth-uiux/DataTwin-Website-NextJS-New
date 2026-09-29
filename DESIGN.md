# DataTwin Website — Design Specification

Handoff document for the dev team. Values below are taken from the implemented code (`app/globals.css`, `app/layout.tsx`, `components/layout/Section.tsx`, `components/ui/CtaLink.tsx`, `lib/theme.ts`), so they match what is in production-candidate today. If the code and this file disagree, the code wins — please flag it.

Stack: Next.js (App Router) + Tailwind CSS v4 (tokens declared in `@theme inline`).

---

## 1. Brand & Principles

- Product: DataTwin — finance observability for the office of the CFO.
- Tone: restrained, editorial, financial. Warm cream + deep navy, one amber accent.
- Colour is derived from navy via opacity (no extra hues). Red is a narrow semantic token only.
- Motion is subtle (small opacity/translate), and always disabled under `prefers-reduced-motion`.
- Shadows are used sparingly; radii are subtle except for the large section canvas.

---

## 2. Colour Tokens

| Token | Value | Use |
|---|---|---|
| `--navy` | `#041e3c` | Primary brand / text on light / dark surface |
| `--accent` | `#dda162` | Amber accent: arrows, hovers, focus rings, eyebrow on dark |
| `--crimson` | `#710c10` | Eyebrow accent on light surfaces |
| `--canvas` | `#041e3c` | Dark theme surface |
| `--ink-on-dark` | `#f5f0e9` | Text colour on dark surfaces |
| `--cream-50` | `#fefcfb` | Gradient stop |
| `--cream-100` | `#fbf4ed` | Gradient stop |
| `--cream-200` | `#f9ede3` | Gradient stop |
| `--loss` | `#c96b5c` | Financial-loss semantic red (not a brand colour) |
| `--background` | `#ffffff` | Page background |
| `--foreground` | `var(--navy)` | Default text |

Derived navy tones (`color-mix` with transparent):

| Token | Navy opacity | Use |
|---|---|---|
| `--navy-muted` | 62% | Eyebrows, nav, labels |
| `--navy-body` | 70% | Paragraph copy |
| `--navy-faint` | 34% | Captions |
| `--navy-hairline` | 16% | Borders |
| `--navy-divider` | 9% | Section dividers |

Gradients:
- Light hero / cream sections: `linear-gradient(to bottom, cream-200 → cream-100 → cream-50 → #fff)` (`.dt-hero-gradient`).
- Themable canvas (`.dt-canvas`): white → cream-50 → cream-100 → cream-200 in light; solid `--canvas` in dark (cross-faded).

Tailwind utilities available: `navy`, `accent`, `crimson`, `canvas`, `cream-50/100/200`, `navy-muted/body/faint/hairline/divider`, `loss`.

---

## 3. Typography

Two-level system, loaded via `next/font/google`:

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / headings / large numbers | **Poppins** (`--font-display`) | 600 only | Never for body copy. |
| Body / UI | **Inter** (`--font-body`, variable) | 400 / 500 / 600 | Default `font-sans`. |

Poppins runs larger than the face the sizes were designed in, so `.dt-display` and `.dt-heading` apply `font-size-adjust: ex-height 0.41`. **Keep component `font-size` values as designed; do not compensate manually.**

Type roles (defined in `globals.css`):

| Class | Size | Weight | Other |
|---|---|---|---|
| `.dt-eyebrow` | 11px (12px ≥640px) | 500 | Uppercase, tracking 0.14em, line-height 1.6, colour `--navy-muted` |
| `.dt-eyebrow-accent` | — | — | Colour `--eyebrow-accent` (crimson on light, amber on dark) |
| `.dt-heading` | per component | 600 | Poppins, tracking -0.01em, colour `--navy` |
| `.dt-body` | 18px | 400 | Line-height 1.6, colour `--navy-body` |
| `.dt-caption` | 12.5px | 500 | Tracking 0.02em, colour `--navy-faint` |
| `.dt-nav-link` | 14px | 500 | Colour `--navy-muted` |
| `.dt-button` | 14px | 600 | Tracking -0.005em |
| `.dt-context-marker` | 11px (12px ≥640px) | 600 | Uppercase, tracking 0.14em |

---

## 4. Layout, Spacing & Shape

- Content max width: `1200px` (`--content-max-width`, `.dt-container`, centred).
- Section side inset (contained sections): `12px` → `20px` (≥640px) → `32px` (≥1024px) (`px-3 sm:px-5 lg:px-8`). The header shares this inset.
- Main top padding: `pt-3 sm:pt-4 lg:pt-6`.
- Section vertical padding: `py-16/20/24` (Trusted-by), `py-20/24/32` (DARP, Next steps), `py-24/28/36` (Recovery, Solutions, Outcomes) at base / `sm` / `lg`.
- Radii: `--radius-sm` 6px, `--radius-md` 10px, `--radius-section` **32px** (large contained section canvas). Buttons are full pills.
- Shadow: `--shadow-soft: 0 1px 2px rgba(27,44,70,0.05)` (light); `0 1px 2px rgba(0,0,0,0.25)` (dark).
- Breakpoints: Tailwind defaults (`sm` 640, `lg` 1024).

### Section component

`<Section background contained>` (`components/layout/Section.tsx`):

| `background` | Result |
|---|---|
| `white` | Page white |
| `cream-gradient` | Fixed warm gradient, both themes |
| `canvas` | Themable: warm gradient (light) / navy (dark) |
| `navy` | Always navy, both themes |

`contained={false}` renders full-bleed with no rounded card.

---

## 5. Page Structure (Home, in order)

| # | Section | Background | Contained |
|---|---|---|---|
| — | Navbar (sticky header) | Frosted white; navy panel over dark Hero | — |
| 1 | Hero (`#hero`) | `canvas` | Yes |
| 2 | Recovery (`#recovery`) | `white` | No (full-bleed) |
| 3 | Situation | `cream-gradient` | Yes |
| 4 | DARP (`#darp`) | `navy` | Yes |
| 5 | Trusted by (`#trusted-by`) | `white` | No |
| 6 | Solutions (`#solutions`) | `cream-gradient` | Yes |
| 7 | Outcomes (`#outcomes`) | `navy` | Yes |
| 8 | Next steps | `white` | Yes |
| 9 | Final CTA + Footer | `canvas` | Yes |

Other route: `/chat` (guided recovery chat flow — see §9).

---

## 6. Theming (Light / Dark)

- Switch: `<html data-theme="light" | "dark">`. **Default is dark** on first visit; the choice is saved in `localStorage` key `dt-theme` and applied by an inline script before first paint (no flash).
- Light is the original approved design; dark only changes surfaces that opt in:
  - `background="canvas"` sections (Hero, Final CTA + footer)
  - The header while over the Hero (`data-over-hero="true"`)
- Inside those surfaces the ink tokens are re-pointed to `--ink-on-dark` (`#f5f0e9`), so `text-navy`, `text-navy-body`, `border-navy-hairline` etc. adapt automatically. Dark overrides: muted 68%, body 76%, faint 46%, hairline 18%, divider 11%.
- Sections `navy`, `white`, `cream-gradient` are **not** affected by the theme.
- Use the `on-dark:` Tailwind variant only where the token swap isn't enough.
- Floating theme toggle (`.dt-theme-toggle`): pill, hairline border, hover/focus = accent; sun/moon icons cross-fade (300ms).
- Logo: standard mark by default, inverted mark on dark canvas, cross-faded (300ms). Assets in `public/logo`.
- Theme change eases colours over 450ms (class `dt-theme-fade`), only when reduced-motion is not requested.

---

## 7. Components

### CTA (`CtaLink`)
Pill button with trailing arrow icon (16×16, stroke 1.25). Renders `<a href>` or `<button onClick>` with identical styling.

| Variant | Height / padding | Fill | Text | Notes |
|---|---|---|---|---|
| `dark` (default) | h-11, px-5 | `--canvas` | white | Secondary in-content CTA; same in both themes; hover `canvas/90`; border white/30 on dark |
| `outline` | h-11, px-5 | none | `--navy` | Hairline border; accent border on hover/focus; accent arrow |
| `solid` | h-12, px-7 | `--navy` | white | Primary/final CTA. On dark canvas: amber fill, navy text/arrow |

All: `text-[14px]`, weight 600, `rounded-full`, `transition-colors`, arrow gap 10px.

### Section context label (`.dt-context-marker`)
Amber editorial marker, width fits text, solid amber behind text then eased fade to transparent (fade length 7rem mobile / 14rem ≥640px). Text colour `--canvas`. Fixed brand colours in both themes. Sticky-friendly (sections use `overflow: clip`, not `hidden`).

### Eyebrow
`.dt-eyebrow` + optional `.dt-eyebrow-accent` (crimson on light, amber on navy/dark).

### Scrollbar (`.dt-thin-scroll`)
Chat viewport only: 6px, transparent track, thumb `--navy-hairline` → `--navy-faint` on hover.

### Buttons/cursors
All enabled `<button>` / `[role=button]` get `cursor: pointer` globally.

### Focus
Visible focus uses a 2px accent outline with 3px offset (theme toggle); CTAs shift border/background on `focus-visible`.

---

## 8. Motion

Easing standard: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances.

| Class | Effect | Timing |
|---|---|---|
| `.dt-fade-up` | Fade + 8px rise | 700ms, 300ms delay |
| `.dt-reveal` | Scroll-driven fade-up (`animation-timeline: view()`), progressive enhancement | range entry 5%–45% |
| `.dt-draw` / `.dt-arrowhead` | SVG line draw, then arrowhead fade | 900ms @850ms / 250ms @1650ms |
| `.dt-fill-in` | Opacity .35→1 + 3px rise | 320ms |
| `.dt-char` / `.dt-phrase-out` | Streamed hero prompt: per-character reveal, then settle up 3px | 260ms / 380ms |
| `.dt-msg-in-assistant` | Chat: rise 6px | 320ms |
| `.dt-msg-in-user` | Chat: slide in 10px from right | 280ms |
| `.dt-typing-dot` | Typing indicator bounce (3px, opacity .3→1) | 1100ms loop |
| Recovery illustrations (`.rv-*`) | Looping build → hold → fade icons (bank / refund / audit / loop), periods 3566–4666ms with 0/700/1400/2100ms offsets | Pause when off-screen |
| DARP engine (`.dp-*`) | Signal particles flow left→right over a 16s loop; two turn amber between Assess and Recover; mobile spine sweep 5.5s | |
| DARP glyphs (`.dg-*`) | Discover / Assess / Recover / Prevent icon cycle, 4.8s | |
| Trusted-by ticker (`.dp-ticker-*`) | Marquee 55s linear loop with 7% edge mask fade; static wrapped list under reduced motion | |

**Reduced motion:** base styles are always the final, static state. Every animation above is disabled or replaced with the static picture under `prefers-reduced-motion: reduce`.

---

## 9. Chat Flow (`/chat`)

Guided conversational flow launched from the Hero prompt. Components live in `components/chat/`; logic/mock data in `lib/chat/`. Steps include: prompt & suggestions → option groups → period selection (incl. custom period) → file requirements / upload & validation (or portal fetch) → verification → reveal (blurred insight preview) → access gate → executive summary → (optional) improve-accuracy card → schedule a meeting. Conversations panel and file-context panel sit alongside the transcript. Currently uses mock data (`useMockFileValidation`, `mockResult`, `mockFileIssue`).

**Sales Register vs GST Reconciliation** runs in rounds: Sales Register + GSTR-1, then GSTR-1A, credit/debit notes (upload only, no GST Portal fetch) and GSTR-3B summary. Each round can be skipped.

**Improve-accuracy card:** after the summary is unlocked and above the schedule CTA, if any of those documents were not provided, a bordered card ("Optional" eyebrow, "Want a sharper number?") lists only the missing documents, each with a one-line business benefit, and a button to add the first missing one (rounds stay in fixed order, and each can still be skipped). It is hidden once every document is provided. The schedule CTA is never hidden or gated by it.

Transcript entrance animations and scrollbar are in §7–8.

---

## 10. Assets

- Logo: `public/logo` (standard + inverted marks).
- Icons are inline SVGs (`components/*/…Icons.tsx`, `footer-icons.tsx`): 1.25px round-cap strokes, `currentColor`.
- Favicon: `app/favicon.ico`.

---

## 11. Implementation Notes for Developers

1. Use the tokens/Tailwind colour names; do not hard-code hex values (the theme swap depends on the ink tokens).
2. Use `<Section>` for every page band; pick `background` from the four options.
3. Headings: Poppins 600 via `.dt-heading` / `.dt-display`. Body: Inter.
4. New dark-canvas-specific tweaks → `on-dark:` variant.
5. Any new animation must have a `prefers-reduced-motion` fallback where the base style is the final state.
6. This repo runs a newer Next.js than typical; check `node_modules/next/dist/docs/` before using framework APIs (see `AGENTS.md`).
7. Not yet documented here: per-section copy and exact heading sizes — these live in the section components under `components/sections/` and their `*-data.ts` files.
