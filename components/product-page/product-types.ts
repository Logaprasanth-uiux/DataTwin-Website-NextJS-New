// The shape of a product page's content. Every page under /products is one of these: its sections read from
// the data, and the background of each section is assigned by the composer so no two neighbours match.

import type { Metadata } from "next";
import type { AiIconName } from "@/components/ai-page/AiArt";
import type { DpIconName } from "@/components/darp-page/DarpArt";

// Pictures for a lane. The first five are the AP gate pictures; the rest are the product pages' own.
export type MotifKey =
  | "converge" | "match" | "checklist" | "paths" | "compare"
  | "split" | "timeline" | "bars" | "ranking" | "register" | "flow" | "ledger" | "hub" | "calc" | "tiers" | "doc" | "calendar";

export type GlyphName = "mail" | "folder" | "upload" | "bank" | "card" | "doc" | "coin" | "chart" | "calendar" | "receipt";

export type HeroOut = "entry" | "register" | "chart";

export type Block = { icon?: AiIconName; tag: string; title?: string; body: string; points?: readonly string[] };

export type Lane = {
  id: string;
  n: string;
  /** Replaces the default "Part n" tag above the title. */
  eyebrow?: string;
  label: string;
  title: string;
  lead: string;
  motif: MotifKey;
  blocks: readonly Block[];
  compact?: boolean;
  callout?: { tag: string; title?: string; body: string };
  link?: { label: string; href: string };
};

export type Tile = { title: string; sub: string };

export type ProductPageData = {
  metadata: Metadata;
  hero: {
    eyebrow: string;
    lead: readonly [string, string];
    body: string;
    proof: readonly string[];
    primary: string;
    secondary: { label: string; href: string };
    glyphs: readonly [GlyphName, GlyphName, GlyphName];
    out: HeroOut;
  };
  /** The "everything that proves it" picture: inputs, the engine, what comes back. */
  hub?: {
    eyebrow: string;
    title: string;
    card: { title: string; live: string };
    inputsLabel: string;
    inputs: readonly Tile[];
    engine: Tile;
    outputsLabel: string;
    outputs: readonly Tile[];
    resultLabel?: string;
    result?: string;
    footer: string;
  };
  dar?: {
    eyebrow: string;
    title: string;
    body: string;
    items: readonly { letter: string; title: string; body: string }[];
    link?: { label: string; href: string };
  };
  /** Two sides of one problem, and the clock over both. */
  duo?: {
    eyebrow: string;
    title: string;
    body: string;
    left: { arrow: "left" | "right"; tag?: string; title: string; body: string };
    right: { arrow: "left" | "right"; tag?: string; title: string; body: string };
    banner: { title: string; body: string };
  };
  /** A grid of short cards (and an outcome card), e.g. "the same seven questions". */
  cards?: {
    eyebrow: string;
    title: string;
    body: string;
    items: readonly { tag: string; title: string; body: string }[];
    outcome?: { tag: string; title: string; body: string };
    /** Show each title as a large figure (a row of headline numbers). */
    stat?: boolean;
    link?: { label: string; href: string };
    linkPrompt?: string;
  };
  /** A table of examples: first column is the row's name. */
  matrix?: {
    eyebrow: string;
    title: string;
    body: string;
    columns: readonly string[];
    rows: readonly (readonly string[])[];
    note?: { title: string; body: string };
    /** Show the table above the lanes instead of below them. */
    before?: "lanes";
  };
  lanes: {
    eyebrow: string;
    title: string;
    body?: string;
    laneWord?: string;
    items: readonly Lane[];
  };
  prevent?: {
    eyebrow: string;
    title: string;
    body: string;
    steps: readonly { n: string; title: string; body: string }[];
    link?: { label: string; href: string };
  };
  hood?: {
    eyebrow: string;
    title: string;
    body: string;
    items: readonly { icon: AiIconName; title: string; tag: string; body: string }[];
    links: readonly { label: string; href: string }[];
  };
  changes?: {
    eyebrow: string;
    title: string;
    body: string;
    columns: { point: string; today: string; datatwin: string };
    rows: readonly { point: string; today: string; datatwin: string }[];
    note?: { title: string; body: string };
  };
  start: {
    eyebrow: string;
    title: string;
    body: string;
    stat: { value: string; unit: string; text: string };
    how: string;
    flow: readonly string[];
    items: readonly { kind: DpIconName; title: string; body: string }[];
    note?: string;
    cta: string;
    link: { label: string; href: string };
  };
};
