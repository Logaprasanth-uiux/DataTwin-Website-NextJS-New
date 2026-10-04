import type { CSSProperties } from "react";
import { DarpGlyph } from "@/components/darp/DarpGlyph";
import { DARP_STAGES } from "@/components/darp/darp-data";
import { MenuGroupList } from "./MenuRow";
import {
  ESTIMATE_LABEL,
  LEARNING_DOWNLOAD,
  LEARNING_GROUPS,
  PLATFORM_ACROSS,
  PLATFORM_DARP,
  PLATFORM_OVERVIEW,
  PRODUCTS_PROMO,
  PRODUCT_GROUPS,
} from "./menu-data";
import { ArrowIcon, CheckIcon } from "./menu-icons";

type Handlers = { onNavigate: () => void; onEstimate: () => void };
const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

// ---- Platform ------------------------------------------------------------------------------------------

// "Analyse-first": three steps sitting above an untouched ERP. The line draws itself when the panel opens.
export function PlatformFlow({ className = "" }: { className?: string }) {
  const xs = [52, 160, 268];
  return (
    <svg
      viewBox="0 0 320 132"
      fill="none"
      className={className}
      role="img"
      aria-label="Acquire, process, report, above your ERP with nothing migrated"
    >
      <rect x="6" y="104" width="308" height="24" rx="8" className="stroke-navy-hairline" strokeDasharray="4 4" />
      <text x="160" y="120" textAnchor="middle" className="fill-navy-muted" fontSize="10.5" fontWeight="500">
        Your ERP — nothing migrated
      </text>
      <path d="M52 100V62" className="stroke-navy-hairline" strokeDasharray="3 3" />
      <path
        className="dt-mega-draw stroke-accent"
        pathLength={1}
        d="M70 40h72 M178 40h72"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {xs.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="40" r="18" className="fill-white stroke-navy" strokeWidth="1.25" />
          <circle cx={x} cy="40" r="4.5" className="dt-mega-pop fill-accent" style={stagger(i)} />
        </g>
      ))}
      {["Acquire", "Process", "Report"].map((t, i) => (
        <text key={t} x={xs[i]} y="80" textAnchor="middle" className="fill-navy" fontSize="12" fontWeight="600">
          {t}
        </text>
      ))}
      <text x="60" y="94" className="fill-navy-faint" fontSize="9.5" fontWeight="500">
        read-only
      </text>
    </svg>
  );
}

