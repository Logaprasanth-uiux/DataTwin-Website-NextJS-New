"use client";

import { STEP_KINDS } from "@/lib/playground/chatflow-types";
import type { FileLevel, FileSource, FlowFile, FlowStep, StepKind } from "@/lib/playground/chatflow-types";
import { newFile } from "@/lib/playground/flow-utils";

interface InspectorProps {
  step: FlowStep;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (patch: Partial<FlowStep>) => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function Inspector({ step, canMoveUp, canMoveDown, onChange, onMove, onDuplicate, onDelete, onClose }: InspectorProps) {
  const chips = step.chips ?? [];
  const files = step.files ?? [];

  const setFile = (id: string, patch: Partial<FlowFile>) =>
    onChange({ files: files.map((f) => (f.id === id ? { ...f, ...patch } : f)) });

  return (
    <aside className="cf-inspector" aria-label="Edit step">
      <header>
        <b>Edit step</b>
        <button type="button" onClick={onClose} aria-label="Close editor">
          ✕
        </button>
      </header>

      <div className="cf-inspector-body">
        <label className="cf-field">
          <span>Type</span>
          <select value={step.kind} onChange={(e) => onChange({ kind: e.target.value as StepKind })}>
            {STEP_KINDS.map((k) => (
              <option key={k.kind} value={k.kind}>
                {k.label} — {k.hint}
              </option>
            ))}
          </select>
        </label>

        <label className="cf-field">
          <span>Title</span>
          <input value={step.title} onChange={(e) => onChange({ title: e.target.value })} />
        </label>

        <label className="cf-field">
          <span>What happens</span>
          <textarea rows={4} value={step.detail ?? ""} onChange={(e) => onChange({ detail: e.target.value })} />
        </label>

        <label className="cf-check">
          <input type="checkbox" checked={!!step.skippable} onChange={(e) => onChange({ skippable: e.target.checked })} />
          User can skip this step
        </label>

        <section className="cf-field">
          <span>Chips (options / examples)</span>
          {chips.map((chip, i) => (
            <div className="cf-row" key={i}>
              <input
                value={chip}
                aria-label={`Chip ${i + 1}`}
                onChange={(e) => onChange({ chips: chips.map((c, j) => (j === i ? e.target.value : c)) })}
              />
              <button type="button" aria-label="Remove chip" onClick={() => onChange({ chips: chips.filter((_, j) => j !== i) })}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="cf-btn cf-btn-ghost" onClick={() => onChange({ chips: [...chips, "New chip"] })}>
            + Add chip
          </button>
        </section>

        {step.kind === "files" && (
          <section className="cf-field">
            <span>Files requested, in order</span>
            {files.map((file, i) => (
              <div className="cf-file-edit" key={file.id}>
                <div className="cf-row">
                  <input value={file.name} aria-label="File name" onChange={(e) => setFile(file.id, { name: e.target.value })} />
                  <button
                    type="button"
                    aria-label="Move file up"
                    disabled={i === 0}
                    onClick={() => {
                      const next = [...files];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      onChange({ files: next });
                    }}
                  >
                    ↑
                  </button>
                  <button type="button" aria-label="Remove file" onClick={() => onChange({ files: files.filter((f) => f.id !== file.id) })}>
                    ✕
                  </button>
                </div>
                <div className="cf-row">
                  <select value={file.level} onChange={(e) => setFile(file.id, { level: e.target.value as FileLevel })}>
                    <option value="required">Required</option>
                    <option value="optional">Optional</option>
                  </select>
                  <select value={file.source} onChange={(e) => setFile(file.id, { source: e.target.value as FileSource })}>
                    <option value="upload">Upload only</option>
                    <option value="portal">GST Portal only</option>
                    <option value="both">Upload or GST Portal</option>
                  </select>
                </div>
                <input
                  value={file.why ?? ""}
                  placeholder="Why this helps (one line)"
                  aria-label="Why this helps"
                  onChange={(e) => setFile(file.id, { why: e.target.value })}
                />
              </div>
            ))}
            <button type="button" className="cf-btn cf-btn-ghost" onClick={() => onChange({ files: [...files, newFile()] })}>
              + Add file
            </button>
          </section>
        )}
      </div>

      <footer>
        <button type="button" className="cf-btn" disabled={!canMoveUp} onClick={() => onMove(-1)}>
          ↑ Move up
        </button>
        <button type="button" className="cf-btn" disabled={!canMoveDown} onClick={() => onMove(1)}>
          ↓ Move down
        </button>
        <button type="button" className="cf-btn" onClick={onDuplicate}>
          Duplicate
        </button>
        <button type="button" className="cf-btn cf-btn-danger" onClick={onDelete}>
          Delete
        </button>
      </footer>
    </aside>
  );
}
