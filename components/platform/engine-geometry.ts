// Geometry for the engine diagram: a direct port of the reference diagram's maths. The object is a set of
// concentric rings seen from above ("plan", th = 0) that tilt to th = TH degrees ("section"), where the rings
// read as a funnel: sources at the top, the ledger at the base. `tt` is the 0..1 progress between the views.

export const C = {
  CX: 880,
  CY: 468,
  TH: 86,
  // [radius, depth]: how far each ring sits below the plane once the object tilts
  RINGS: [[290, -115], [230, 0], [172, 80], [118, 170], [54, 300]] as const,
  SRC: 290,
  OUT: 230,
  L1: 172,
  L2: 118,
  IN: 54,
  BAND: 237,
  angles: [-128.57, -102.8557, -77.1414, -51.4271, -25.7129, 0.0014, 25.7157, 51.43, 77.1443, 102.8586, 128.5729, 154.2871, 180.0014, 205.7157],
  spokes: [-120, -60, 0, 60, 120, 180],
  codeAngles: [-90, -30, 30, 90, 150, 210],
} as const;

const TAU = Math.PI / 180;

export function depth(r: number) {
  const R = C.RINGS;
  for (let i = 0; i < R.length - 1; i++) {
    if (r <= R[i][0] && r >= R[i + 1][0]) {
      return R[i][1] + ((R[i + 1][1] - R[i][1]) * (R[i][0] - r)) / (R[i][0] - R[i + 1][0]);
    }
  }
  return r > R[0][0] ? R[0][1] : R[R.length - 1][1];
}

function liftOf(th: number) {
  const s = Math.sin(th * TAU);
  const c = Math.cos(th * TAU);
  let top = 1e9;
  let bot = -1e9;
  for (const [r, h] of C.RINGS) {
    top = Math.min(top, C.CY + h * s - r * c);
    bot = Math.max(bot, C.CY + h * s + r * c);
  }
  return (top + bot) / 2 - (C.CY - 40 * s);
}

export function P(r: number, deg: number, th: number): [number, number] {
  const t = deg * TAU;
  const s = Math.sin(th * TAU);
  const c = Math.cos(th * TAU);
  return [C.CX + r * Math.cos(t), C.CY + r * Math.sin(t) * c + depth(r) * s - liftOf(th)];
}

export const cyOf = (r: number, th: number) => C.CY + depth(r) * Math.sin(th * TAU) - liftOf(th);
export const ryOf = (r: number, th: number) => r * Math.cos(th * TAU);

export function ringPath(r: number, th: number) {
  const cy = cyOf(r, th);
  const ry = ryOf(r, th).toFixed(2);
  return `M${C.CX - r},${cy.toFixed(2)} A${r},${ry} 0 1,0 ${C.CX + r},${cy.toFixed(2)} A${r},${ry} 0 1,0 ${C.CX - r},${cy.toFixed(2)} Z`;
}

export function bodyPath(th: number) {
  return `${ringPath(C.OUT, th)} ${ringPath(C.IN, th)}`;
}

export function conePath(th: number) {
  const c = Math.cos(th * TAU);
  const ml = P(C.OUT, 180, th);
  const mr = P(C.OUT, 0, th);
  const nl = P(C.IN, 180, th);
  const nr = P(C.IN, 0, th);
  const f = (n: number) => n.toFixed(1);
  return (
    `M${f(ml[0])},${f(ml[1])} L${f(nl[0])},${f(nl[1])} A${C.IN},${(C.IN * c).toFixed(2)} 0 0,0 ${f(nr[0])},${f(nr[1])}` +
    ` L${f(mr[0])},${f(mr[1])} A${C.OUT},${(C.OUT * c).toFixed(2)} 0 0,0 ${f(ml[0])},${f(ml[1])} Z`
  );
}

export function spokePath(i: number, th: number) {
  return [C.OUT, C.L1, C.L2, C.IN]
    .map((r, k) => {
      const p = P(r, C.spokes[i], th);
      return `${k ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`;
    })
    .join(" ");
}

export function codePos(i: number, th: number): [number, number] {
  const mid = P((C.OUT + C.L1) / 2, C.codeAngles[i], th);
  return [mid[0], mid[1]];
}

// ---- Animation timing ---------------------------------------------------------------------------------------

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// Longer holds than the reference, so the panel beside the diagram can actually be read between rotations.
export const HOLD0 = 6;
export const ROT = 2.4;
export const HOLD1 = 7;
export const LOOP = HOLD0 + ROT + HOLD1 + ROT;

export function autoT(sec: number) {
  const s = sec % LOOP;
  if (s < HOLD0) return 0;
  if (s < HOLD0 + ROT) return ease((s - HOLD0) / ROT);
  if (s < HOLD0 + ROT + HOLD1) return 1;
  return 1 - ease((s - HOLD0 - ROT - HOLD1) / ROT);
}

export const inHold = (sec: number) => {
  const s = sec % LOOP;
  return s < HOLD0 || (s >= HOLD0 + ROT && s < HOLD0 + ROT + HOLD1);
};

// Arc used for text that follows the source ring. Upper half reads clockwise; lower half is flipped so the
// text is never upside down.
export function arcPath(centerDeg: number, r: number, flip: boolean, half = 42) {
  const pt = (d: number, rr: number) => `${(C.CX + rr * Math.cos(d * TAU)).toFixed(1)},${(C.CY + rr * Math.sin(d * TAU)).toFixed(1)}`;
  if (!flip) return `M${pt(centerDeg - half, r)} A${r},${r} 0 0,1 ${pt(centerDeg + half, r)}`;
  const rr = r + 10; // glyphs sit above the baseline, which faces the centre on the flipped half
  return `M${pt(centerDeg + half, rr)} A${rr},${rr} 0 0,0 ${pt(centerDeg - half, rr)}`;
}

export const isFlipped = (deg: number) => Math.sin(deg * TAU) > 0.2;
