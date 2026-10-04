"use client";

import "./engine-diagram.css";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  DARP_STEPS,
  ENGINE_COPY,
  MODULES,
  OUTPUTS,
  SOURCES,
  STAGES,
} from "./engine-data";
import {
  C,
  HOLD0,
  ROT,
  P,
  arcPath,
  autoT,
  bodyPath,
  codePos,
  conePath,
  cyOf,
  inHold,
  isFlipped,
  ryOf,
  spokePath,
} from "./engine-geometry";
import { PlanInfo, SectionInfo } from "./EngineInfo";

// The shared-engine diagram: one enclosed body seen from above ("plan"), tilting into a section where
// sources sit at the top and the ledger at the base. It is a port of the reference diagram's geometry and
// timing, restyled in the site's own palette (navy = DataTwin, amber = data that passed, soft grey = outside)
// and rebuilt so it works on a phone:
//
// - The explanatory text lives in HTML beside / below the picture, not inside it.
// - On narrow widths ("compact") the picture drops its small text: sources become numbered dots matching a
//   readable list, and the section view's outputs move to HTML cards.
// - It rotates by itself, on click / tap, or with the view buttons. Auto-rotation pauses while the pointer is
//   over it, can be paused outright, and is off under prefers-reduced-motion.

const NP = C.angles.length * 3; // particles
const IDLE_RESUME = 8; // seconds after a manual rotate before auto-rotation takes over again

type Els = Record<string, SVGElement>;

const num = (n: number, d = 1) => n.toFixed(d);

// Sets every attribute that depends on the tilt `th` (degrees) / progress `tt` / clock (seconds).
function draw(
  els: Els,
  th: number,
  tt: number,
  clock: number,
  compact: boolean,
  active: number,
) {
  const set = (k: string, a: Record<string, string | number>) => {
    const el = els[k];
    if (!el) return;
    for (const n in a) el.setAttribute(n, String(a[n]));
  };
  const ell = (k: string, r: number) =>
    set(k, {
      cx: C.CX,
      cy: num(cyOf(r, th), 2),
      rx: r,
      ry: num(ryOf(r, th), 2),
    });

  ell("srcRing", C.SRC);
  ell("lane1", C.L1);
  ell("lane2", C.L2);
  ell("erpDisc", C.IN);
  ell("outlet", C.IN);
  ell("rim", C.BAND);

  const po = Math.max(0, 1 - tt * 3.2); // plan-only things fade out early
  const eo = Math.max(0, (tt - 0.82) / 0.18); // section-only things fade in late

  set("body", { d: bodyPath(th), opacity: num(Math.max(0, 1 - tt * 2.2), 3) });
  set("cone", {
    d: conePath(th),
    opacity: num(Math.max(0, Math.min(1, (tt - 0.14) / 0.4)), 3),
  });

  for (let i = 0; i < C.spokes.length; i++) {
    set(`spoke${i}`, { d: spokePath(i, th) });
    const [x, y] = codePos(i, th);
    set(`code${i}`, { x: num(x), y: num(y + (compact ? 11 : 7)) });
  }
  for (const k of ["spokes", "codes", "nameplate", "erpLabel", "planOnly"])
    set(k, { opacity: num(po, 3) });
  for (const k of ["lane1", "lane2"])
    set(k, { "stroke-opacity": num(0.3 + 0.15 * tt, 3) });
  set("elevOnly", { opacity: num(eo, 3) });

  for (let k = 0; k < C.angles.length; k++) {
    const p = P(C.SRC, C.angles[k], th);
    set(`dot${k}`, { transform: `translate(${num(p[0])} ${num(p[1])})` });
  }

  // Compact view: the tapped source's name rides beside its dot.
  const tip = els.tip;
  if (tip) {
    if (compact && active >= 0) {
      const p = P(C.SRC, C.angles[active], th);
      const label = SOURCES[active];
      const text = els.tipText;
      if (text.textContent !== label) text.textContent = label;
      const w =
        (text as unknown as SVGTextContentElement).getComputedTextLength() + 34;
      const x = Math.max(
        C.CX - 300 + w / 2,
        Math.min(C.CX + 300 - w / 2, p[0]),
      );
      const y = p[1] < 300 ? p[1] + 44 : p[1] - 44;
      set("tipRect", { x: num(-w / 2), width: num(w) });
      set("tip", { transform: `translate(${num(x)} ${num(y)})`, opacity: 1 });
    } else set("tip", { opacity: 0 });
  }

  // Data travels in grey and turns amber the moment it crosses into DataTwin.
  for (let j = 0; j < NP; j++) {
    const u = (clock / 4.6 + ((j * 0.618034) % 1)) % 1;
    const r = C.SRC + (C.IN - C.SRC) * u;
    const q = P(r, C.angles[j % C.angles.length] + u * 16, th);
    const f = Math.min(1, u / 0.08) * Math.min(1, (1 - u) / 0.12);
    set(`part${j}`, {
      cx: num(q[0]),
      cy: num(q[1]),
      class: r > C.BAND ? "fill-navy-faint" : "fill-accent",
      opacity: num(0.35 + 0.55 * f, 3),
    });
  }

  // The DataTwin mark rides the rim: the wrapper's edge in plan, the funnel's top in section.
  const ph = clock * (360 / 16) - 90;
  const mp = P(C.BAND, ph, th);
  const front = (Math.sin((ph * Math.PI) / 180) + 1) / 2;
  const base = compact ? 1.25 : 1;
  set("orbit", {
    transform: `translate(${num(mp[0])},${num(mp[1])}) scale(${num(base * (1 - tt * 0.16 * (1 - front)), 3)})`,
    opacity: num(1 - tt * 0.32 * (1 - front), 3),
  });
}

