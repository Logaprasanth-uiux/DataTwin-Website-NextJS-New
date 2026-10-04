import type { ReactNode } from "react";

// The three illustrative dashboards. Pure presentation (no state); every figure is an example, not a
// customer result. Colour stays inside the brand: navy at varying opacity, amber for the lead value, and the
// `loss` red only for breaches and disputes.

const num = "dt-display font-semibold tracking-[-0.02em] text-navy";

function Panel({ title, sub, children, className = "" }: { title: string; sub?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-[20px] border border-navy-divider bg-cream-50 p-5 sm:p-6 ${className}`}>
      <p className="dt-eyebrow">{title}</p>
      {sub && <p className="mt-1 text-[12.5px] font-medium text-navy-faint">{sub}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className={`${num} text-[1.5rem] leading-none sm:text-[1.75rem]`}>{value}</p>
      <p className="mt-2 text-[13px] leading-snug text-navy-body">{label}</p>
    </div>
  );
}

function BarRow({ label, value, pct, lead = false }: { label: string; value: string; pct: number; lead?: boolean }) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-4 text-[14px]">
        <span className="text-navy-body">{label}</span>
        <span className="font-semibold text-navy tabular-nums">{value}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-divider">
        <div className={`h-full rounded-full ${lead ? "bg-accent" : "bg-navy"}`} style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}

// ---- DARP · Discover, Assess, Recover ---------------------------------------------------------------------

const RECOVERY = [
  { label: "Cash recoverable", value: "₹1.98 Cr", amount: 1.98, lead: true },
  { label: "Tax recoverable", value: "₹1.30 Cr", amount: 1.3 },
  { label: "Misstated, no cash", value: "₹0.96 Cr", amount: 0.96 },
  { label: "Control exposure", value: "₹0.58 Cr", amount: 0.58 },
];

const STANDING = [
  { label: "Settled", pct: 34, fill: "bg-accent" },
  { label: "Claim issued", pct: 26, fill: "bg-navy" },
  { label: "Evidence ready", pct: 19, fill: "bg-navy/60" },
  { label: "In review", pct: 14, fill: "bg-navy/30" },
  { label: "Disputed", pct: 7, fill: "bg-loss" },
];

export function RecoveryDashboard() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Panel title="Recovery position" sub="Current engagement">
        <p className={`${num} text-[2.75rem] leading-none sm:text-[3.25rem]`}>₹4.82 Cr</p>
        <p className="mt-3 text-[14px] text-navy-body">Total identified across 1.2M transactions tested</p>
        <ul className="mt-7 space-y-4 border-t border-navy-divider pt-6">
          {RECOVERY.map((r) => (
            <BarRow key={r.label} label={r.label} value={r.value} pct={(r.amount / 1.98) * 100} lead={r.lead} />
          ))}
        </ul>
      </Panel>

      <Panel title="Where each finding stands" sub="By value">
        <div className="flex h-3 overflow-hidden rounded-full" role="img" aria-label="Findings by status, by value">
          {STANDING.map((s) => (
            <span key={s.label} className={`${s.fill} h-full`} style={{ width: `${s.pct}%` }} />
          ))}
        </div>
        <ul className="mt-6 space-y-3">
          {STANDING.map((s) => (
            <li key={s.label} className="flex items-center gap-3 text-[14px]">
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${s.fill}`} />
              <span className="flex-1 text-navy-body">{s.label}</span>
              <span className="font-semibold text-navy tabular-nums">{s.pct}%</span>
            </li>
          ))}
        </ul>
        <div className="mt-7 grid grid-cols-2 gap-6 border-t border-navy-divider pt-6">
          <Stat value="₹1.64 Cr" label="Cash returned to date" />
          <Stat value="21 days" label="Median claim to settlement" />
        </div>
      </Panel>
    </div>
  );
}

// ---- DARP · Prevent ---------------------------------------------------------------------------------------

const STOPPED = [
  { label: "Duplicate test", n: 1296 },
  { label: "Price vs contract", n: 921 },
  { label: "Tax treatment", n: 648 },
  { label: "Approval limit", n: 341 },
  { label: "Bank detail change", n: 206 },
];

// Findings per 10,000 transactions over 12 rolling periods, declining as rules take hold.
const LEAKAGE = [92, 88, 83, 77, 70, 62, 54, 45, 37, 30, 25, 20];

function Sparkline() {
  const w = 320;
  const h = 120;
  const pad = 8;
  const step = (w - pad * 2) / (LEAKAGE.length - 1);
  const pts = LEAKAGE.map((v, i) => [pad + i * step, pad + (1 - v / 100) * (h - pad * 2)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Leakage rate declining over 12 periods">
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} className="stroke-navy-divider" strokeDasharray="3 4" />
      ))}
      <path d={`${line}L${lx} ${h - pad}L${pad} ${h - pad}Z`} className="fill-accent/10" />
      <path d={line} fill="none" className="stroke-navy" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="4.5" className="fill-accent stroke-white" strokeWidth="2" />
    </svg>
  );
}

