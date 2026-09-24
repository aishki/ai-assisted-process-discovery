import { BRAINWAVE_HREF, CHECKLIST_HREF, kbPageHref, TEMPLATES_HREF } from "@/lib/routes";
import type { CheckState, FieldKey, Sensitivity } from "./types";

export type CheckConfig = {
  title: string;
  description: string;
  kind: "file" | "text";
  /** Template or guide offered on "Not yet". */
  template: string;
  templateHref: string;
  /** External place to act on the check, offered on "Not yet" before the template. */
  action?: { label: string; href: string };
  placeholder?: string;
  accept?: string;
  fileHint?: string;
};

export const CHECKS: CheckConfig[] = [
  {
    title: "Brainwave submission at Project status",
    description:
      "Upload a screenshot showing your Brainwave submission at Project status. It reaches Project after Submitted, IC Review, Champion Review and BITS Review.",
    kind: "file",
    template: "Brainwave submission guide",
    templateHref: kbPageHref("start-here", "brainwave-submission-guide"),
    action: { label: "Open Brainwave", href: BRAINWAVE_HREF },
    accept: ".png,.jpg,.jpeg,image/png,image/jpeg",
    fileHint: "Choose a screenshot (.png, .jpg)",
  },
  {
    title: "Project charter",
    description: "Upload the charter. We will read it to pre-fill your project details.",
    kind: "file",
    template: "project charter template",
    templateHref: TEMPLATES_HREF,
    accept: ".docx,.pdf,.pptx",
    fileHint: "Choose a file (.docx, .pdf, .pptx)",
  },
  {
    title: "POC identified",
    description: "Name the process owner who will answer follow-up questions.",
    kind: "text",
    placeholder: "Full name and email",
    template: "Before you request checklist",
    templateHref: CHECKLIST_HREF,
  },
];

export const CHARTER_CHECK = 1;
export const POC_CHECK = 2;
export const MAX_UPLOAD_MB = 25;

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;

/** Why a check's evidence is not acceptable yet, or null when it passes. */
export function evidenceProblem(index: number, check: CheckState): string | null {
  if (check.answer !== "yes") return null;
  const value = check.evidence.trim();
  if (!value) return null;
  if (index === POC_CHECK && !EMAIL.test(value)) return "Add the POC’s email address too.";
  return null;
}

export const checkPassed = (index: number, check: CheckState) =>
  check.answer === "yes" && check.evidence.trim().length > 0 && evidenceProblem(index, check) === null;

export const FIELDS: { key: FieldKey; label: string; rows: number; wide?: boolean }[] = [
  { key: "title", label: "Project title", rows: 1 },
  { key: "dept", label: "Department", rows: 1 },
  { key: "process", label: "Current process", rows: 3, wide: true },
  { key: "users", label: "Users", rows: 2 },
  { key: "systems", label: "Systems involved", rows: 2 },
  { key: "success", label: "Success measure", rows: 2, wide: true },
];

export const SENSITIVITY: Sensitivity[] = ["Public", "Internal", "Confidential", "Contains PHI or PII"];

export const TOPICS = [
  "Current process",
  "Approvals",
  "Data and systems",
  "Exceptions",
  "Volume and timing",
  "Success measure",
];

/** Answers shorter than this get one follow-up question. */
export const FOLLOW_UP_THRESHOLD = 40;

export const STEPS = [
  { title: "Qualification", sub: "Three checks with evidence" },
  { title: "Project details", sub: "Pre-filled from your charter" },
  { title: "AI interview", sub: "Follow-ups on thin answers" },
  { title: "Review and submit", sub: "Readiness and platform" },
];

export const TIPS = [
  {
    title: "Why evidence?",
    body: "A yes without the charter is how requests arrive premature. Attaching it here also lets AI pre-fill the next step.",
  },
  {
    title: "Check the pre-fill",
    body: "AI reads your charter, but you own the answer. Anything you edit is marked as confirmed by you.",
  },
  {
    title: "Short answers get follow-ups",
    body: "If an answer is thin, the AI asks one more question. Flag anything you do not know — the ABA picks it up.",
  },
  {
    title: "Nothing is final yet",
    body: "The score and platform are drafts. A BITS reviewer validates them before ABA and manager review.",
  },
];

export const STATUS_TRAIL = ["Draft", "Submitted", "AI review", "Needs info", "ABA / manager review", "Approved"];

export const HELP_LINKS = [
  { label: "Before you request checklist", href: CHECKLIST_HREF },
  { label: "Templates library", href: TEMPLATES_HREF },
];
