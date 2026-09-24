import { NextResponse } from "next/server";
import { submitRequest } from "@/lib/requests/store";
import { readSubmit } from "@/lib/requests/validate";

// POST /api/requests/submit SubmitRequest → { id } with the status set to Submitted.
export async function POST(request: Request) {
  const input = readSubmit(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  return NextResponse.json({ id: await submitRequest(input) }, { status: 201 });
}
