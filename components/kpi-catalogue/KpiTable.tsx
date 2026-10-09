"use client";

import { useMemo, useState } from "react";
import { DOMAINS, METRICS, TOTALS } from "./metrics";

// The searchable register: a domain filter, a text search across every field, and the matching metrics as a
// table (cards on phones).
export function KpiTable({ columns, empty, download }: { columns: readonly string[]; empty: string; download: { label: string; href: string } }) {
  const [domain, setDomain] = useState<string>("all");
  const [query, setQuery] = useState("");

  const names = useMemo(() => Object.fromEntries(DOMAINS.map((d) => [d.code, d.name])), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return METRICS.filter((m) => {
      if (domain !== "all" && m.domain !== domain) return false;
      if (!q) return true;
      return [m.domain, names[m.domain], m.process, m.metric, m.against].some((f) => f?.toLowerCase().includes(q));
    });
  }, [domain, query, names]);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
      active ? "border-navy bg-navy text-white" : "border-navy-hairline bg-white text-navy hover:border-accent"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by domain">
          <button type="button" onClick={() => setDomain("all")} aria-pressed={domain === "all"} className={chip(domain === "all")}>
            All domains
          </button>
          {DOMAINS.map((d) => (
            <button
              key={d.code}
              type="button"
              onClick={() => setDomain(d.code)}
              aria-pressed={domain === d.code}
              title={d.name}
              className={chip(domain === d.code)}
            >
              {d.code}
            </button>
          ))}
        </div>
        <label className="relative block lg:w-80">
          <span className="sr-only">Search the catalogue</span>
          <svg viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-muted" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search every field"
            className="h-11 w-full rounded-full border border-navy-hairline bg-white pr-4 pl-11 text-[14px] text-navy outline-none placeholder:text-navy-muted focus:border-accent"
          />
        </label>
      </div>

      <p className="mt-5 text-[13px] font-medium text-navy-muted" aria-live="polite">
        {rows.length} of {TOTALS.metrics}
      </p>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-[22px] border border-dashed border-navy-hairline bg-white/70 px-6 py-12 text-center text-[15px] text-navy-muted">{empty}</p>
      ) : (
        <>
          <div className="mt-4 hidden overflow-hidden rounded-[24px] border border-navy-hairline bg-white md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-cream-50">
                  {columns.map((c) => (
                    <th key={c} scope="col" className="px-5 py-4 text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((m, i) => (
                  <tr key={`${m.domain}-${m.process}-${m.metric}-${i}`} className="border-t border-navy-divider">
                    <td className="px-5 py-3.5 align-top">
                      <span className="inline-flex rounded-full bg-navy px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.08em] text-accent" title={names[m.domain]}>
                        {m.domain}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 align-top text-[14px] text-navy-body">{m.process}</td>
                    <td className="px-5 py-3.5 align-top text-[14.5px] font-medium text-navy">{m.metric}</td>
                    <td className="px-5 py-3.5 align-top text-[13.5px] text-navy-muted">{m.against}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-4 grid gap-3 md:hidden">
            {rows.map((m, i) => (
              <li key={`${m.domain}-${m.process}-${m.metric}-${i}`} className="rounded-[18px] border border-navy-hairline bg-white p-4">
                <p className="flex items-center gap-2.5">
                  <span className="inline-flex rounded-full bg-navy px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.08em] text-accent">{m.domain}</span>
                  <span className="text-[13px] text-navy-body">{m.process}</span>
                </p>
                <p className="mt-2.5 text-[14.5px] leading-[1.45] font-medium text-navy">{m.metric}</p>
                <p className="mt-1.5 text-[13px] leading-[1.45] text-navy-muted">{m.against}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8 flex justify-center">
        <a
          href={download.href}
          download
          className="dt-button group inline-flex h-11 items-center gap-2.5 rounded-full border border-navy-hairline px-5 text-[14px] text-navy transition-colors hover:border-accent focus-visible:border-accent"
        >
          {download.label}
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-accent" aria-hidden="true">
            <path d="M8 2v9M4.5 7.5L8 11l3.5-3.5M3 14h10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
