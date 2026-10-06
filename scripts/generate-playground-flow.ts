// Regenerates lib/playground/chatflow.json from the same code that drives the chat, so the
// playground's flow map can't drift from the product. Run with:
//
//   npm run playground:generate
//
// Every guided flow (lib/chat/flows.ts plus the hand-scripted sales, e-invoice, export and annual
// flows) becomes one problem column, grouped by area (lib/chat/areas.ts). Edits made in the
// playground are overwritten by the next run, so make lasting changes in the chat code instead.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { AREAS, AREA_BY_ID, areaOfFamily } from "../lib/chat/areas";
import { RECONCILIATION_CATALOG } from "../lib/chat/data/catalog";
import { FLOWS } from "../lib/chat/flows";
import { buildIntentSummary } from "../lib/chat/intents";
import { buildResolvedTopic, periodModeFor } from "../lib/chat/reconciliation";
import type { ChatFlow, FlowFile, FlowStep, Problem } from "../lib/playground/chatflow-types";

const HAND_SCRIPTED = ["10.1", "10.15", "1.14", "11.9", "10.11", "10.12", "10.13", "10.14", "14.8", "8.5"];
const FRAMING_NOTE = {
  recovery: "Result is framed as a recovery: money that can come back, net of anything short-paid.",
  exposure: "Result is framed as an exposure: tax that looks unpaid or under-reported, net of anything paid in excess.",
  mismatch: "Result is framed as differences: value that doesn't agree between books and returns, not an amount owed or recoverable yet.",
} as const;

const ids = [...new Set([...HAND_SCRIPTED, ...FLOWS.map((f) => f.id)])];
const order = (id: string) => RECONCILIATION_CATALOG.findIndex((e) => e.id === id);

const problems: Problem[] = [];
for (const area of AREAS) {
  const inArea = ids
    .filter((id) => areaOfFamily(RECONCILIATION_CATALOG.find((e) => e.id === id)!.familyId) === area.id)
    .sort((a, b) => order(a) - order(b));
  for (const id of inArea) {
    const topic = buildResolvedTopic(id);
    if (!topic) continue;
    const pid = `p-${id.replace(".", "-")}`;
    const intent = buildIntentSummary(topic);
    const portal = new Set(topic.portalFetchFileIds ?? []);
    const checkpoints = topic.furtherCheckpoints ?? [];
    checkpoints.forEach((c) => c.portalFetchFileIds?.forEach((f) => portal.add(f)));
    const toFile = (f: { fileId: string; name: string; why: string }, level: "required" | "optional"): FlowFile => ({
      id: `${pid}-f-${f.fileId}`,
      name: f.name,
      level,
      source: portal.has(f.fileId) ? "both" : "upload",
      why: f.why,
    });
    const annual = periodModeFor(id) === "annual";
    const steps: FlowStep[] = [
      {
        id: `${pid}-1`,
        kind: "ai",
        title: "Show what was understood",
        detail: `Problem: ${intent.problem}\nWhat you're after: ${intent.intent}\nWhat I'll check: ${intent.checks.join("; ")}.`,
        chips: ["Yes, that's right", "Not quite"],
      },
      {
        id: `${pid}-2`,
        kind: "choice",
        title: "Period selection",
        detail: annual
          ? "Which financial year should be reconciled?"
          : "Which month should be reconciled? Picking year-end offers to switch to the annual (GSTR-9) flow.",
        chips: annual
          ? ["Current financial year", "Previous financial year", "Other financial year"]
          : ["Current month", "Previous month", "Custom month", "Year-end (annual)"],
      },
      {
        id: `${pid}-3`,
        kind: "files",
        title: "Required documents",
        detail:
          "Requested one by one. The first document gets a quick validation pass; a document that can come from the GST Portal also offers Fetch.",
        files: topic.requiredFiles.map((f) => toFile(f, "required")),
      },
    ];
    if (checkpoints.length > 0) {
      steps.push({
        id: `${pid}-4`,
        kind: "files",
        title: "Optional documents (offered together)",
        detail:
          'All shown at once in one message. The reconciliation waits for the user: "Continue without these" or "Run reconciliation with N extra documents". Anything added here counts towards the first result; anything skipped is offered again below the result.',
        skippable: true,
        files: checkpoints.flatMap((c) => c.files.map((f) => toFile(f, "optional"))),
      });
    }
    problems.push({
      id: pid,
      name: topic.label,
      area: AREA_BY_ID[area.id].label,
      summary: `${intent.intent} ${FRAMING_NOTE[topic.mockResult.framing ?? "recovery"]}`,
      steps,
    });
  }
}

const flow: ChatFlow = {
  version: 1,
  head: [
    {
      id: "h-1",
      kind: "user",
      title: "User starts the conversation",
      detail: 'Types a question or picks a prompt from the hero. Example: "My sales don\'t match what I filed in GST."',
      chips: ["Hero prompt", "Suggestion chip", "Recovery CTA"],
    },
    {
      id: "h-2",
      kind: "ai",
      title: "Identify the problem statement",
      detail:
        "DataTwin matches the message to a guided flow by its words. When the message points clearly at one, it goes straight to that flow's understanding card.",
    },
    {
      id: "h-3",
      kind: "choice",
      title: "User chooses the category (only when unclear)",
      detail:
        "If the message doesn't point at a side of GST, DataTwin asks which one. When the message does point at a side, or at one check, this step is skipped and the conversation travels to that category on its own.",
      chips: AREAS.map((a) => a.label),
    },
  ],
  categories: AREAS.filter((a) => problems.some((p) => p.area === a.label)).map((a) => ({
    name: a.label,
    summary: `${a.blurb} The user then picks the closest check below, or goes straight to it when the message was clear.`,
  })),
  problems,
  tail: [
    { id: "t-1", kind: "system", title: "Reconciliation runs", detail: "Documents are matched, differences found, and the impact computed." },
    {
      id: "t-2",
      kind: "gate",
      title: "User form (before the summary)",
      detail: "Name, work email and phone, then an OTP check. Only the top of the summary shows, softly blurred, behind the form.",
    },
    {
      id: "t-3",
      kind: "output",
      title: "Executive summary",
      detail:
        "Headline number, key figures and where they come from. The wording follows the problem statement's result type: recovery, exposure or differences.",
    },
    {
      id: "t-4",
      kind: "output",
      title: "Findings table with the schedule dialog on top",
      detail: "At least six line items with records and priority, blurred. A dialog on top invites the user to schedule a conversation to unlock the detail.",
    },
    {
      id: "t-5",
      kind: "output",
      title: "Improve-accuracy card",
      detail:
        "Documents the user skipped, offered again below the table. Adding any refreshes the result; a plain note says the result is complete without them.",
    },
    { id: "t-6", kind: "user", title: "Schedule a meeting", detail: "Optional next step: book time with the DataTwin team." },
  ],
};

writeFileSync(path.join(process.cwd(), "lib", "playground", "chatflow.json"), `${JSON.stringify(flow, null, 2)}\n`, "utf8");
console.log(`Wrote lib/playground/chatflow.json: ${problems.length} problem statements across ${AREAS.length} areas.`);
