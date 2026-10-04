"use client";

import { useEffect, useRef, useState } from "react";
import { STEP_KINDS } from "@/lib/playground/chatflow-types";
import type { ChatFlow, FlowStep, Problem, StepKind, Zone } from "@/lib/playground/chatflow-types";

export interface PlayView {
  /** Step ids on the path being played; null when no walkthrough has started. */
  path: Set<string> | null;
  activeId: string | null;
  doneIds: Set<string>;
}

export interface CanvasHandlers {
  onSelectStep: (id: string) => void;
  onFocusProblem: (id: string) => void;
  onInsertStep: (zone: Zone, index: number, kind: StepKind) => void;
  onInsertProblem: (index: number) => void;
  onProblemChange: (id: string, patch: Partial<Problem>) => void;
  onProblemMove: (id: string, dir: -1 | 1) => void;
  onProblemDuplicate: (id: string) => void;
  onProblemRemove: (id: string) => void;
}

interface CanvasProps extends CanvasHandlers {
  flow: ChatFlow;
  editing: boolean;
  selectedId: string | null;
  focusProblemId: string | null;
  play: PlayView;
}

const KIND_LABEL: Record<StepKind, string> = Object.fromEntries(STEP_KINDS.map((k) => [k.kind, k.label])) as Record<
  StepKind,
  string
>;

const SOURCE_LABEL = { upload: "Upload", portal: "GST Portal", both: "Upload or GST Portal" } as const;

function stateOf(id: string, play: PlayView): "idle" | "active" | "done" | "dim" {
  if (!play.path) return "idle";
  if (id === play.activeId) return "active";
  if (play.doneIds.has(id)) return "done";
  return play.path.has(id) ? "idle" : "dim";
}

function StepNode({
  step,
  state,
  selected,
  editing,
  onSelect,
}: {
  step: FlowStep;
  state: "idle" | "active" | "done" | "dim";
  selected: boolean;
  editing: boolean;
  onSelect: () => void;
}) {
  const files = step.files ?? [];
  return (
    <button
      type="button"
      data-step-id={step.id}
      data-kind={step.kind}
      data-state={state}
      data-selected={selected || undefined}
      data-editing={editing || undefined}
      onClick={onSelect}
      className="cf-node"
    >
      <span className="cf-node-top">
        <span className="cf-kind">{KIND_LABEL[step.kind]}</span>
        {step.skippable && <span className="cf-flag">Skippable</span>}
        {state === "done" && <span className="cf-tick" aria-label="Done">✓</span>}
      </span>
      <span className="cf-title">{step.title}</span>
      {step.detail ? <span className="cf-detail">{step.detail}</span> : null}

      {step.chips && step.chips.length > 0 && (
        <span className="cf-chips">
          {step.chips.map((chip, i) => (
            <span key={`${chip}-${i}`} className="cf-chip">
              {chip}
            </span>
          ))}
        </span>
      )}

      {step.kind === "files" && (
        <span className="cf-files">
          {files.length === 0 ? (
            <span className="cf-empty">No files defined yet</span>
          ) : (
            <>
              <span className="cf-loop" aria-hidden="true">
                <span>Request</span>
                <i>›</i>
                <span>Upload</span>
                <i>›</i>
                <span>Verify</span>
                <em>✗ re-upload · ✓ next file</em>
              </span>
              {files.map((file) => (
                <span key={file.id} className="cf-file" data-level={file.level}>
                  <span className="cf-file-name">{file.name}</span>
                  <span className="cf-file-meta">
                    {file.level === "required" ? "Required" : "Optional"} · {SOURCE_LABEL[file.source]}
                  </span>
                </span>
              ))}
            </>
          )}
        </span>
      )}
    </button>
  );
}

