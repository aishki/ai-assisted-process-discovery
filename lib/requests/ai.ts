import "server-only";
import { FIELDS, FOLLOW_UP_THRESHOLD, TOPICS } from "./config";
import { readiness, detailsPct } from "./readiness";
import type {
  FieldKey,
  InterviewTurnRequest,
  InterviewTurnResponse,
  PrefillResponse,
  ReviewRequest,
  ReviewResponse,
} from "./types";

// Scripted stand-in for the LLM, matching the prototype. Each function has the input
// and output the real model call should have (see the handoff's "AI integration").

// ---- Pre-fill: charter text → six fields with confidence ----

const SAMPLE_PREFILL: Record<FieldKey, string> = {
  title: "Attendance exception tracker",
  dept: "Operations — Workforce management",
  process:
    "Team leads log attendance exceptions in a shared Excel file, then email them to WFM for validation each shift.",
  users: "About 120 team leads and 8 WFM analysts",
  systems: "Excel, Outlook, Workday (read only)",
  success: "Cut validation time per shift from 45 to 10 minutes",
};

export async function prefillFromCharter(_charterName: string): Promise<PrefillResponse> {
  return {
    values: { ...SAMPLE_PREFILL },
    confidence: Object.fromEntries(FIELDS.map((f) => [f.key, f.key === "users" ? 0.6 : 0.9])) as Record<
      FieldKey,
      number
    >,
  };
}

// ---- Interview: at most one follow-up per topic ----

const QUESTIONS = [
  {
    q: "Walk me through what happens today, from the moment an exception occurs until WFM validates it.",
    fu: "Who records it first, and where does it go next?",
  },
  {
    q: "Who approves an exception, and what happens when one is rejected?",
    fu: "Is there a second approver, or does a rejection go straight back to the team lead?",
  },
  {
    q: "Where does the attendance data come from, and does anything need to write back to Workday?",
    fu: "Is Workday read-only for this tool, or would it need to update records?",
  },
  {
    q: "What are the common edge cases — late logins, split shifts, system outages?",
    fu: "How are system-outage exceptions proven today?",
  },
  {
    q: "Roughly how many exceptions come in per shift, and by when must they be validated?",
    fu: "Is there a hard cut-off time for validation each shift?",
  },
  {
    q: "Six weeks after launch, how will you know this worked?",
    fu: "What is the number today that you want to move?",
  },
];

const ask = (topic: number) => ({ tag: TOPICS[topic], text: QUESTIONS[topic].q });

/** Closes `topic` and moves on: the next question, or the closing line. */
function closeTopic(topic: number, status: "answered" | "followed" | "flagged"): InterviewTurnResponse {
  const next = topic + 1;
  const complete = next >= TOPICS.length;
  return {
    messages: complete
      ? [{ text: "Thanks — that covers all six areas. I have drafted a readiness score and a platform suggestion for you to review." }]
      : [ask(next)],
    topicStatus: status,
    followUpAsked: false,
    nextTopic: next,
    complete,
  };
}

export async function interviewTurn(turn: InterviewTurnRequest): Promise<InterviewTurnResponse> {
  if (turn.action === "start") {
    return {
      messages: [
        {
          text: "Hi — I have read your charter and storyboard. I will ask six short questions where the details are thin. Answer in your own words, and flag anything you are unsure of for the ABA.",
        },
        ask(0),
      ],
      followUpAsked: false,
      nextTopic: 0,
      complete: false,
    };
  }
  if (turn.action === "flag") return closeTopic(turn.topic, "flagged");

  // A thin first answer gets one follow-up; whatever comes back after that is accepted.
  if (!turn.followUpAsked && turn.text.trim().length < FOLLOW_UP_THRESHOLD) {
    return {
      messages: [{ tag: "Follow-up", text: QUESTIONS[turn.topic].fu }],
      followUpAsked: true,
      nextTopic: turn.topic,
      complete: false,
    };
  }
  return closeTopic(turn.topic, turn.followUpAsked ? "followed" : "answered");
}

// ---- Review: scores, open questions, platform ----

export async function reviewRequest(input: ReviewRequest): Promise<ReviewResponse> {
  const { score, rows } = readiness({
    checksPassed: input.checksPassed,
    details: detailsPct(input.values, input.detailsConfirmed),
    answers: input.answers,
  });

  const users = input.values.users ?? "";
  const userCount = (users.match(/\d+/g) ?? []).reduce((sum, n) => sum + Number(n), 0);
  const web = userCount > 500 || /\b(api|sap|external)\b/i.test(input.values.systems ?? "");

  return {
    score,
    rows,
    platform: web ? "Web app" : "Power Apps",
    rationale: web
      ? "User count or integrations go beyond what the Power Platform handles well. A BITS web app gives room for custom logic and scale."
      : `A known user group (${users.trim() || "internal users"}), Microsoft 365 data sources and a form-driven approval flow fit Power Apps with Power Automate.`,
    openQuestions: [
      ...TOPICS.flatMap((_, i) =>
        input.answers[i] === "flagged" ? [{ text: QUESTIONS[i].q, assignee: "ABA" as const }] : [],
      ),
      {
        text: "Assumption: outage exceptions are evidenced by an IT ticket number. Confirm with POC.",
        assignee: "Requester",
      },
    ],
  };
}
