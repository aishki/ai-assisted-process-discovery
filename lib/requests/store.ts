import "server-only";
import { MY_REQUESTS } from "@/lib/kb/data";
import type { KbRequest } from "@/lib/kb/types";
import type { SubmitRequest } from "./types";

// In-memory stand-in for the requests API. Route handlers and pages can load separate
// copies of this module, so the list lives on globalThis to be shared between them.
// Submitted requests last until the server restarts.

const globalStore = globalThis as typeof globalThis & { __bitsRequests?: KbRequest[] };

function requests(): KbRequest[] {
  globalStore.__bitsRequests ??= MY_REQUESTS.map((r) => ({ ...r }));
  return globalStore.__bitsRequests;
}

/** The current user's requests, newest first. */
export async function listRequests(limit?: number): Promise<KbRequest[]> {
  const all = requests();
  return limit === undefined ? [...all] : all.slice(0, limit);
}

export async function findRequest(id: string): Promise<KbRequest | null> {
  return requests().find((r) => r.id === id) ?? null;
}

/** POST /requests/:id/submit: stores the request as Submitted and returns its ID (ATT-###). */
export async function submitRequest(_request: SubmitRequest): Promise<string> {
  const all = requests();
  const highest = all.reduce((max, r) => Math.max(max, Number(r.id.replace(/\D/g, "")) || 0), 0);
  const id = `ATT-${String(highest + 1).padStart(3, "0")}`;
  all.unshift({ id, status: "Submitted" });
  return id;
}