function AddMenu({ label, onPick }: { label: string; onPick: (kind: StepKind) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <span className="cf-add" ref={ref} data-open={open || undefined}>
      <button type="button" className="cf-plus" aria-label={label} title={label} onClick={() => setOpen((o) => !o)}>
        +
      </button>
      {open && (
        <span className="cf-menu" role="menu">
          {STEP_KINDS.map((k) => (
            <button
              key={k.kind}
              type="button"
              role="menuitem"
              data-kind={k.kind}
              onClick={() => {
                setOpen(false);
                onPick(k.kind);
              }}
            >
              <b>{k.label}</b>
              <small>{k.hint}</small>
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

function Link({
  editing,
  lit,
  zone,
  index,
  onInsert,
}: {
  editing: boolean;
  lit: boolean;
  zone: Zone;
  index: number;
  onInsert: CanvasHandlers["onInsertStep"];
}) {
  return (
    <span className="cf-link" data-lit={lit || undefined} data-editing={editing || undefined}>
      {editing && <AddMenu label="Add a step here" onPick={(kind) => onInsert(zone, index, kind)} />}
    </span>
  );
}

function Chain({
  steps,
  zone,
  editing,
  selectedId,
  play,
  handlers,
}: {
  steps: FlowStep[];
  zone: Zone;
  editing: boolean;
  selectedId: string | null;
  play: PlayView;
  handlers: CanvasHandlers;
}) {
  return (
    <div className="cf-chain">
      {steps.map((step, i) => (
        <div key={step.id} className="cf-chain-item">
          {i > 0 && (
            <Link
              editing={editing}
              lit={play.doneIds.has(steps[i - 1].id)}
              zone={zone}
              index={i}
              onInsert={handlers.onInsertStep}
            />
          )}
          <StepNode
            step={step}
            state={stateOf(step.id, play)}
            selected={selectedId === step.id}
            editing={editing}
            onSelect={() => handlers.onSelectStep(step.id)}
          />
        </div>
      ))}
      {editing && (
        <div className="cf-chain-item">
          <Link editing lit={false} zone={zone} index={steps.length} onInsert={handlers.onInsertStep} />
        </div>
      )}
    </div>
  );
}

function ProblemHeader({
  problem,
  index,
  total,
  editing,
  focused,
  handlers,
}: {
  problem: Problem;
  index: number;
  total: number;
  editing: boolean;
  focused: boolean;
  handlers: CanvasHandlers;
}) {
  return (
    <div
      className="cf-problem"
      data-placeholder={problem.placeholder || undefined}
      data-focused={focused || undefined}
      onClick={() => handlers.onFocusProblem(problem.id)}
    >
      {problem.area && !editing ? <span className="cf-problem-area">{problem.area}</span> : null}
      <span className="cf-problem-no">Problem statement {String(index + 1).padStart(2, "0")}</span>
      {editing ? (
        <>
          <input
            className="cf-input cf-problem-area-input"
            value={problem.area ?? ""}
            placeholder="Area (e.g. Sales)"
            aria-label="Area"
            onChange={(e) => handlers.onProblemChange(problem.id, { area: e.target.value })}
            onClick={(e) => e.stopPropagation()}
          />
          <input
            className="cf-input cf-problem-name"
            value={problem.name}
            aria-label="Problem statement name"
            onChange={(e) => handlers.onProblemChange(problem.id, { name: e.target.value })}
            onClick={(e) => e.stopPropagation()}
          />
          <textarea
            className="cf-input cf-problem-sum"
            rows={2}
            value={problem.summary ?? ""}
            placeholder="One-line summary"
            aria-label="Problem statement summary"
            onChange={(e) => handlers.onProblemChange(problem.id, { summary: e.target.value })}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="cf-problem-tools" onClick={(e) => e.stopPropagation()}>
            <label className="cf-check">
              <input
                type="checkbox"
                checked={!!problem.placeholder}
                onChange={(e) => handlers.onProblemChange(problem.id, { placeholder: e.target.checked })}
              />
              Placeholder
            </label>
            <button type="button" disabled={index === 0} onClick={() => handlers.onProblemMove(problem.id, -1)} title="Move left">
              ←
            </button>
            <button
              type="button"
              disabled={index === total - 1}
              onClick={() => handlers.onProblemMove(problem.id, 1)}
              title="Move right"
            >
              →
            </button>
            <button type="button" onClick={() => handlers.onProblemDuplicate(problem.id)} title="Duplicate">
              ⧉
            </button>
            <button
              type="button"
              className="cf-danger"
              onClick={() => {
                if (window.confirm(`Delete "${problem.name}" and all of its steps?`)) handlers.onProblemRemove(problem.id);
              }}
              title="Delete problem statement"
            >
              ✕
            </button>
          </span>
        </>
      ) : (
        <>
          <span className="cf-problem-title">{problem.name}</span>
          {problem.summary ? <span className="cf-problem-sum-text">{problem.summary}</span> : null}
        </>
      )}
    </div>
  );
}

export function FlowCanvas({ flow, editing, selectedId, focusProblemId, play, ...handlers }: CanvasProps) {
  const total = flow.problems.length;
  const lastHeadId = flow.head[flow.head.length - 1]?.id;
  const branchLit = !!lastHeadId && play.doneIds.has(lastHeadId);

  // Problem statements are grouped into categories by their area, in order. Each category is a
  // step between the shared opening and its problem statements; a flow without areas is one group.
  const groups: { name: string; items: { problem: Problem; index: number }[] }[] = [];
  flow.problems.forEach((problem, index) => {
    const name = problem.area ?? "";
    const last = groups[groups.length - 1];
    if (last && last.name === name) last.items.push({ problem, index });
    else groups.push({ name, items: [{ problem, index }] });
  });

  const renderColumn = (problem: Problem, index: number, pos: string) => {
    const onPath = !!play.path && problem.steps.some((s) => play.path?.has(s.id));
    const lastStepId = problem.steps[problem.steps.length - 1]?.id;
    const zone: Zone = { zone: "problem", problemId: problem.id };
    return (
      <div
        key={problem.id}
        className="cf-col"
        data-pos={pos}
        data-dim={(!!play.path && !onPath) || undefined}
        data-lit={(onPath && branchLit) || undefined}
        data-fill-lit={(!!lastStepId && play.doneIds.has(lastStepId)) || undefined}
      >
        {editing && (
          <span className="cf-col-add">
            <button
              type="button"
              className="cf-plus"
              title="Add a problem statement here"
              aria-label="Add a problem statement here"
              onClick={() => handlers.onInsertProblem(index)}
            >
              +
            </button>
          </span>
        )}
        <ProblemHeader
          problem={problem}
          index={index}
          total={total}
          editing={editing}
          focused={focusProblemId === problem.id}
          handlers={handlers}
        />
        <span className="cf-link" data-lit={(onPath && branchLit) || undefined} />
        <Chain steps={problem.steps} zone={zone} editing={editing} selectedId={selectedId} play={play} handlers={handlers} />
        <span className="cf-fill" />
        <span className="cf-foot" />
      </div>
    );
  };

  return (
    <div className="cf-flow">
      <Chain steps={flow.head} zone={{ zone: "head" }} editing={editing} selectedId={selectedId} play={play} handlers={handlers} />

      <span className="cf-link cf-link-long" data-lit={branchLit || undefined} />

      <div className="cf-cats">
        {groups.map((group, groupIndex) => {
          const groupPos = groups.length === 1 ? "only" : groupIndex === 0 ? "first" : groupIndex === groups.length - 1 ? "last" : "mid";
          const groupOnPath = group.items.some(({ problem }) => !!play.path && problem.steps.some((s) => play.path?.has(s.id)));
          const category = flow.categories?.find((c) => c.name === group.name);
          return (
            <div
              key={`${group.name}-${groupIndex}`}
              className="cf-col cf-cat"
              data-pos={groupPos}
              data-dim={(!!play.path && !groupOnPath) || undefined}
              data-lit={(groupOnPath && branchLit) || undefined}
              data-fill-lit={group.items.some(({ problem }) => {
                const last = problem.steps[problem.steps.length - 1]?.id;
                return !!last && play.doneIds.has(last);
              }) || undefined}
            >
              <div className="cf-cat-card">
                <span className="cf-cat-no">Category {String(groupIndex + 1).padStart(2, "0")}</span>
                <span className="cf-cat-title">{group.name || "Other problem statements"}</span>
                {category?.summary ? <span className="cf-cat-sum">{category.summary}</span> : null}
                <span className="cf-cat-count">
                  {group.items.length} problem statement{group.items.length === 1 ? "" : "s"}
                </span>
              </div>
              <span className="cf-link" data-lit={(groupOnPath && branchLit) || undefined} />
              <div className="cf-cols">
                {group.items.map(({ problem, index }, i) => {
                  const pos =
                    group.items.length === 1 ? "only" : i === 0 ? "first" : i === group.items.length - 1 ? "last" : "mid";
                  return renderColumn(problem, index, pos);
                })}
              </div>
              <span className="cf-fill" />
              <span className="cf-foot" />
            </div>
          );
        })}
        {editing && (
          <div className="cf-col cf-col-ghost">
            <button type="button" className="cf-ghost" onClick={() => handlers.onInsertProblem(total)}>
              <span>+</span>
              Add problem statement
            </button>
          </div>
        )}
      </div>

      <span className="cf-link cf-link-long" data-lit={undefined} />

      <Chain steps={flow.tail} zone={{ zone: "tail" }} editing={editing} selectedId={selectedId} play={play} handlers={handlers} />
    </div>
  );
}
