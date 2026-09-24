import { NextResponse } from "next/server";
import { reviewRequest } from "@/lib/requests/ai";
import { readReview } from "@/lib/requests/validate";

// POST /api/requests/review ReviewRequest → ReviewResponse (all AI output is a draft).
export async function POST(request: Request) {
  const input = readReview(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Invalid review request." }, { status: 400 });
  return NextResponse.json(await reviewRequest(input));
}
