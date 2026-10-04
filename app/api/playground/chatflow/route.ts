import { promises as fs } from "node:fs";
import path from "node:path";
import { isChatFlow } from "@/lib/playground/flow-utils";

// Dev-only: lets the Chat Flow playground write its edits straight into the committed JSON file, so
// "Save" followed by a normal git commit/push shares the change. Disabled in production builds.
const FLOW_FILE = path.join(process.cwd(), "lib", "playground", "chatflow.json");

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Saving to the repo file only works in `next dev`." }, { status: 403 });
  }
  const body: unknown = await request.json().catch(() => null);
  if (!isChatFlow(body)) {
    return Response.json({ error: "Not a valid chat flow document." }, { status: 400 });
  }
  await fs.writeFile(FLOW_FILE, `${JSON.stringify(body, null, 2)}\n`, "utf8");
  return Response.json({ ok: true, file: "lib/playground/chatflow.json" });
}
