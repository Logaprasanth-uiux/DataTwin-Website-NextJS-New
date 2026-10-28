"use client";

import { useState, type ReactNode } from "react";
import { useRecoveryFormatter } from "@/lib/chat/useCurrency";
import type { AnnualStatus, AnnualTable } from "@/lib/chat/types";

// The GSTR-9C result: the audited books against GSTR-9, table by table, with an indicator on every
// line. Locked, it shows the indicators and how many lines sit behind each (so you can see where the
// trouble is) but not the figures or the levels below. Unlocked, every table opens into its
// components, then the months that differ, then the invoices — the last item, where the cause is named.

const STATUS: Record<AnnualStatus, { label: string; dot: string; pill: string; hint: string }> = {
  mismatch: { label: "Mismatch", dot: "bg-loss", pill: "bg-loss/[0.14] text-loss", hint: "A difference with no explanation yet" },
  explained: { label: "Explained", dot: "bg-accent", pill: "bg-accent/[0.16] text-navy", hint: "A difference with a known reason" },
  matched: { label: "Matched", dot: "bg-[#3d8b6e]", pill: "bg-[#3d8b6e]/[0.14] text-navy", hint: "Agrees with GSTR-9" },
  pending: { label: "Needs document", dot: "bg-navy-faint", pill: "bg-navy/[0.07] text-navy-muted", hint: "Add the document named under the table to reconcile it" },
};

const ORDER: AnnualStatus[] = ["mismatch", "explained", "matched", "pending"];

const GRID = "grid-cols-[minmax(0,1fr)_auto] @xl:grid-cols-[minmax(0,2.2fr)_repeat(3,minmax(0,1fr))_6.5rem]";
const BLUR = "blur-[6px] select-none";

function StatusPill({ status }: { status: AnnualStatus }) {
  const style = STATUS[status];
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.04em] whitespace-nowrap ${style.pill}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function counts(statuses: AnnualStatus[]): string {
  return ORDER.map((status) => ({ status, count: statuses.filter((s) => s === status).length }))
    .filter(({ count }) => count > 0)
    .map(({ status, count }) => `${count} ${STATUS[status].label.toLowerCase()}`)
    .join(" · ");
}

