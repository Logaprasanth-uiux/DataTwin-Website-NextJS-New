import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Playground — DataTwin",
  description: "Internal demo space for the DataTwin team. Not part of the customer-facing site.",
  robots: { index: false, follow: false },
};

// Internal-only: each suite is a demo the team uses to understand or review how a part of the product works.
const SUITES = [
  {
    href: "/playground/chat-flow",
    title: "Chat Flow",
    blurb:
      "How a conversation runs, from the first message to the detailed result, drawn as a flowchart per problem statement. Play it step by step, or edit the steps and files.",
    tags: ["Flowchart", "Editable", "Walkthrough"],
  },
] as const;

export default function PlaygroundPage() {
  return (
    <main style={{ color: "var(--ink-on-dark)" }} className="min-h-screen bg-canvas px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-[1000px]">
        <Link href="/" className="text-sm opacity-60 hover:opacity-100">
          ← datatwin.ai
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Internal</p>
        <h1 className="mt-2 font-display text-4xl">Playground</h1>
        <p className="mt-3 max-w-[60ch] text-base opacity-70">
          Demo-only space for the team. Nothing here is shown to customers, and nothing here is indexed.
        </p>

        <h2 className="mt-14 text-sm font-semibold uppercase tracking-[0.1em] opacity-60">Feature Suites</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SUITES.map((suite) => (
            <Link
              key={suite.href}
              href={suite.href}
              className="group block rounded-2xl border border-white/15 bg-white/[0.04] p-6 transition hover:-translate-y-0.5 hover:border-accent"
            >
              <h3 className="font-display text-xl">{suite.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{suite.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {suite.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs opacity-80">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-block text-sm text-accent transition group-hover:translate-x-1">Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
