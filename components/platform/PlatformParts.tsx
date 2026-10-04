import type { PlatformFeature } from "./platform-data";
import { PlatformIcon, type PlatformIconName } from "./PlatformIcons";

// Building blocks shared by the Platform page sections. `tone` is the surface the block sits on: "light"
// (white / cream sections) or "dark" (the fixed navy section, where ink tokens are not re-pointed).

type Tone = "light" | "dark";

// Left-aligned stage header (number, title, intro), the same two-column rhythm as the homepage's
// "The situation" band.
export function StageHeader({
  number,
  title,
  intro,
  headingId,
  tone = "light",
}: {
  number: string;
  title: string;
  intro: string;
  headingId: string;
  tone?: Tone;
}) {
  const dark = tone === "dark";
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-12">
      <div className="dt-reveal lg:col-span-7">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-10 bg-accent" />
          <p className="dt-eyebrow dt-eyebrow-accent">Stage {number}</p>
        </div>
        <h2
          id={headingId}
          className={`dt-display mt-6 text-4xl leading-[1.04] font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.5rem] ${dark ? "text-white" : "text-navy"}`}
        >
          {title}
        </h2>
      </div>
      <p
        className={`dt-reveal max-w-md text-[17px] leading-[1.65] lg:col-span-5 lg:justify-self-end ${dark ? "text-white/70" : "text-navy-body"}`}
      >
        {intro}
      </p>
    </div>
  );
}

export function FeatureCard({
  feature,
  tone = "light",
  tagLines = 1,
}: {
  feature: PlatformFeature;
  tone?: Tone;
  tagLines?: 1 | 2;
}) {
  const dark = tone === "dark";
  return (
    <article
      className={`dt-reveal group flex flex-col rounded-[24px] border p-7 transition-colors sm:p-8 ${
        dark
          ? "border-white/10 bg-white/[0.04] hover:border-accent/60"
          : "border-navy-hairline bg-white/75 hover:border-accent"
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full border ${
          dark ? "border-white/20 text-white" : "border-navy-hairline bg-white text-navy"
        }`}
      >
        <PlatformIcon name={feature.icon} className="h-[22px] w-[22px]" />
      </span>

      <h3
        className={`dt-display mt-7 text-[1.625rem] leading-[1.1] font-semibold tracking-[-0.01em] ${dark ? "text-white" : "text-navy"}`}
      >
        {feature.title}
      </h3>
      {/* `tagLines` reserves room for a wrapping tag so descriptions line up across a row from lg. */}
      <p className={`mt-4 flex gap-3 ${tagLines === 2 ? "items-start lg:min-h-[38.4px]" : "items-center"}`}>
        <span
          aria-hidden="true"
          className={`h-px w-6 flex-shrink-0 bg-accent transition-[width] duration-300 group-hover:w-10 ${tagLines === 2 ? "mt-[9.5px]" : ""}`}
        />
        <span
          className={`text-[11px] leading-[1.6] font-medium tracking-[0.14em] uppercase sm:text-[12px] ${dark ? "text-white/60" : "text-navy-muted"}`}
        >
          {feature.tag}
        </span>
      </p>
      <p className={`mt-5 text-[16px] leading-[1.65] ${dark ? "text-white/75" : "text-navy-body"}`}>
        {feature.description}
      </p>

      <ul
        className={`mt-6 space-y-3 border-t pt-6 ${dark ? "border-white/10" : "border-navy-divider"}`}
      >
        {feature.points.map((point) => (
          <li
            key={point}
            className={`flex gap-3 text-[15px] leading-[1.55] ${dark ? "text-white/80" : "text-navy"}`}
          >
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

// The "AI-native" band inside a stage. On a light section it is a navy panel; on the navy section it is a
// lightly-shaded panel with an amber outline, so it is set off either way.
export function AiCallout({
  icon,
  title,
  body,
  tone = "light",
}: {
  icon: PlatformIconName;
  title: string;
  body: string;
  tone?: Tone;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`dt-reveal grid gap-8 rounded-[28px] p-8 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:p-12 ${
        dark ? "border border-accent/40 bg-white/[0.06]" : "bg-navy"
      }`}
    >
      <div className="lg:col-span-5">
        <p className="flex items-center gap-3 text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/50">
            <PlatformIcon name={icon} className="h-[18px] w-[18px]" />
          </span>
          AI-native
        </p>
        <h3 className="dt-display mt-5 text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.01em] text-balance text-white sm:text-[2rem]">
          {title}
        </h3>
      </div>
      <p className="text-[16px] leading-[1.7] text-white/75 sm:text-[17px] lg:col-span-7">{body}</p>
    </div>
  );
}
