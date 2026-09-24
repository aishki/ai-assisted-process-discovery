import { TOPICS } from "./config";
import type { FieldKey, TopicStatus } from "./types";

// Prototype formula, shared by the live rail and POST /api/requests/review:
//   qualification 25 × passed/4 + details 25 × completeness + interview 50 × topic average,
//   where an answered or followed-up topic scores 100 and a flagged one 40.

const TOPIC_SCORE: Record<TopicStatus, number> = { answered: 100, followed: 100, flagged: 40 };

export const topicPct = (status: TopicStatus | undefined) => (status ? TOPIC_SCORE[status] : 0);

/** Share of filled fields; full marks only once the requester has moved past the step. */
export function detailsPct(values: Record<FieldKey, string>, confirmed: boolean): number {
  const all = Object.values(values);
  const filled = all.filter((v) => v.trim().length > 0).length;
  return Math.round((filled / all.length) * (confirmed ? 100 : 80));
}

export function readiness(input: {
  checksPassed: number;
  details: number;
  answers: Partial<Record<number, TopicStatus>>;
}) {
  const qualification = input.checksPassed * 25;
  const topics = TOPICS.map((label, i) => ({ label, pct: topicPct(input.answers[i]) }));
  const interviewAvg = topics.reduce((sum, t) => sum + t.pct, 0) / TOPICS.length;
  const score = Math.round(qualification * 0.25 + input.details * 0.25 + interviewAvg * 0.5);
  return {
    score,
    rows: [
      { label: "Qualification", pct: qualification },
      { label: "Project details", pct: input.details },
      ...topics,
    ],
  };
}
