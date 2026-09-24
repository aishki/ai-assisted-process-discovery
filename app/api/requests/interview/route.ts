import { NextResponse } from "next/server";
import { interviewTurn } from "@/lib/requests/ai";
import { readTurn } from "@/lib/requests/validate";

// POST /api/requests/interview InterviewTurnRequest → InterviewTurnResponse
// Production: send the topic, question, answer and charter context to the LLM.
export async function POST(request: Request) {
  const turn = readTurn(await request.json().catch(() => null));
  if (!turn) return NextResponse.json({ error: "Invalid interview turn." }, { status: 400 });
  return NextResponse.json(await interviewTurn(turn));
}
