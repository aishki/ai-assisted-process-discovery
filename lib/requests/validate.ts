import { FIELDS, SENSITIVITY, TOPICS } from "./config";
import type { FieldKey, InterviewTurnRequest, ReviewRequest, Sensitivity, SubmitRequest, TopicStatus } from "./types";

// Request-body guards for the /api/requests/* routes. Each returns the typed body or null.

type Json = Record<string, unknown>;

const isObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);
const isTopic = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0 && (v as number) < TOPICS.length;
const STATUSES: TopicStatus[] = ["answered", "followed", "flagged"];

function readValues(v: unknown): Record<FieldKey, string> | null {
  if (!isObject(v)) return null;
  const out = {} as Record<FieldKey, string>;
  for (const { key } of FIELDS) {
    const value = v[key];
    if (typeof value !== "string" || value.length > 2000) return null;
    out[key] = value;
  }
  return out;
}

function readAnswers(v: unknown): Partial<Record<number, TopicStatus>> | null {
  if (!isObject(v)) return null;
  const out: Partial<Record<number, TopicStatus>> = {};
  for (const [k, status] of Object.entries(v)) {
    const topic = Number(k);
    if (!isTopic(topic) || !STATUSES.includes(status as TopicStatus)) return null;
    out[topic] = status as TopicStatus;
  }
  return out;
}

export function readTurn(body: unknown): InterviewTurnRequest | null {
  if (!isObject(body)) return null;
  if (body.action === "start") return { action: "start" };
  if (body.action === "flag" && isTopic(body.topic)) return { action: "flag", topic: body.topic };
  if (
    body.action === "answer" &&
    isTopic(body.topic) &&
    typeof body.text === "string" &&
    body.text.trim().length > 0 &&
    body.text.length <= 4000 &&
    typeof body.followUpAsked === "boolean"
  ) {
    return { action: "answer", topic: body.topic, text: body.text, followUpAsked: body.followUpAsked };
  }
  return null;
}

export function readReview(body: unknown): ReviewRequest | null {
  if (!isObject(body)) return null;
  const values = readValues(body.values);
  const answers = readAnswers(body.answers);
  const checksPassed = body.checksPassed;
  if (!values || !answers || typeof body.detailsConfirmed !== "boolean") return null;
  if (!Number.isInteger(checksPassed) || (checksPassed as number) < 0 || (checksPassed as number) > 4) return null;
  return { values, answers, checksPassed: checksPassed as number, detailsConfirmed: body.detailsConfirmed };
}

export function readSubmit(body: unknown): SubmitRequest | null {
  if (!isObject(body)) return null;
  const { title, sensitivity, score } = body;
  if (typeof title !== "string" || !title.trim() || title.length > 200) return null;
  if (!SENSITIVITY.includes(sensitivity as Sensitivity)) return null;
  if (typeof score !== "number" || score < 0 || score > 100) return null;
  return { title: title.trim(), sensitivity: sensitivity as Sensitivity, score };
}

export function readCharterName(body: unknown): string | null {
  if (!isObject(body) || typeof body.charterName !== "string") return null;
  const name = body.charterName.trim();
  return name && name.length <= 255 ? name : null;
}
