"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { FileRequirement, SapConnection } from "@/lib/chat/types";
import { MessageTurn } from "./MessageTurn";
import { useScrollIntoViewOnMount } from "./useScrollIntoViewOnMount";

const CONNECTING_MS = 1300;
const PULLING_MS = 1500;

// SAP is connected once, up front (SapConnectPanel), and the documents that come from it are then
// fetched with one click (SapFetchFlow). Both are mocks: nothing leaves the browser. The fields are
// what a real connection needs for each kind of SAP system, so the demo shows the right questions;
// the password is typed into a masked field and thrown away, never stored or shown (same convention
// as the GST Portal OTP). In the real product the SAP admin would enter these once in a protected
// setup, with a dedicated read-only user, and the chat would only show the connected state.

interface Field {
  id: string;
  label: string;
  placeholder: string;
  secret?: boolean;
  mono?: boolean;
  upper?: boolean;
  maxLength?: number;
  pattern?: RegExp;
  optional?: boolean;
}

const API_HOST: Field = { id: "host", label: "API host", placeholder: "https://my123456-api.s4hana.cloud.sap", pattern: /^\S{4,}$/ };
const SERVICE_USER: Field = { id: "user", label: "Communication user", placeholder: "DATATWIN_READ", pattern: /^\S{2,}$/ };
const PASSWORD: Field = { id: "password", label: "Password", placeholder: "", secret: true, pattern: /^.{1,}$/ };
const COMPANY_CODE: Field = { id: "company", label: "Company code", placeholder: "1000", mono: true, upper: true, maxLength: 4, pattern: /^[0-9A-Z]{4}$/ };
const CLIENT: Field = { id: "client", label: "SAP client", placeholder: "100", mono: true, maxLength: 3, pattern: /^\d{3}$/ };

const SYSTEMS: Record<string, { fields: Field[]; detail: string }> = {
  "SAP S/4HANA Cloud": { fields: [API_HOST, SERVICE_USER, PASSWORD, COMPANY_CODE], detail: "company" },
  "SAP S/4HANA (on-premise)": {
    fields: [
      { id: "host", label: "Virtual host and port", placeholder: "s4hana.internal:443", pattern: /^\S{4,}$/ },
      CLIENT,
      { ...SERVICE_USER, label: "SAP user" },
      PASSWORD,
      COMPANY_CODE,
      { id: "location", label: "Location ID", placeholder: "Only if you have several connectors", optional: true },
    ],
    detail: "company",
  },
  "SAP ECC": {
    fields: [
      { id: "host", label: "Application server host", placeholder: "sap-ecc.internal", pattern: /^\S{3,}$/ },
      { id: "sysnr", label: "System number", placeholder: "00", mono: true, maxLength: 2, pattern: /^\d{2}$/ },
      CLIENT,
      { ...SERVICE_USER, label: "SAP user" },
      PASSWORD,
      COMPANY_CODE,
    ],
    detail: "company",
  },
  "SAP Business One": {
    fields: [
      { id: "host", label: "Service Layer URL", placeholder: "https://b1-server:50000", pattern: /^\S{4,}$/ },
      { id: "db", label: "Company database", placeholder: "SBO_COMPANY", mono: true, pattern: /^\S{2,}$/ },
      { ...SERVICE_USER, label: "User name" },
      PASSWORD,
    ],
    detail: "db",
  },
};
const SYSTEM_NAMES = Object.keys(SYSTEMS);

const METHODS: { id: SapConnection["method"]; label: string; body: string }[] = [
  {
    id: "connector",
    label: "SAP connector (recommended)",
    body: "A read-only connection through SAP Cloud Connector or a DataTwin agent in your network. It only connects outward, so nothing is opened inbound.",
  },
  {
    id: "extract",
    label: "Scheduled extract",
    body: "Your SAP team drops the standard report in a secure folder on a schedule, and we pick it up. Suits older systems.",
  },
];

const EXTRACT_FIELDS: Field[] = [
  { id: "folder", label: "Secure folder (SFTP)", placeholder: "sftp.example.com/datatwin", pattern: /^\S{4,}$/ },
  COMPANY_CODE,
];

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy placeholder:text-navy-faint focus:border-accent focus:outline-none";

