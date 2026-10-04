// Data model for the internal Chat Flow playground. The whole flow is one JSON document
// (lib/playground/chatflow.json) so a change is a normal, reviewable git diff.

export type StepKind = "user" | "ai" | "choice" | "files" | "system" | "gate" | "output";

export type FileLevel = "required" | "optional";
export type FileSource = "upload" | "portal" | "both";

export interface FlowFile {
  id: string;
  name: string;
  level: FileLevel;
  /** Upload only, GST Portal fetch only, or either. */
  source: FileSource;
  /** One-line business benefit shown to the user ("Why this helps"). */
  why?: string;
}

export interface FlowStep {
  id: string;
  kind: StepKind;
  title: string;
  detail?: string;
  /** Short options / examples shown as chips (period choices, problem statements, ...). */
  chips?: string[];
  /** Only used by kind "files": the documents requested in this round, in order. */
  files?: FlowFile[];
  /** The user may skip this step (e.g. an optional accuracy round). */
  skippable?: boolean;
}

export interface Problem {
  id: string;
  name: string;
  /** The side of GST this belongs to (Sales, Purchase & ITC, ...) - shown as a small label above the name. */
  area?: string;
  summary?: string;
  /** Not defined yet — rendered as a muted placeholder column. */
  placeholder?: boolean;
  steps: FlowStep[];
}

/** A group of problem statements on one side of GST (Sales, Purchase & ITC, ...). Problem
 * statements join a category through their `area`, which matches the category's `name`. */
export interface Category {
  name: string;
  summary?: string;
}

export interface ChatFlow {
  version: 1;
  /** Shared steps before the problem statement is known. */
  head: FlowStep[];
  /** Optional: the categories problem statements are grouped into, between the shared steps and the problem statements. */
  categories?: Category[];
  problems: Problem[];
  /** Shared steps every problem statement ends with. */
  tail: FlowStep[];
}

export type Zone = { zone: "head" } | { zone: "tail" } | { zone: "problem"; problemId: string };

export const STEP_KINDS: { kind: StepKind; label: string; hint: string }[] = [
  { kind: "user", label: "User", hint: "Something the user says or does" },
  { kind: "ai", label: "AI", hint: "A message or decision by DataTwin" },
  { kind: "choice", label: "Choice", hint: "Options the user picks from" },
  { kind: "files", label: "Files", hint: "Documents requested one by one" },
  { kind: "system", label: "System", hint: "Processing behind the scenes" },
  { kind: "gate", label: "Gate", hint: "A form or check before the next step" },
  { kind: "output", label: "Output", hint: "A result shown to the user" },
];
