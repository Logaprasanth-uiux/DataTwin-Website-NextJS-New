import type { CSSProperties, ReactNode } from "react";
import { InViewPlay } from "./InViewPlay";

// Small line illustrations: navy structure, orange for the recovered money and confirmations.
// Motion lives in globals.css (.rv-*), keyed off the wrapper's data-anim; these SVGs are
// written in their final state so they read correctly with no animation at all.
// `at` places an element within its icon's loop; each icon's variant class (rv-bank, rv-refund, ...) in
// globals.css sets that icon's loop period and its start offset.

const at = (delay: number) => ({ "--rv-delay": `${delay}ms` }) as CSSProperties;

function Frame({ children, variant }: { children: ReactNode; variant: string }) {
  return (
    <InViewPlay className={`inline-flex h-10 w-16 flex-shrink-0 text-navy ${variant}`}>
      <svg
        viewBox="0 0 72 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {children}
      </svg>
    </InViewPlay>
  );
}

// Money recovered -> returned to the bank -> confirmed
export function MoneyToBankVisual() {
  return (
    <Frame variant="rv-bank">
      <path d="M14 16L36 6L58 16Z" />
      <path d="M20 20V32M28 20V32M44 20V32M52 20V32M12 36H60" />
      <g className="text-accent">
        <circle className="rv-coin-bank" cx="36" cy="26" r="3.4" fill="white" stroke="currentColor" />
        <path className="rv-draw" pathLength={1} style={at(900)} d="M56 9L59.5 12.5L65 5.5" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// Credit identified -> returned -> confirmed
export function CreditRefundVisual() {
  return (
    <Frame variant="rv-refund">
      <rect x="6" y="6" width="22" height="30" rx="2" />
      <path d="M11 14H23M11 20H23M11 26H18" strokeOpacity="0.5" />
      <circle cx="58" cy="28" r="6" />
      <g className="text-accent">
        <path className="rv-draw-long" pathLength={1} style={at(0)} d="M28 12C38 -2 54 4 58 20" stroke="currentColor" />
        <path className="rv-fade" style={at(600)} d="M59.7 14.2L58 20L53.8 15.7" stroke="currentColor" />
        <circle className="rv-coin-credit" cx="28" cy="12" r="3" fill="white" stroke="currentColor" />
        <path className="rv-draw" pathLength={1} style={at(850)} d="M55 28.3L57.2 30.5L61.2 25.8" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// Records checked -> exceptions resolved -> audit-ready
export function AuditReadyVisual() {
  return (
    <Frame variant="rv-audit">
      <rect x="20" y="4" width="32" height="36" rx="2" />
      <path d="M35 13H46M35 23H46M26 33H40" strokeOpacity="0.5" />
      <path className="rv-draw" pathLength={1} style={at(100)} d="M25.5 13.4L28 15.9L31.5 10.6" />
      <path className="rv-draw" pathLength={1} style={at(450)} d="M25.5 23.4L28 25.9L31.5 20.6" />
      <g className="text-accent">
        <g className="rv-fade" style={at(850)}>
          <circle cx="52" cy="35" r="7" fill="white" stroke="currentColor" />
        </g>
        <path className="rv-draw" pathLength={1} style={at(1050)} d="M48.6 35.2L50.8 37.4L55.4 32" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// Recurring failure -> control identified -> cycle interrupted.
// The loop itself stays put; only the break (gap arc + problem point -> orange check) cycles.
export function RepeatLoopVisual() {
  return (
    <Frame variant="rv-loop">
      <path d="M50.5 18.1A15 15 0 1 1 44.6 9.7" />
      <path d="M42.5 5.2L44.6 9.7L39.6 9.3" />
      <g className="rv-hide" style={at(1000)}>
        <path d="M44.6 9.7A15 15 0 0 1 50.5 18.1" />
      </g>
      <g className="rv-blip" style={at(600)}>
        <circle cx="48.3" cy="13.4" r="2" fill="currentColor" />
        <circle cx="48.3" cy="13.4" r="4.6" strokeOpacity="0.5" />
      </g>
      <path
        className="rv-draw text-accent"
        pathLength={1}
        style={at(1150)}
        d="M45.3 13.6L47.6 15.9L51.6 10.9"
        stroke="currentColor"
      />
    </Frame>
  );
}