export function PlatformPanel({ onNavigate, onEstimate }: Handlers) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1.25fr_1fr] lg:gap-8">
      <a
        href={PLATFORM_OVERVIEW.href}
        onClick={onNavigate}
        className="dt-mega-item group flex flex-col rounded-[22px] border border-navy-hairline bg-white/70 p-6 transition-colors hover:border-accent"
        style={stagger(0)}
      >
        <p className="dt-eyebrow dt-eyebrow-accent">Platform</p>
        <h3 className="dt-heading mt-2 text-[20px] leading-tight">{PLATFORM_OVERVIEW.title}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-navy-body">{PLATFORM_OVERVIEW.desc}</p>
        <PlatformFlow className="mt-4 w-full" />
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[14px] font-semibold text-navy">
          {PLATFORM_OVERVIEW.cta}
          <ArrowIcon className="h-3.5 w-3.5 text-accent transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </a>

      <a
        href={PLATFORM_DARP.href}
        onClick={onNavigate}
        className="dt-mega-item dt-mega-dark group flex flex-col rounded-[22px] bg-canvas p-6 text-navy"
        style={stagger(1)}
      >
        <p className="dt-eyebrow dt-eyebrow-accent">Framework</p>
        <h3 className="dt-heading mt-2 text-[20px] leading-tight">{PLATFORM_DARP.title}</h3>
        <ul className="mt-4 grid grid-cols-4 gap-2" aria-label={PLATFORM_DARP.tagline}>
          {DARP_STAGES.map((s) => (
            <li
              key={s.key}
              className="flex flex-col items-center gap-2 rounded-[14px] border border-navy-hairline px-1 py-3"
            >
              <DarpGlyph stage={s.key} className="h-7 w-7 text-navy" />
              <span className="text-[11.5px] font-medium text-navy-body">{s.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] leading-relaxed text-navy-body">{PLATFORM_DARP.desc}</p>
        <ul className="mt-4 flex flex-col gap-1.5">
          {PLATFORM_DARP.points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-[13px] font-medium text-navy">
              <CheckIcon className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
              {p}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[14px] font-semibold text-accent">
          Explore DARP
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </a>

      <MenuGroupList
        label={PLATFORM_ACROSS.label}
        items={PLATFORM_ACROSS.items}
        index={2}
        onNavigate={onNavigate}
        onEstimate={onEstimate}
      />
    </div>
  );
}

// ---- Products ------------------------------------------------------------------------------------------

export function EstimatePromo({ index = 0, onEstimate }: { index?: number; onEstimate: () => void }) {
  return (
    <div
      className="dt-mega-item dt-mega-dark relative flex flex-col overflow-hidden rounded-[22px] bg-canvas p-5 text-navy xl:p-6"
      style={stagger(index)}
    >
      <svg
        viewBox="0 0 80 90"
        fill="none"
        className="pointer-events-none absolute -right-1 top-0 h-24 w-20"
        aria-hidden="true"
      >
        {[16, 40, 64].map((x, i) => (
          <path
            key={x}
            d={`M${x} 0v${34 + i * 8}`}
            className="dt-mega-drip stroke-accent"
            style={stagger(i)}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
        ))}
        <circle cx="40" cy="78" r="7" className="stroke-accent" strokeWidth="1.25" />
      </svg>
      <h3 className="dt-heading relative max-w-[14ch] text-[19px] leading-snug">{PRODUCTS_PROMO.title}</h3>
      <p className="relative mt-3 text-[13.5px] leading-relaxed text-navy-body">{PRODUCTS_PROMO.desc}</p>
      <button
        type="button"
        onClick={onEstimate}
        className="dt-button group relative mt-6 inline-flex h-11 items-center gap-2 self-start whitespace-nowrap rounded-full bg-accent px-4 text-[14px] text-canvas transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {ESTIMATE_LABEL}
        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

export function ProductsPanel({ onNavigate, onEstimate }: Handlers) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.15fr_0.8fr_1.1fr] lg:gap-6">
      {PRODUCT_GROUPS.map((g, i) => (
        <MenuGroupList
          key={g.label}
          label={g.label}
          items={g.items}
          index={i}
          onNavigate={onNavigate}
          onEstimate={onEstimate}
        />
      ))}
      <EstimatePromo
        index={3}
        onEstimate={() => {
          onNavigate();
          onEstimate();
        }}
      />
    </div>
  );
}

// ---- Learning Centre -----------------------------------------------------------------------------------

export function DownloadCard({ index = 0, onNavigate }: { index?: number; onNavigate: () => void }) {
  return (
    <a
      href={LEARNING_DOWNLOAD.href}
      onClick={onNavigate}
      className="dt-mega-item group flex flex-col rounded-[22px] border border-navy-hairline bg-white p-5 transition-colors hover:border-accent"
      style={stagger(index)}
    >
      <div className="relative h-24 overflow-hidden rounded-[12px] bg-cream-100 px-4 pt-4" aria-hidden="true">
        <div className="mx-auto h-full w-[70%] -rotate-2 rounded-t-[8px] border border-navy-hairline bg-white p-2 shadow-soft transition-transform duration-300 group-hover:rotate-0">
          <div className="h-1.5 w-1/2 rounded-full bg-navy" />
          <div className="mt-2 grid grid-cols-4 gap-1">
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 rounded-[2px] ${[2, 5, 9].includes(i) ? "bg-accent" : "bg-navy-divider"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <h3 className="dt-heading mt-4 text-[17px] leading-snug">{LEARNING_DOWNLOAD.title}</h3>
      <p className="mt-1.5 text-[13px] leading-snug text-navy-muted">{LEARNING_DOWNLOAD.desc}</p>
      <span className="dt-button mt-4 inline-flex h-10 items-center gap-2.5 self-start rounded-full bg-canvas px-5 text-[13.5px] text-white transition-colors group-hover:bg-canvas/90">
        {LEARNING_DOWNLOAD.cta}
        <ArrowIcon className="h-3.5 w-3.5 rotate-90 text-white" />
      </span>
    </a>
  );
}

export function LearningPanel({ onNavigate, onEstimate }: Handlers) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_0.9fr_1.15fr_1.05fr] lg:gap-6">
      {LEARNING_GROUPS.map((g, i) => (
        <MenuGroupList
          key={g.label}
          label={g.label}
          items={g.items}
          index={i}
          onNavigate={onNavigate}
          onEstimate={onEstimate}
        />
      ))}
      <DownloadCard index={3} onNavigate={onNavigate} />
    </div>
  );
}
