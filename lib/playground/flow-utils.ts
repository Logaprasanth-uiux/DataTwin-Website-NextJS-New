import type { ChatFlow, FlowFile, FlowStep, Problem, StepKind, Zone } from "./chatflow-types";

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function newStep(kind: StepKind): FlowStep {
  const base: FlowStep = { id: uid("s"), kind, title: "New step", detail: "" };
  if (kind === "files") return { ...base, title: "Request files", files: [] };
  if (kind === "choice") return { ...base, title: "Ask the user to choose", chips: ["Option A", "Option B"] };
  return base;
}

export function newFile(): FlowFile {
  return { id: uid("f"), name: "New file", level: "required", source: "upload" };
}

export function newProblem(): Problem {
  return {
    id: uid("p"),
    name: "New problem statement",
    placeholder: true,
    steps: [
      { id: uid("s"), kind: "choice", title: "Period selection", chips: ["Current period", "Previous period", "Custom period"] },
      { id: uid("s"), kind: "files", title: "Request files", files: [] },
    ],
  };
}

function listOf(flow: ChatFlow, loc: Zone): FlowStep[] {
  if (loc.zone === "head") return flow.head;
  if (loc.zone === "tail") return flow.tail;
  return flow.problems.find((p) => p.id === loc.problemId)?.steps ?? [];
}

function withList(flow: ChatFlow, loc: Zone, next: FlowStep[]): ChatFlow {
  if (loc.zone === "head") return { ...flow, head: next };
  if (loc.zone === "tail") return { ...flow, tail: next };
  return { ...flow, problems: flow.problems.map((p) => (p.id === loc.problemId ? { ...p, steps: next } : p)) };
}

export function locate(flow: ChatFlow, stepId: string): { loc: Zone; index: number } | null {
  const zones: Zone[] = [
    { zone: "head" },
    ...flow.problems.map((p): Zone => ({ zone: "problem", problemId: p.id })),
    { zone: "tail" },
  ];
  for (const loc of zones) {
    const index = listOf(flow, loc).findIndex((s) => s.id === stepId);
    if (index >= 0) return { loc, index };
  }
  return null;
}

export function findStep(flow: ChatFlow, stepId: string | null): FlowStep | null {
  if (!stepId) return null;
  const hit = locate(flow, stepId);
  return hit ? listOf(flow, hit.loc)[hit.index] : null;
}

export function insertStep(flow: ChatFlow, loc: Zone, index: number, step: FlowStep): ChatFlow {
  const list = [...listOf(flow, loc)];
  list.splice(index, 0, step);
  return withList(flow, loc, list);
}

export function updateStep(flow: ChatFlow, stepId: string, patch: Partial<FlowStep>): ChatFlow {
  const hit = locate(flow, stepId);
  if (!hit) return flow;
  return withList(flow, hit.loc, listOf(flow, hit.loc).map((s) => (s.id === stepId ? { ...s, ...patch } : s)));
}

export function removeStep(flow: ChatFlow, stepId: string): ChatFlow {
  const hit = locate(flow, stepId);
  if (!hit) return flow;
  return withList(flow, hit.loc, listOf(flow, hit.loc).filter((s) => s.id !== stepId));
}

export function moveStep(flow: ChatFlow, stepId: string, dir: -1 | 1): ChatFlow {
  const hit = locate(flow, stepId);
  if (!hit) return flow;
  const list = [...listOf(flow, hit.loc)];
  const to = hit.index + dir;
  if (to < 0 || to >= list.length) return flow;
  [list[hit.index], list[to]] = [list[to], list[hit.index]];
  return withList(flow, hit.loc, list);
}

function cloneStep(src: FlowStep): FlowStep {
  return {
    ...src,
    id: uid("s"),
    chips: src.chips ? [...src.chips] : undefined,
    files: src.files?.map((f) => ({ ...f, id: uid("f") })),
  };
}

export function duplicateStep(flow: ChatFlow, stepId: string): ChatFlow {
  const hit = locate(flow, stepId);
  if (!hit) return flow;
  const src = listOf(flow, hit.loc)[hit.index];
  return insertStep(flow, hit.loc, hit.index + 1, { ...cloneStep(src), title: `${src.title} (copy)` });
}

export function insertProblem(flow: ChatFlow, index: number, problem: Problem): ChatFlow {
  const problems = [...flow.problems];
  problems.splice(index, 0, problem);
  return { ...flow, problems };
}

export function updateProblem(flow: ChatFlow, problemId: string, patch: Partial<Problem>): ChatFlow {
  return { ...flow, problems: flow.problems.map((p) => (p.id === problemId ? { ...p, ...patch } : p)) };
}

export function removeProblem(flow: ChatFlow, problemId: string): ChatFlow {
  return { ...flow, problems: flow.problems.filter((p) => p.id !== problemId) };
}

export function moveProblem(flow: ChatFlow, problemId: string, dir: -1 | 1): ChatFlow {
  const problems = [...flow.problems];
  const from = problems.findIndex((p) => p.id === problemId);
  const to = from + dir;
  if (from < 0 || to < 0 || to >= problems.length) return flow;
  [problems[from], problems[to]] = [problems[to], problems[from]];
  return { ...flow, problems };
}

export function duplicateProblem(flow: ChatFlow, problemId: string): ChatFlow {
  const index = flow.problems.findIndex((p) => p.id === problemId);
  if (index < 0) return flow;
  const src = flow.problems[index];
  const copy: Problem = { ...src, id: uid("p"), name: `${src.name} (copy)`, steps: src.steps.map(cloneStep) };
  return insertProblem(flow, index + 1, copy);
}

/** The ordered path a conversation takes for one problem statement: head, its own steps, tail. */
export function pathFor(flow: ChatFlow, problemId: string | null): FlowStep[] {
  const problem = flow.problems.find((p) => p.id === problemId) ?? flow.problems[0];
  return [...flow.head, ...(problem?.steps ?? []), ...flow.tail];
}

export function isChatFlow(value: unknown): value is ChatFlow {
  const v = value as Partial<ChatFlow> | null;
  return !!v && v.version === 1 && Array.isArray(v.head) && Array.isArray(v.problems) && Array.isArray(v.tail);
}