// The one-time "connect your SAP" step: the SAP system, how to connect, and what that system needs.
export function SapConnectPanel({
  connection,
  onConnect,
  onDisconnect,
}: {
  connection: SapConnection | null;
  onConnect: (connection: SapConnection) => void;
  onDisconnect: () => void;
}) {
  const [skipped, setSkipped] = useState(false);
  const [system, setSystem] = useState(SYSTEM_NAMES[0]);
  const [method, setMethod] = useState<SapConnection["method"]>("connector");
  const [values, setValues] = useState<Record<string, string>>({});
  const [connecting, setConnecting] = useState(false);
  const rootRef = useScrollIntoViewOnMount<HTMLDivElement>();

  const onConnectRef = useRef(onConnect);
  useEffect(() => {
    onConnectRef.current = onConnect;
  });

  const spec = SYSTEMS[system];
  const fields = method === "extract" && system !== "SAP Business One" ? EXTRACT_FIELDS : spec.fields;
  const valid = fields.every((f) => f.optional || (f.pattern ? f.pattern.test((values[f.id] ?? "").trim()) : Boolean(values[f.id]?.trim())));
  const detailField = method === "extract" && system !== "SAP Business One" ? "company" : spec.detail;
  const detailLabel = fields.find((f) => f.id === detailField)?.label.toLowerCase() ?? "company";

  useEffect(() => {
    if (!connecting) return;
    const id = window.setTimeout(() => {
      onConnectRef.current({ system, method, detail: `${detailLabel} ${(values[detailField] ?? "").trim()}` });
    }, CONNECTING_MS);
    return () => window.clearTimeout(id);
    // The values are read once, when the timer fires; changing them mid-connect isn't possible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connecting]);

  if (connection) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-3.5">
        <p className="flex items-center gap-2.5 text-[13.5px] text-navy">
          <span aria-hidden="true" className="h-2 w-2 flex-shrink-0 rounded-full bg-[#3d8b6e]" />
          <span>
            <span className="font-semibold">SAP connected</span> · {connection.system} · {connection.detail}
          </span>
        </p>
        <button
          type="button"
          onClick={onDisconnect}
          className="text-[12.5px] font-medium text-navy-muted underline decoration-navy-hairline underline-offset-4 transition-colors hover:text-navy"
        >
          Change
        </button>
      </div>
    );
  }

  if (skipped) {
    return (
      <button
        type="button"
        onClick={() => setSkipped(false)}
        className="w-fit rounded-full bg-navy/[0.07] px-5 py-2.5 text-[13.5px] font-medium text-navy transition-colors hover:bg-navy/[0.12]"
      >
        Connect SAP to fetch these documents
      </button>
    );
  }

  if (connecting) {
    return (
      <div ref={rootRef} className="flex items-center gap-2.5 text-[13.5px] text-navy-muted">
        <SpinnerIcon className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-accent" />
        Connecting to {system}…
      </div>
    );
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (valid) setConnecting(true);
  };

  return (
    <div ref={rootRef} className="flex flex-col gap-3">
      <MessageTurn
        speaker="DataTwin"
        text={
          "Some of these documents come from your SAP. Connect it once and I can fetch them for you, so you don't have to export anything.\n\nAccess is read-only. Use a dedicated read-only SAP user, and nothing is written back."
        }
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-navy-hairline bg-white p-5 shadow-soft">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-navy-muted">SAP system</span>
          <select
            value={system}
            onChange={(event) => {
              setSystem(event.target.value);
              setValues({});
            }}
            className="h-11 w-full rounded-lg border border-navy-hairline bg-white px-3.5 text-[14px] text-navy focus:border-accent focus:outline-none"
          >
            {SYSTEM_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        {system !== "SAP Business One" && (
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
                  name="sap-method"
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
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.id} className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-navy-muted">
                {field.label}
                {field.optional ? " (optional)" : ""}
              </span>
              <input
                type={field.secret ? "password" : "text"}
                value={values[field.id] ?? ""}
                onChange={(event) => {
                  const next = field.upper ? event.target.value.toUpperCase() : event.target.value;
                  setValues((prev) => ({ ...prev, [field.id]: next }));
                }}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                autoComplete={field.secret ? "new-password" : "off"}
                className={`${INPUT_CLASS} ${field.mono ? "font-mono tracking-wide placeholder:font-sans" : ""}`}
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="submit"
            disabled={!valid}
            className="dt-button h-12 rounded-full bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Connect SAP
          </button>
          <button
            type="button"
            onClick={() => setSkipped(true)}
            className="text-[13px] font-medium text-navy-muted underline decoration-navy-hairline underline-offset-4 transition-colors hover:text-navy"
          >
            Skip, I&apos;ll upload files
          </button>
        </div>
      </form>
      <p className="text-[12px] text-navy-faint">
        Your password is used only to open this connection and is never stored or shown. Nothing is written back to SAP.
      </p>
    </div>
  );
}

// The "Fetch from SAP" path for one document, once SAP is connected: straight to pulling, no form.
// It shows as a short status line inside the document's own card (see FileRequirementCard's
// `inlineFlow`), and like PortalFetchFlow the animation is transient, component-local state. The
// document lands as "ready", exactly like an upload, once it finishes.
export function SapFetchFlow({
  file,
  connection,
  onFetchComplete,
}: {
  file: FileRequirement;
  connection: SapConnection;
  onFetchComplete: (fileName: string) => void;
}) {
  const onFetchCompleteRef = useRef(onFetchComplete);
  useEffect(() => {
    onFetchCompleteRef.current = onFetchComplete;
  });
  useEffect(() => {
    const id = window.setTimeout(() => onFetchCompleteRef.current(`${file.name} (via SAP)`), PULLING_MS);
    return () => window.clearTimeout(id);
  }, [file.name]);

  return (
    <div className="flex items-center gap-2.5 text-[13px] text-navy-muted">
      <SpinnerIcon className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-accent" />
      Fetching from {connection.system}…
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
