export type FieldKey = "title" | "dept" | "process" | "users" | "systems" | "success";

export type Sensitivity = "Public" | "Internal" | "Confidential" | "Contains PHI or PII";

export type CheckAnswer = "yes" | "no" | null;

/** `evidence` is the POC text, or the uploaded file's name. */
export type CheckState = { answer: CheckAnswer; evidence: string };

export type TopicStatus = "answered" | "followed" | "flagged";

export type ChatMessage = { id: string; from: "ai" | "user"; text: string; tag?: string };

/** Everything the requester has entered. Autosaved as a draft. */
export type RequestDraft = {
  version: 1;
  step: number;
  maxStep: number;
  checks: CheckState[];
  values: Record<FieldKey, string>;
  /** Fields the requester changed after the AI pre-fill (confirmed by them). */
  edited: Partial<Record<FieldKey, boolean>>;
  /** Charter file the current pre-fill was read from. */
  prefilledFrom: string | null;
  sensitivity: Sensitivity;
  /** Index of the current interview topic; equals TOPICS.length when complete. */
  topic: number;
  followUpAsked: boolean;
  answers: Partial<Record<number, TopicStatus>>;
  messages: ChatMessage[];
};

// ---- API contracts (POST /api/requests/*) ----

export type PrefillResponse = {
  values: Record<FieldKey, string>;
  /** 0–1 per field; low values should be checked first. */
  confidence: Record<FieldKey, number>;
};

export type InterviewTurnRequest =
  | { action: "start" }
  | { action: "answer"; topic: number; text: string; followUpAsked: boolean }
  | { action: "flag"; topic: number };

export type InterviewTurnResponse = {
  messages: { text: string; tag?: string }[];
  /** Set when the turn closed the topic. */
  topicStatus?: TopicStatus;
  followUpAsked: boolean;
  nextTopic: number;
  complete: boolean;
};

export type ReviewRequest = {
  checksPassed: number;
  values: Record<FieldKey, string>;
  detailsConfirmed: boolean;
  answers: Partial<Record<number, TopicStatus>>;
};

export type Assignee = "ABA" | "Requester";

export type ReviewResponse = {
  score: number;
  rows: { label: string; pct: number }[];
  platform: "Web app" | "Power Apps";
  rationale: string;
  openQuestions: { text: string; assignee: Assignee }[];
};

export type SubmitRequest = {
  title: string;
  sensitivity: Sensitivity;
  score: number;
};

export type SubmitResponse = { id: string };
