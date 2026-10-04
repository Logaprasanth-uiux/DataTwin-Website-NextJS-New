"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import seed from "@/lib/playground/chatflow.json";
import type { ChatFlow } from "@/lib/playground/chatflow-types";
import {
  duplicateProblem,
  duplicateStep,
  findStep,
  insertProblem,
  insertStep,
  isChatFlow,
  locate,
  moveProblem,
  moveStep,
  newProblem,
  newStep,
  pathFor,
  removeProblem,
  removeStep,
  updateProblem,
  updateStep,
} from "@/lib/playground/flow-utils";
import {
  getDraftServerSnapshot,
  getDraftSnapshot,
  setDraft,
  subscribeDraft,
} from "@/lib/playground/draft-store";
import { FlowCanvas, type CanvasHandlers } from "./FlowCanvas";
import { Inspector } from "./Inspector";
import "./chatflow.css";

const COMMITTED = seed as ChatFlow;
const COMMITTED_JSON = JSON.stringify(COMMITTED);
const STEP_MS = 1800;

function parseDraft(raw: string | null): ChatFlow | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return isChatFlow(value) ? value : null;
  } catch {
    return null;
  }
}

export function ChatFlowEditor() {
  const draftRaw = useSyncExternalStore(
    subscribeDraft,
    getDraftSnapshot,
    getDraftServerSnapshot,
  );
  const flow = useMemo(() => parseDraft(draftRaw) ?? COMMITTED, [draftRaw]);
  const dirty = JSON.stringify(flow) !== COMMITTED_JSON;

  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusProblemId, setFocusProblemId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Walkthrough player.
  const [playIdx, setPlayIdx] = useState(-1); // -1 = not started
  const [playing, setPlaying] = useState(false);
  const [fast, setFast] = useState(false);
  const [zoom, setZoom] = useState(0.85);

  const past = useRef<string[]>([]);
  const [undoCount, setUndoCount] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((t) => (t === message ? null : t)), 4200);
  }, []);

  // Every edit goes through here so it can be undone and is mirrored to the local draft.
  const commit = useCallback(
    (next: ChatFlow) => {
      past.current = [...past.current.slice(-49), JSON.stringify(flow)];
      setUndoCount(past.current.length);
      setDraft(JSON.stringify(next));
    },
    [flow],
  );

  const undo = () => {
    const prev = past.current.pop();
    setUndoCount(past.current.length);
    if (prev) setDraft(prev);
  };

  // ---------- walkthrough ----------
  const playProblemId = focusProblemId ?? flow.problems[0]?.id ?? null;
  const path = useMemo(
    () => pathFor(flow, playProblemId),
    [flow, playProblemId],
  );
  const started = playIdx >= 0;
  const activeId = started
    ? (path[Math.min(playIdx, path.length - 1)]?.id ?? null)
    : null;
  const finished = started && playIdx >= path.length - 1;

  const play = useMemo(
    () => ({
      path: started ? new Set(path.map((s) => s.id)) : null,
      activeId,
      doneIds: new Set(started ? path.slice(0, playIdx).map((s) => s.id) : []),
    }),
    [started, path, activeId, playIdx],
  );

  useEffect(() => {
    if (!playing) return;
    if (finished) return;
    const id = window.setTimeout(
      () => setPlayIdx((i) => i + 1),
      fast ? STEP_MS / 2 : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [playing, finished, playIdx, fast]);

  // The shared first steps sit in the middle of the board above every problem statement, which
  // with many of them is far to the right — open centred on them instead of on empty space.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    board.scrollLeft = Math.max(0, (board.scrollWidth - board.clientWidth) / 2);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    boardRef.current
      ?.querySelector(`[data-step-id="${activeId}"]`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
  }, [activeId]);

  const startPlay = () => {
    setEditing(false);
    setSelectedId(null);
    setPlayIdx(finished || !started ? 0 : playIdx);
    setPlaying(true);
  };
  const stopPlay = () => {
    setPlaying(false);
    setPlayIdx(-1);
  };

  // ---------- editing ----------
  const handlers: CanvasHandlers = {
    onSelectStep: (id) => {
      if (editing) setSelectedId(id);
      else {
        // In view mode a click jumps the walkthrough to that step (if it is on the current path).
        const at = path.findIndex((s) => s.id === id);
        if (at >= 0) {
          setPlayIdx(at);
          setPlaying(false);
        }
      }
    },
    onFocusProblem: (id) => {
      setFocusProblemId(id);
      if (started) setPlayIdx(-1);
    },
    onInsertStep: (zone, index, kind) => {
      const step = newStep(kind);
      commit(insertStep(flow, zone, index, step));
      setSelectedId(step.id);
    },
    onInsertProblem: (index) => {
      const problem = newProblem();
      commit(insertProblem(flow, index, problem));
      setFocusProblemId(problem.id);
    },
    onProblemChange: (id, patch) => commit(updateProblem(flow, id, patch)),
    onProblemMove: (id, dir) => commit(moveProblem(flow, id, dir)),
    onProblemDuplicate: (id) => commit(duplicateProblem(flow, id)),
    onProblemRemove: (id) => {
      commit(removeProblem(flow, id));
      if (focusProblemId === id) setFocusProblemId(null);
    },
  };

  const selected = editing ? findStep(flow, selectedId) : null;
  const where = selected ? locate(flow, selected.id) : null;
  const siblingCount = where
    ? where.loc.zone === "head"
      ? flow.head.length
      : where.loc.zone === "tail"
        ? flow.tail.length
        : (flow.problems.find(
            (p) => p.id === (where.loc as { problemId: string }).problemId,
          )?.steps.length ?? 0)
    : 0;

  const toggleEditing = () => {
    stopPlay();
    setEditing((e) => !e);
    setSelectedId(null);
  };

  // ---------- save / export / import ----------
  const download = () => {
    const blob = new Blob([`${JSON.stringify(flow, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chatflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/playground/chatflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flow),
      });
      if (res.ok) {
        showToast(
          "Saved to lib/playground/chatflow.json. Commit and push to share it with the team.",
        );
      } else {
        download();
        showToast(
          "Can't write the repo file here, so the JSON was downloaded. Replace lib/playground/chatflow.json with it.",
        );
      }
    } catch {
      download();
      showToast(
        "Couldn't reach the dev server, so the JSON was downloaded instead.",
      );
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (
      !window.confirm(
        "Discard your local changes and go back to the version in the repo?",
      )
    )
      return;
    past.current = [];
    setUndoCount(0);
    setDraft(null);
    setSelectedId(null);
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const value: unknown = JSON.parse(await file.text());
      if (!isChatFlow(value)) throw new Error("shape");
      commit(value);
      showToast("Imported. Review it, then Save.");
    } catch {
      showToast("That file isn't a valid chat flow JSON.");
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  const activeStep = started
    ? (path[Math.min(playIdx, path.length - 1)] ?? null)
    : null;
  const playProblem = flow.problems.find((p) => p.id === playProblemId);

  return (
    <div className="cf-root" data-editing={editing || undefined}>
      <div className="cf-toolbar">
        <div className="cf-toolbar-left">
          <Link href="/playground" className="cf-back">
            ← Playground
          </Link>
          <h1>Chat flow</h1>
          <span className="cf-status" data-dirty={dirty || undefined}>
            {dirty
              ? "Local changes not in the repo yet"
              : "In sync with the repo"}
          </span>
        </div>

        <div className="cf-toolbar-right">
          <span className="cf-zoom">
            <button
              type="button"
              className="cf-btn"
              aria-label="Zoom out"
              onClick={() =>
                setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))
              }
            >
              −
            </button>
            <button
              type="button"
              className="cf-btn"
              aria-label="Reset zoom"
              onClick={() => setZoom(0.85)}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="cf-btn"
              aria-label="Zoom in"
              onClick={() =>
                setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))
              }
            >
              +
            </button>
          </span>
          {editing ? (
            <>
              <button
                type="button"
                className="cf-btn"
                onClick={undo}
                disabled={undoCount === 0}
              >
                Undo
              </button>
              <button
                type="button"
                className="cf-btn"
                onClick={() => fileInput.current?.click()}
              >
                Import
              </button>
              <button type="button" className="cf-btn" onClick={download}>
                Export
              </button>
              {dirty && (
                <button type="button" className="cf-btn" onClick={discard}>
                  Discard changes
                </button>
              )}
              <button
                type="button"
                className="cf-btn cf-btn-primary"
                onClick={save}
                disabled={saving || !dirty}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" className="cf-btn" onClick={toggleEditing}>
                Done
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="cf-btn cf-btn-primary"
                onClick={startPlay}
              >
                {started && !finished ? "Resume" : "▶ Play walkthrough"}
              </button>
              <button type="button" className="cf-btn" onClick={toggleEditing}>
                Edit flow
              </button>
            </>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => void onImport(e.target.files?.[0])}
          />
        </div>
      </div>

      <div className="cf-legend" aria-hidden="true">
        {(
          ["user", "ai", "choice", "files", "system", "gate", "output"] as const
        ).map((k) => (
          <span key={k} data-kind={k}>
            <i />
            {k === "ai" ? "AI" : k[0].toUpperCase() + k.slice(1)}
          </span>
        ))}
        <span className="cf-legend-hint">
          {editing
            ? "Click a step to edit it. Use + on a line to add a step, or + on the top rail to add a problem statement."
            : "Click a problem statement, then Play. Click any step to jump to it."}
        </span>
      </div>

      <div className="cf-board dt-thin-scroll" ref={boardRef}>
        <div style={{ zoom }}>
          <FlowCanvas
            flow={flow}
            editing={editing}
            selectedId={selectedId}
            focusProblemId={focusProblemId}
            play={play}
            {...handlers}
          />
        </div>
      </div>

      {selected && (
        <Inspector
          key={selected.id}
          step={selected}
          canMoveUp={!!where && where.index > 0}
          canMoveDown={!!where && where.index < siblingCount - 1}
          onChange={(patch) => commit(updateStep(flow, selected.id, patch))}
          onMove={(dir) => commit(moveStep(flow, selected.id, dir))}
          onDuplicate={() => commit(duplicateStep(flow, selected.id))}
          onDelete={() => {
            commit(removeStep(flow, selected.id));
            setSelectedId(null);
          }}
          onClose={() => setSelectedId(null)}
        />
      )}

      {started && activeStep && (
        <div className="cf-player" role="region" aria-label="Walkthrough">
          <div className="cf-player-text" data-kind={activeStep.kind}>
            <span className="cf-player-meta">
              Step {Math.min(playIdx + 1, path.length)} of {path.length}
              {playProblem ? ` · ${playProblem.name}` : ""}
            </span>
            <b>{activeStep.title}</b>
            {activeStep.detail ? <span>{activeStep.detail}</span> : null}
          </div>
          <div className="cf-player-controls">
            <button
              type="button"
              className="cf-btn"
              onClick={() => setPlayIdx((i) => Math.max(0, i - 1))}
              disabled={playIdx <= 0}
            >
              ‹ Back
            </button>
            <button
              type="button"
              className="cf-btn cf-btn-primary"
              onClick={() => (finished ? startPlay() : setPlaying((p) => !p))}
            >
              {finished ? "Replay" : playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              className="cf-btn"
              onClick={() =>
                setPlayIdx((i) => Math.min(path.length - 1, i + 1))
              }
              disabled={finished}
            >
              Next ›
            </button>
            <button
              type="button"
              className="cf-btn"
              data-on={fast || undefined}
              onClick={() => setFast((f) => !f)}
            >
              2×
            </button>
            <button type="button" className="cf-btn" onClick={stopPlay}>
              Exit
            </button>
          </div>
          <span
            className="cf-progress"
            style={{ width: `${((playIdx + 1) / path.length) * 100}%` }}
          />
        </div>
      )}

      {toast && (
        <div className="cf-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
