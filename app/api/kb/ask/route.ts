import { NextResponse } from "next/server";
import { ask } from "@/lib/kb/queries";

const MAX_QUESTION_LENGTH = 300;

// POST /api/kb/ask { question } → KbAskResponse. Swap `ask` for the real service later.
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const question =
    body && typeof body === "object" && "question" in body && typeof body.question === "string"
      ? body.question.trim()
      : "";

  if (!question || question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Ask a question of 1 to ${MAX_QUESTION_LENGTH} characters.` },
      { status: 400 },
    );
  }

  return NextResponse.json(await ask(question));
}
