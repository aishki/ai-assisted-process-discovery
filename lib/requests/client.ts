import type {
  InterviewTurnRequest,
  InterviewTurnResponse,
  PrefillResponse,
  ReviewRequest,
  ReviewResponse,
  SubmitRequest,
  SubmitResponse,
} from "./types";

async function post<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`${url} failed with ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  prefill: (charterName: string, signal?: AbortSignal) =>
    post<PrefillResponse>("/api/requests/prefill", { charterName }, signal),
  interview: (turn: InterviewTurnRequest, signal?: AbortSignal) =>
    post<InterviewTurnResponse>("/api/requests/interview", turn, signal),
  review: (input: ReviewRequest, signal?: AbortSignal) => post<ReviewResponse>("/api/requests/review", input, signal),
  submit: (input: SubmitRequest) => post<SubmitResponse>("/api/requests/submit", input),
};

export const isAbort = (err: unknown) => err instanceof DOMException && err.name === "AbortError";