export function PreventDashboard() {
  const max = STOPPED[0].n;
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Panel title="Stopped at entry" sub="This period">
        <p className={`${num} text-[2.75rem] leading-none sm:text-[3.25rem]`}>3,412</p>
        <p className="mt-3 text-[14px] text-navy-body">Transactions held or corrected before posting</p>
        <ul className="mt-7 space-y-4 border-t border-navy-divider pt-6">
          {STOPPED.map((s, i) => (
            <BarRow key={s.label} label={s.label} value={s.n.toLocaleString("en-US")} pct={(s.n / max) * 100} lead={i === 0} />
          ))}
        </ul>
      </Panel>

      <Panel title="Leakage rate" sub="Rolling 12 periods · findings per 10,000 transactions, declining as rules take hold">
        <Sparkline />
        <div className="mt-2 flex justify-between text-[11px] font-medium tracking-[0.08em] text-navy-faint uppercase">
          <span>Go-live</span>
          <span>Now</span>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-6 border-t border-navy-divider pt-6">
          <Stat value="79%" label="Reduction since go-live" />
          <Stat value="96.2%" label="Touchless, no human needed" />
        </div>
      </Panel>
    </div>
  );
}

// ---- FSCP -------------------------------------------------------------------------------------------------

const CLEARED = [58, 61, 66, 70, 72, 76, 79, 83, 85, 88, 91, 94];

const BREACHES = [
  { area: "Inventory", scored: 46, breaching: 3, status: "Watch" },
  { area: "Revenue recognition", scored: 52, breaching: 6, status: "Breached" },
  { area: "Cash application", scored: 38, breaching: 1, status: "On track" },
  { area: "Payments & AP", scored: 44, breaching: 2, status: "Watch" },
  { area: "GL & controls", scored: 34, breaching: 0, status: "On track" },
] as const;

const PILL: Record<string, string> = {
  Breached: "border-loss/50 text-loss",
  Watch: "border-accent text-navy",
  "On track": "border-navy-hairline text-navy-body",
};
const DOT: Record<string, string> = { Breached: "bg-loss", Watch: "bg-accent", "On track": "bg-navy/40" };

function ReadinessRing() {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 128 128" className="h-24 w-24 flex-shrink-0 -rotate-90 sm:h-32 sm:w-32" role="img" aria-label="186 of 214 KPIs green">
      <circle cx="64" cy="64" r={r} fill="none" className="stroke-navy-divider" strokeWidth="9" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        className="stroke-accent"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(c * 186) / 214} ${c}`}
      />
    </svg>
  );
}

export function CloseDashboard() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-5">
        <Panel title="Close readiness" sub="Day 1 of close" className="flex-1">
          <div className="flex items-center gap-6">
            <ReadinessRing />
            <div>
              <p className={`${num} text-[2.75rem] leading-none sm:text-[3.25rem]`}>186</p>
              <p className="mt-3 text-[14px] text-navy-body">KPIs green of 214 scored</p>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-3 gap-4 border-t border-navy-divider pt-6">
            <Stat value="9" label="Accounts flagged at risk" />
            <Stat value="97.4%" label="Sub-ledger to GL tie-out" />
            <Stat value="2.1%" label="Manual journal share" />
          </div>
        </Panel>

        <Panel title="Exceptions cleared" sub="Last 12 periods">
          <div className="flex h-20 items-end gap-1.5" role="img" aria-label="Exceptions cleared, last 12 periods, rising">
            {CLEARED.map((v, i) => (
              <span
                key={i}
                className={`flex-1 rounded-t-[3px] ${i === CLEARED.length - 1 ? "bg-accent" : "bg-navy/25"}`}
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="KPI breaches by area" sub="Needs attention before sign-off">
        <div className="overflow-x-auto"><table className="w-full min-w-[300px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-navy-divider text-[11px] font-medium tracking-[0.1em] text-navy-faint uppercase">
              <th className="pb-3 font-medium">Process area</th>
              <th className="pb-3 text-right font-medium">Scored</th>
              <th className="pb-3 text-right font-medium">Breaching</th>
              <th className="pb-3 pl-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {BREACHES.map((b) => (
              <tr key={b.area} className="border-b border-navy-divider last:border-b-0">
                <td className="py-4 pr-2 font-medium text-navy">{b.area}</td>
                <td className="py-4 text-right text-navy-body tabular-nums">{b.scored}</td>
                <td className="py-4 text-right font-semibold text-navy tabular-nums">{b.breaching}</td>
                <td className="py-4 pl-3 text-right">
                  <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[12px] font-medium ${PILL[b.status]}`}>
                    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOT[b.status]}`} />
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Panel>
    </div>
  );
}
