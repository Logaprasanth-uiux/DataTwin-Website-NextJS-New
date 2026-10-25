"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { FileRequirement } from "@/lib/chat/types";
import { MessageTurn } from "./MessageTurn";
import { useScrollIntoViewOnMount } from "./useScrollIntoViewOnMount";

const CONNECTING_MS = 1200;
const PULLING_MS = 1500;

// How a document is pulled from the user's SAP. A mock of the real thing: the choices below are the
// three tiers we would offer, but nothing leaves the browser and no credential is asked for. The real
// connector is set up once with the customer's SAP team (a read-only service user and an outbound
// connection), so no password is typed into the chat — the form only says which system and company
// code to read from.
const SYSTEMS = ["SAP S/4HANA Cloud", "SAP S/4HANA (on-premise)", "SAP ECC", "SAP Business One"] as const;

const METHODS: { id: string; label: string; body: string }[] = [
  {
    id: "connector",
    label: "SAP connector (recommended)",
    body: "A read-only connection through SAP Cloud Connector or a DataTwin agent in your network. It only connects outward, so nothing is opened inbound.",
  },
  {
    id: "extract",
    label: "Scheduled extract",
    body: "Your SAP team drops the standard report in a secure location on a schedule, and we pick it up. Suits older systems.",
  },
];

type LocalPhase = "idle" | "connecting" | "pulling";

// The "Connect SAP" path for a document that comes from the user's ERP — the counterpart of
// PortalFetchFlow. Like it, the animation is transient, component-local state (never persisted), and
// the document lands as "ready" exactly like an upload once it finishes.
export function SapConnectFlow({
  file,
  connected = false,
  onFetchComplete,
  onBack,
}: {
  file: FileRequirement;
  /** True once SAP was already connected for an earlier document: no form again, straight to pulling. */
  connected?: boolean;
  onFetchComplete: (fileName: string) => void;
  /** Back to the upload / fetch choice. */
  onBack: () => void;
}) {
  const [system, setSystem] = useState<string>(SYSTEMS[0]);
  const [method, setMethod] = useState(METHODS[0].id);
  const [companyCode, setCompanyCode] = useState("");
  const [phase, setPhase] = useState<LocalPhase>(connected ? "pulling" : "idle");
  const rootRef = useScrollIntoViewOnMount<HTMLDivElement>();

  const onFetchCompleteRef = useRef(onFetchComplete);
  useEffect(() => {
    onFetchCompleteRef.current = onFetchComplete;
  });

  useEffect(() => {
    if (phase === "connecting") {
      const id = window.setTimeout(() => setPhase("pulling"), CONNECTING_MS);
      return () => window.clearTimeout(id);
    }
    if (phase === "pulling") {
      const id = window.setTimeout(() => onFetchCompleteRef.current(`${file.name} (via SAP)`), PULLING_MS);
      return () => window.clearTimeout(id);
    }
  }, [phase, file.name]);

  const companyCodeValid = /^[0-9A-Z]{4}$/.test(companyCode.trim());

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (companyCodeValid) setPhase("connecting");
  };

  if (phase === "connecting") {
    return (
      <div ref={rootRef} className="flex items-center gap-2.5 text-[13.5px] text-navy-muted">
        <SpinnerIcon className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-accent" />
        Connecting to {system}…
      </div>
    );
  }

  if (phase === "pulling") {
    return (
      <div ref={rootRef}>
        <MessageTurn
          speaker="DataTwin"
          text={connected ? `SAP is already connected. ⚡ Pulling your ${file.name} now...` : `Connected! ⚡ Pulling your ${file.name} from ${system} now...`}
        />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-3">
      <MessageTurn
        speaker="DataTwin"
        text={`Let's pull your ${file.name} straight from SAP, so you don't have to export anything.\n\nTell me which system to read from. Access is read-only and no password is shared in this chat.`}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-navy-muted">SAP system</span>
          <select
            value={system}
            onChange={(event) => setSystem(event.target.value)}
            className="h-12 rounded-xl border border-navy-hairline bg-white px-4 text-[14px] text-navy focus:border-accent focus:outline-none"
          >
            {SYSTEMS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-[12.5px] font-medium text-navy-muted">How to connect</legend>
          {METHODS.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-accent ${
                method === option.id ? "border-accent bg-accent/[0.06]" : "border-navy-hairline"
              }`}
            >
              <input
                type="radio"
                name={`sap-method-${file.fileId}`}
                checked={method === option.id}
                onChange={() => setMethod(option.id)}
                className="mt-1 accent-[var(--accent)]"
              />
              <span>
                <span className="block text-[13.5px] font-semibold text-navy">{option.label}</span>
                <span className="mt-0.5 block text-[12.5px] leading-relaxed text-navy-muted">{option.body}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-navy-muted">Company code</span>
            <input
              type="text"
              value={companyCode}
              onChange={(event) => setCompanyCode(event.target.value.toUpperCase())}
              maxLength={4}
              placeholder="1000"
              autoComplete="off"
              className="h-12 rounded-xl border border-navy-hairline bg-white px-4 font-mono text-[14px] tracking-wide text-navy placeholder:font-sans placeholder:text-navy-faint focus:border-accent focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={!companyCodeValid}
            className="dt-button h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Connect SAP
          </button>
        </div>
      </form>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className="text-[12px] text-navy-faint">Read-only access to posted documents. Nothing is written back to SAP.</p>
        <button
          type="button"
          onClick={onBack}
          className="text-[12.5px] font-medium text-navy-muted underline decoration-navy-hairline underline-offset-4 transition-colors hover:text-navy"
        >
          Choose another way
        </button>
      </div>
    </div>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
