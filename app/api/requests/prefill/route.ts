import { NextResponse } from "next/server";
import { prefillFromCharter } from "@/lib/requests/ai";
import { readCharterName } from "@/lib/requests/validate";

// POST /api/requests/prefill { charterName } → PrefillResponse
// Production: extract the charter and storyboard text, then call the LLM with the field schema.
export async function POST(request: Request) {
  const charterName = readCharterName(await request.json().catch(() => null));
  if (!charterName) return NextResponse.json({ error: "charterName is required." }, { status: 400 });
  return NextResponse.json(await prefillFromCharter(charterName));
}