const initPos = (r: number, deg: number) => P(r, deg, 0);

export function EngineDiagram() {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const els = useRef<Els>({});

  const [view, setView] = useState<"plan" | "section">("plan");
  const [paused, setPaused] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);

  const compactRef = useRef(false);
  const pausedRef = useRef(false);
  const hoverRef = useRef(false);
  const visibleRef = useRef(false);
  const reducedRef = useRef(false);
  const viewRef = useRef<"plan" | "section">("plan");
  const sim = useRef({
    cur: 0,
    target: 0,
    manual: false,
    idle: 0,
    autoS: 0,
    clock: 2,
    key: "",
  });

  // Elements whose attributes change every frame are found by `data-k`, after each render that can change them.
  const collect = useCallback(() => {
    const map: Els = {};
    rootRef.current?.querySelectorAll<SVGElement>("[data-k]").forEach((el) => {
      map[el.getAttribute("data-k") as string] = el;
    });
    els.current = map;
  }, []);

  const pick = useCallback((i: number) => {
    const next = activeRef.current === i ? -1 : i;
    activeRef.current = next;
    sim.current.key = "";
    setActive(next);
  }, []);

  const rotateTo = useCallback((target: 0 | 1) => {
    const s = sim.current;
    s.manual = true;
    s.target = target;
    s.idle = 0;
  }, []);

  // Phones get the compact drawing (numbered, tappable sources). Tablets and up get the full one.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      compactRef.current = mq.matches;
      setCompact(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedRef.current = mq.matches;
      sim.current.key = "";
    };
    sync();
    mq.addEventListener("change", sync);

    const root = rootRef.current;
    const io = new IntersectionObserver(
      ([e]) => (visibleRef.current = e.isIntersecting),
      { rootMargin: "80px" },
    );
    if (root) io.observe(root);

    collect();
    const s = sim.current;
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!visibleRef.current) return;

      const rm = reducedRef.current;
      if (!rm && !pausedRef.current) s.clock += dt;

      if (rm) {
        s.cur = s.target; // no easing, no auto-rotation
      } else if (s.manual) {
        s.cur += (s.target - s.cur) * (1 - Math.exp(-dt * 6.5));
        s.idle += dt;
        if (
          !pausedRef.current &&
          s.idle > IDLE_RESUME &&
          Math.abs(s.target - s.cur) < 0.01
        ) {
          s.manual = false;
          s.cur = s.target;
          s.autoS = s.target > 0.5 ? HOLD0 + ROT : 0; // carry on from the view the visitor left it in
        }
      } else if (!pausedRef.current) {
        if (!(hoverRef.current && inHold(s.autoS))) s.autoS += dt;
        s.cur = autoT(s.autoS);
        s.target = s.cur > 0.5 ? 1 : 0;
      }

      const key = `${s.cur.toFixed(4)}|${s.clock.toFixed(2)}|${compactRef.current}|${activeRef.current}`;
      if (key !== s.key) {
        s.key = key;
        draw(
          els.current,
          s.cur * C.TH,
          s.cur,
          s.clock,
          compactRef.current,
          activeRef.current,
        );
      }
      const v = s.cur > 0.5 ? "section" : "plan";
      if (v !== viewRef.current) {
        viewRef.current = v;
        setView(v);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, [collect]);

  // Redraw once when the drawing mode changes while nothing is animating.
  useEffect(() => {
    collect();
    sim.current.key = "";
  }, [compact, collect]);

  const k = compact ? 1.55 : 1;
  const vb = compact ? "556 148 648 646" : "535 118 690 692";
  const showPlan = view === "plan";

  const textDisplay = "dt-display fill-navy";
  const gid = (n: string) => `${uid}-${n}`;

  return (
    <div>
      {/* Intro and trust line sit outside the card so the card itself (picture + panel) fits one screen. */}
      <p className="mx-auto mb-6 max-w-3xl text-center text-[15px] leading-[1.6] text-navy-body">
        <span className="dt-display font-semibold text-navy">
          {ENGINE_COPY.title}.
        </span>{" "}
        {ENGINE_COPY.intro}
      </p>
      <figure
        ref={rootRef}
        className="rounded-[28px] border border-navy-hairline bg-white p-4 shadow-[0_24px_60px_-32px_rgba(4,30,60,0.25)] sm:p-5 lg:p-6"
        onPointerEnter={(e) => (hoverRef.current = e.pointerType === "mouse")}
        onPointerLeave={() => (hoverRef.current = false)}
        onFocus={() => (hoverRef.current = true)}
        onBlur={() => (hoverRef.current = false)}
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Picture first on a phone; information first on a wide screen */}
          <div className="lg:order-2 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Diagram view"
                className="inline-flex rounded-full border border-navy-hairline p-1"
              >
                {(
                  [
                    ["plan", "Plan view", 0],
                    ["section", "Section view", 1],
                  ] as const
                ).map(([id, label, t]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={view === id}
                    onClick={() => rotateTo(t)}
                    className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      view === id
                        ? "bg-navy text-white"
                        : "text-navy-muted hover:text-navy"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-2 rounded-full border border-navy-hairline px-3.5 py-1.5 text-[13px] font-medium text-navy-muted transition-colors hover:border-accent hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg
                  viewBox="0 0 12 12"
                  className="h-3 w-3"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {paused ? (
                    <path d="M3 1.5v9l7.5-4.5z" />
                  ) : (
                    <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
                  )}
                </svg>
                {paused ? "Play animation" : "Pause animation"}
              </button>
            </div>

            <div
              ref={stageRef}
              className="relative mx-auto mt-4 overflow-hidden rounded-[22px] border border-navy-divider bg-cream-50 lg:min-w-[460px] lg:max-w-[calc((100svh-16rem)*0.997)]"
            >
              <svg
                viewBox={vb}
                role="img"
                aria-label="The engine drawn as one enclosed body. Systems feed data inward from the outside, six modules run through three shared stages, and only what passed reaches your ledger."
                className="block h-auto w-full cursor-pointer"
                onClick={() => rotateTo(sim.current.target > 0.5 ? 0 : 1)}
              >
                <defs>
                  <radialGradient id={gid("body")} cx="50%" cy="50%" r="50%">
                    <stop
                      offset="0%"
                      style={{ stopColor: "var(--cream-50)" }}
                    />
                    <stop
                      offset="55%"
                      style={{ stopColor: "var(--cream-100)" }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "var(--cream-200)" }}
                    />
                  </radialGradient>
                  <linearGradient id={gid("cone")} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      style={{ stopColor: "var(--cream-200)" }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "var(--cream-50)" }}
                    />
                  </linearGradient>
                  <marker
                    id={gid("ah")}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto"
                  >
                    <path d="M0,1 L9,5 L0,9 z" className="fill-accent" />
                  </marker>
                  {SOURCES.map((_, i) => (
                    <path
                      key={i}
                      id={gid(`arc${i}`)}
                      d={arcPath(C.angles[i], 303, isFlipped(C.angles[i]))}
                    />
                  ))}
                  <path id={gid("np1")} d={arcPath(-90, 92, false)} />
                  <path id={gid("np2")} d={arcPath(90, 68, true, 82)} />
                </defs>

                {/* outside: the source ring */}
                <ellipse
                  data-k="srcRing"
                  cx={C.CX}
                  cy={C.CY}
                  rx={C.SRC}
                  ry={C.SRC}
                  fill="none"
                  className="stroke-navy"
                  strokeOpacity="0.28"
                  strokeDasharray="2 6"
                />

                {/* the body in plan, and the same body in section */}
                <path
                  data-k="body"
                  d={bodyPath(0)}
                  fillRule="evenodd"
                  fill={`url(#${gid("body")})`}
                />
                <path
                  data-k="cone"
                  d={conePath(0)}
                  fill={`url(#${gid("cone")})`}
                  opacity="0"
                />

                <ellipse
                  data-k="lane1"
                  cx={C.CX}
                  cy={C.CY}
                  rx={C.L1}
                  ry={C.L1}
                  fill="none"
                  className="stroke-navy"
                  strokeOpacity="0.3"
                />
                <ellipse
                  data-k="lane2"
                  cx={C.CX}
                  cy={C.CY}
                  rx={C.L2}
                  ry={C.L2}
                  fill="none"
                  className="stroke-navy"
                  strokeOpacity="0.3"
                />

                {/* module divisions and codes: meaningful only looking down */}
                <g data-k="spokes">
                  {C.spokes.map((_, i) => (
                    <path
                      key={i}
                      data-k={`spoke${i}`}
                      d={spokePath(i, 0)}
                      fill="none"
                      className="stroke-navy"
                      strokeOpacity="0.3"
                    />
                  ))}
                </g>
                <g data-k="codes">
                  {MODULES.map((m, i) => {
                    const [x, y] = codePos(i, 0);
                    return (
                      <text
                        key={m.code}
                        data-k={`code${i}`}
                        x={num(x)}
                        y={num(y + 6)}
                        textAnchor="middle"
                        fontSize={21 * k}
                        fontWeight={600}
                        letterSpacing="0.8"
                        className={textDisplay}
                      >
                        {m.code}
                      </text>
                    );
                  })}
                </g>

                {/* nameplate on the inner lane */}
                {!compact && (
                  <g data-k="nameplate" className="fill-navy">
                    <text
                      fontSize="17"
                      fontWeight={600}
                      letterSpacing="3"
                      textAnchor="middle"
                      className="dt-display"
                    >
                      <textPath href={`#${gid("np1")}`} startOffset="50%">
                        DATATWIN
                      </textPath>
                    </text>
                    <text
                      fontSize="10"
                      fontWeight={600}
                      letterSpacing="1.3"
                      textAnchor="middle"
                      className="dt-display"
                    >
                      <textPath href={`#${gid("np2")}`} startOffset="50%">
                        ANALYSE FIRST · RECORD LATER
                      </textPath>
                    </text>
                  </g>
                )}
                {compact && <g data-k="nameplate" />}

                {/* the ERP: outside the body, receiving only what passed */}
                <ellipse
                  data-k="erpDisc"
                  cx={C.CX}
                  cy={C.CY}
                  rx={C.IN}
                  ry={C.IN}
                  className="fill-white stroke-navy"
                  strokeOpacity="0.6"
                  strokeWidth="1.4"
                />
                <g data-k="erpLabel">
                  <text
                    x={C.CX}
                    y={C.CY + (compact ? 10 : -3)}
                    textAnchor="middle"
                    fontSize={22 * (compact ? 1.35 : 1)}
                    fontWeight={600}
                    letterSpacing="1.2"
                    className={textDisplay}
                  >
                    ERP
                  </text>
                  {!compact && (
                    <>
                      <text
                        x={C.CX}
                        y={C.CY + 13}
                        textAnchor="middle"
                        fontSize="11"
                        className="fill-navy-muted"
                      >
                        your system
                      </text>
                      <text
                        x={C.CX}
                        y={C.CY + 26}
                        textAnchor="middle"
                        fontSize="11"
                        className="fill-navy-muted"
                      >
                        of record
                      </text>
                    </>
                  )}
                </g>

                <ellipse
                  data-k="rim"
                  cx={C.CX}
                  cy={C.CY}
                  rx={C.BAND}
                  ry={C.BAND}
                  fill="none"
                  className="stroke-navy"
                  strokeWidth="9"
                  strokeOpacity="0.92"
                />
                <ellipse
                  data-k="outlet"
                  cx={C.CX}
                  cy={C.CY}
                  rx={C.IN}
                  ry={C.IN}
                  fill="none"
                  className="stroke-navy"
                  strokeWidth="3"
                />

                {/* data in motion, then the sources themselves */}
                <g>
                  {Array.from({ length: NP }, (_, j) => {
                    const u = (((j * 0.618034) % 1) + 2 / 4.6) % 1;
                    const [x, y] = initPos(
                      C.SRC + (C.IN - C.SRC) * u,
                      C.angles[j % C.angles.length] + u * 16,
                    );
                    return (
                      <circle
                        key={j}
                        data-k={`part${j}`}
                        cx={num(x)}
                        cy={num(y)}
                        r={compact ? 3.4 : 2.4}
                        className="fill-accent"
                        opacity="0.6"
                      />
                    );
                  })}
                </g>
                <g>
                  {C.angles.map((a, i) => {
                    const [x, y] = initPos(C.SRC, a);
                    return (
                      <g
                        key={i}
                        data-k={`dot${i}`}
                        transform={`translate(${num(x)} ${num(y)})`}
                        onClick={
                          compact
                            ? (e) => {
                                e.stopPropagation(); // tapping a source names it; it does not rotate the diagram
                                pick(i);
                              }
                            : undefined
                        }
                        style={compact ? { cursor: "pointer" } : undefined}
                      >
                        {compact && <circle r="24" fill="transparent" />}
                        <circle
                          r={compact ? 15 : 4.8}
                          className={
                            compact
                              ? active === i
                                ? "fill-accent stroke-navy"
                                : "fill-white stroke-navy"
                              : "fill-navy-muted"
                          }
                          strokeOpacity={compact ? 0.7 : 0.5}
                        />
                        {compact && (
                          <text
                            y="6"
                            textAnchor="middle"
                            fontSize="17"
                            fontWeight={600}
                            className="dt-display fill-navy"
                            pointerEvents="none"
                          >
                            {i + 1}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* source names, set around the ring: plan view only. Named in the list below the figure. */}
                <g data-k="planOnly" aria-hidden="true">
                  {!compact &&
                    SOURCES.map((s, i) => (
                      <text
                        key={s}
                        fontSize="13"
                        fontWeight={600}
                        letterSpacing="0"
                        textAnchor="middle"
                        className="dt-display fill-navy"
                        fillOpacity="0.78"
                      >
                        <textPath href={`#${gid(`arc${i}`)}`} startOffset="50%">
                          {s}
                        </textPath>
                      </text>
                    ))}
                </g>

                {compact && (
                  <g data-k="tip" opacity="0" style={{ pointerEvents: "none" }}>
                    <rect
                      data-k="tipRect"
                      x="-80"
                      y="-21"
                      width="160"
                      height="42"
                      rx="21"
                      className="fill-navy"
                    />
                    <text
                      data-k="tipText"
                      y="7"
                      textAnchor="middle"
                      fontSize="21"
                      fontWeight={600}
                      className="dt-display fill-white"
                    />
                  </g>
                )}

                <g data-k="orbit" style={{ pointerEvents: "none" }}>
                  <rect
                    x="-53"
                    y="-12.5"
                    width="106"
                    height="25"
                    rx="5"
                    className="fill-white stroke-accent"
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    fontSize="13.5"
                    fontWeight={600}
                    letterSpacing="1.7"
                    className={textDisplay}
                  >
                    DATATWIN
                  </text>
                </g>

                {/* section view: what sits inside the funnel, and where it leads */}
                <g data-k="elevOnly" opacity="0">
                  <text
                    x={C.CX}
                    y={282}
                    textAnchor="middle"
                    fontSize={17 * (compact ? 1.3 : 1)}
                    fontWeight={600}
                    letterSpacing="3.4"
                    className={textDisplay}
                  >
                    DATATWIN
                  </text>
                  {!compact && (
                    <text
                      x={C.CX}
                      y={300}
                      textAnchor="middle"
                      fontSize="13.5"
                      className="fill-navy-muted"
                    >
                      everything between the rim and the outlet
                    </text>
                  )}

                  {/* the three shared stages */}
                  {[
                    { y: 388, lines: ["Acquire & model"] },
                    { y: 465, lines: ["Reconcile, clean", "& process"] },
                    { y: 575, lines: ["Workflow", "& report"] },
                  ].map((st, si) =>
                    st.lines.map((line, li) => (
                      <text
                        key={`${si}-${li}`}
                        x={C.CX}
                        y={st.y + li * 17 * k}
                        textAnchor="middle"
                        fontSize={(si === 0 ? 17.5 : 16.5) * k}
                        fontWeight={600}
                        className={textDisplay}
                      >
                        {line}
                      </text>
                    )),
                  )}

                  {!compact && (
                    <>
                      <text
                        x={786}
                        y={648}
                        textAnchor="end"
                        fontSize="12"
                        fontWeight={600}
                        letterSpacing="0.8"
                        className="dt-display fill-navy"
                      >
                        {ENGINE_COPY.passed.toUpperCase()}
                      </text>
                      <line
                        x1="792"
                        y1="644"
                        x2="822"
                        y2="644"
                        className="stroke-accent"
                        strokeWidth="1"
                        strokeOpacity="0.7"
                      />
                      <path
                        d="M880,651 L880,679"
                        fill="none"
                        className="stroke-accent"
                        strokeWidth="1.3"
                        markerEnd={`url(#${gid("ah")})`}
                      />
                      <path
                        d="M858,653 C800,669 760,669 738,679"
                        fill="none"
                        className="stroke-accent"
                        strokeWidth="1.2"
                        strokeOpacity="0.85"
                        markerEnd={`url(#${gid("ah")})`}
                      />
                      <path
                        d="M902,653 C960,669 1000,669 1022,679"
                        fill="none"
                        className="stroke-accent"
                        strokeWidth="1.2"
                        strokeOpacity="0.85"
                        markerEnd={`url(#${gid("ah")})`}
                      />
                      {OUTPUTS.map((o, i) => {
                        const x = 671 + i * 142;
                        const ledger = "ledger" in o;
                        return (
                          <g key={o.title}>
                            <rect
                              x={x}
                              y="683"
                              width="134"
                              height="46"
                              rx="8"
                              className="fill-white stroke-navy"
                              strokeOpacity={ledger ? 0.7 : 0.25}
                              strokeWidth={ledger ? 1.6 : 1}
                            />
                            <text
                              x={x + 67}
                              y={ledger ? 703 : 711}
                              textAnchor="middle"
                              fontSize="14"
                              fontWeight={600}
                              className={textDisplay}
                            >
                              {o.title}
                            </text>
                            {ledger ? (
                              <text
                                x={x + 67}
                                y="720"
                                textAnchor="middle"
                                fontSize="11"
                                className="fill-navy-muted"
                              >
                                {o.sub}
                              </text>
                            ) : (
                              <text
                                x={x + 67}
                                y="748"
                                textAnchor="middle"
                                fontSize="12"
                                className="fill-navy-muted"
                              >
                                {o.sub}
                              </text>
                            )}
                          </g>
                        );
                      })}
                      <text
                        x={C.CX}
                        y={778}
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight={600}
                        letterSpacing="1.6"
                        className="dt-display fill-navy-muted"
                      >
                        {ENGINE_COPY.ledgerLabel.toUpperCase()}
                      </text>
                    </>
                  )}
                </g>
              </svg>

              <p className="pointer-events-none absolute right-4 bottom-3 hidden text-[12px] font-medium text-navy-faint md:block">
                Click or tap to rotate
              </p>
            </div>

            {/* Caption under the picture; the section view adds the exceptions note (and, on a phone, the outputs) */}
            <div className="ed-stack mt-5 grid">
              <p
                data-active={showPlan}
                className="text-center text-[13.5px] leading-[1.5] text-navy-muted"
              >
                {ENGINE_COPY.capPlan}
              </p>
              <div data-active={!showPlan} className="text-center">
                <p className="text-[13.5px] leading-[1.5] text-navy-muted">
                  {ENGINE_COPY.capSection}
                </p>
                {compact && (
                  <div className="mt-5 text-left">
                    <p className="text-center text-[11.5px] font-semibold tracking-[0.14em] text-navy uppercase">
                      {ENGINE_COPY.passed}
                    </p>
                    <ul className="mt-3 grid grid-cols-3 gap-2">
                      {OUTPUTS.map((o) => (
                        <li
                          key={o.title}
                          className={`rounded-2xl border bg-white px-2.5 py-2.5 ${"ledger" in o ? "border-navy/60" : "border-navy-hairline"}`}
                        >
                          <p className="dt-display text-[12.5px] leading-tight font-semibold text-navy">
                            {o.title}
                          </p>
                          <p className="mt-1 text-[11.5px] leading-snug text-navy-muted">
                            {o.sub}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:order-1 lg:col-span-5">
            <div className="ed-stack grid">
              <div data-active={showPlan}>
                <PlanInfo />
              </div>
              <div data-active={!showPlan} className="lg:pt-2">
                <SectionInfo />
              </div>
            </div>
          </div>
        </div>

        {/* The systems around the outside, named. Visible on a phone (matching the numbered dots), read out on a wide screen. */}
        <div
          className={
            compact ? "mt-8 border-t border-navy-divider pt-6" : "sr-only"
          }
        >
          <p className="text-[11.5px] font-semibold tracking-[0.14em] text-navy uppercase">
            Systems around the outside
          </p>
          {compact && (
            <p className="mt-1 text-[12.5px] text-navy-muted">
              Tap a number on the diagram, or a name here, to match them up.
            </p>
          )}
          <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {SOURCES.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => pick(i)}
                  className={`flex w-full items-center gap-2.5 rounded-full border px-2 py-1.5 text-left text-[13.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    active === i
                      ? "border-accent bg-white text-navy"
                      : "border-transparent text-navy-body"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold text-navy ${
                      active === i
                        ? "border-navy bg-accent"
                        : "border-navy-hairline"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {s}
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Not drawn: the DARP steps and stage names, for readers who skip the picture. */}
        <span className="sr-only">
          {STAGES.join(", ")}.{" "}
          {DARP_STEPS.map((s) => `${s.name}: ${s.desc}`).join(" ")}
        </span>
      </figure>
      <p className="mt-6 text-center text-[12.5px] font-medium tracking-[0.02em] text-navy-faint">
        {ENGINE_COPY.trust}
      </p>
    </div>
  );
}