export function AnnualDrilldown({
  tables,
  locked,
  onUnlock,
}: {
  tables: AnnualTable[];
  locked: boolean;
  /** Shown as the unlock button under the table while it is locked. */
  onUnlock?: () => void;
}) {
  const { formatter, ready } = useRecoveryFormatter();
  const [open, setOpen] = useState<Set<string>>(() => new Set(tables.length > 0 ? [tables[0].id] : []));
  // Once a row has been opened by hand the chat stops chasing the bottom (see ChatPageClient).
  const [touched, setTouched] = useState(false);
  const toggle = (id: string) => {
    setTouched(true);
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const money = (amount: number) => (ready ? formatter.format(amount) : "");
  const signed = (amount: number) => (amount === 0 ? money(0) : `${amount > 0 ? "+" : "−"}${money(Math.abs(amount))}`);
  const hide = locked ? BLUR : "";
  const allStatuses = tables.flatMap((t) => (t.status === "pending" ? [t.status] : t.components.map((c) => c.status)));

  // One line of the table at any depth. `figures` are blurred while locked; the indicator never is.
  const Line = ({
    depth,
    id,
    label,
    sub,
    status,
    figures,
    expandable,
  }: {
    depth: 0 | 1 | 2 | 3;
    id: string;
    label: ReactNode;
    sub?: ReactNode;
    status: AnnualStatus;
    figures: { books?: number; gstr9?: number; difference?: number };
    expandable: boolean;
  }) => {
    const isOpen = open.has(id);
    const canOpen = !locked && expandable;
    const content = (
      <>
        <span className="flex min-w-0 items-start gap-2" style={{ paddingLeft: depth * 16 }}>
          <span aria-hidden="true" className="mt-[3px] flex h-4 w-4 flex-shrink-0 items-center justify-center text-navy-muted">
            {locked && depth === 0 ? <LockIcon className="h-3 w-3" /> : canOpen ? <ChevronIcon className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`} /> : null}
          </span>
          <span className="min-w-0">
            <span className={`block text-[13.5px] text-navy ${depth === 0 ? "font-semibold" : "font-medium"}`}>{label}</span>
            {sub ? <span className="mt-0.5 block text-[12px] leading-snug text-navy-muted">{sub}</span> : null}
          </span>
        </span>
        <span className={`hidden text-right text-[13px] tabular-nums text-navy-body @xl:block ${hide}`} aria-hidden={locked}>
          {figures.books === undefined ? "" : money(figures.books)}
        </span>
        <span className={`hidden text-right text-[13px] tabular-nums text-navy-body @xl:block ${hide}`} aria-hidden={locked}>
          {figures.gstr9 === undefined ? "" : money(figures.gstr9)}
        </span>
        <span
          className={`text-right text-[13.5px] font-medium tabular-nums ${status === "mismatch" ? "text-loss" : "text-navy"} ${hide}`}
          aria-hidden={locked}
        >
          {figures.difference === undefined ? "—" : signed(figures.difference)}
        </span>
        <span className="col-span-2 flex @xl:col-span-1 @xl:justify-end"><StatusPill status={status} /></span>
      </>
    );
    const rowClass = `grid ${GRID} items-center gap-x-4 gap-y-1.5 px-1 py-3 text-left`;
    return canOpen ? (
      <button type="button" onClick={() => toggle(id)} aria-expanded={isOpen} className={`${rowClass} w-full transition-colors hover:bg-navy/[0.025]`}>
        {content}
      </button>
    ) : (
      <div className={rowClass}>{content}</div>
    );
  };

  return (
    <div data-hold-scroll={touched ? "true" : undefined} className="@container rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">GSTR-9C reconciliation</p>
      <h3 className="mt-1.5 text-[17px] font-semibold text-navy sm:text-[19px]">Audited books vs GSTR-9</h3>
      <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-navy-body">
        {locked
          ? "Every table, line, month and invoice is marked mismatch, explained or matched. Unlock the drill-down to see the figures and trace each difference to the invoice behind it."
          : "Open any line to trace it: table, then line, then the twelve months, then the invoices. Every level carries its own indicator, and the cause is named at the invoice."}
      </p>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {ORDER.filter((status) => status !== "pending" || allStatuses.includes(status)).map((status) => (
          <span key={status} className="flex items-center gap-2 text-[12.5px] text-navy-body" title={STATUS[status].hint}>
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${STATUS[status].dot}`} />
            <span className="font-medium text-navy">{allStatuses.filter((s) => s === status).length}</span>
            {STATUS[status].label.toLowerCase()}
          </span>
        ))}
      </div>

      <div
        className={`mt-4 hidden ${GRID} gap-x-4 border-b border-navy-divider px-1 pb-2 text-[10.5px] font-semibold tracking-[0.12em] text-navy-faint uppercase @xl:grid`}
      >
        <span>Table</span>
        <span className="text-right">Audited books</span>
        <span className="text-right">GSTR-9</span>
        <span className="text-right">Difference</span>
        <span className="text-right">Status</span>
      </div>

      <div className="mt-2 flex flex-col divide-y divide-navy-divider @xl:mt-0">
        {tables.map((table) => (
          <div key={table.id}>
            {Line({
              depth: 0,
              id: table.id,
              label: `${table.ref} · ${table.label}`,
              sub:
                table.status === "pending"
                  ? table.needsDocument
                  : `${table.components.length} lines · ${counts(table.components.map((c) => c.status))}`,
              status: table.status,
              figures: table.status === "pending" ? {} : { books: table.books, gstr9: table.gstr9, difference: table.difference },
              expandable: table.components.length > 0,
            })}
            {!locked && open.has(table.id) && (
              <div className="mb-2 flex flex-col divide-y divide-navy-divider/60 rounded-xl bg-navy/[0.02]">
                {table.components.map((component) => (
                  <div key={component.id}>
                    {Line({
                      depth: 1,
                      id: component.id,
                      label: component.label,
                      sub: (
                        <>
                          {component.reason ? <span className="block">Reason: {component.reason}</span> : null}
                          <span className="block">
                            {component.status === "matched"
                              ? "All 12 months agree"
                              : `${component.months.filter((m) => m.status !== "matched").length} of 12 months differ`}
                          </span>
                        </>
                      ),
                      status: component.status,
                      figures: { books: component.books, gstr9: component.gstr9, difference: component.difference },
                      expandable: component.months.length > 0,
                    })}
                    {open.has(component.id) &&
                      component.months.map((month) => {
                        const monthId = `${component.id}:${month.month}`;
                        return (
                          <div key={monthId}>
                            {Line({
                              depth: 2,
                              id: monthId,
                              label: month.month,
                              sub:
                                month.invoices.length === 0
                                  ? "Agrees with GSTR-9"
                                  : `${month.invoices.length} invoices · ${counts(month.invoices.map((i) => i.status))}`,
                              status: month.status,
                              figures: { difference: month.difference },
                              expandable: month.invoices.length > 0,
                            })}
                            {open.has(monthId) &&
                              month.invoices.map((invoice) => (
                                <div key={invoice.ref}>
                                  {Line({
                                    depth: 3,
                                    id: `${monthId}:${invoice.ref}`,
                                    label: `${invoice.ref} · ${invoice.party}`,
                                    sub: invoice.cause,
                                    status: invoice.status,
                                    figures: { difference: invoice.difference },
                                    expandable: false,
                                  })}
                                </div>
                              ))}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {locked && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-navy-hairline bg-navy/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2.5 text-[13px] leading-relaxed text-navy-body">
            <LockIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" />
            The figures and the drill-down to the invoice unlock with a conversation with the DataTwin Team.
          </p>
          {onUnlock && (
            <button
              type="button"
              onClick={onUnlock}
              className="dt-button h-11 w-fit flex-shrink-0 rounded-full border border-navy bg-navy px-5 text-[13.5px] text-white transition-colors hover:bg-navy/90"
            >
              Unlock drill-down
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M6 3.5l4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
