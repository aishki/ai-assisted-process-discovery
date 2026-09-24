"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CHECKS, checkPassed, FIELDS, TOPICS } from "@/lib/requests/config";
import type { FieldKey, RequestDraft } from "@/lib/requests/types";

// Drafts autosave to this browser until PATCH /requests/:id exists. Uploaded files are
// not stored — only their names — so a restored draft keeps the evidence labels.
const STORAGE_KEY = "bits.request-draft.v1";
const AUTOSAVE_MS = 800;

type Stored = { draft: RequestDraft; savedAt: string };

const emptyValues = () => Object.fromEntries(FIELDS.map((f) => [f.key, ""])) as Record<FieldKey, string>;

export const blankDraft = (): RequestDraft => ({
  version: 1,
  step: 0,
  maxStep: 0,
  checks: CHECKS.map(() => ({ answer: null, evidence: "" })),
  values: emptyValues(),
  edited: {},
  prefilledFrom: null,
  sensitivity: "Internal",
  topic: 0,
  followUpAsked: false,
  answers: {},
  messages: [],
});

function load(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    const d = parsed.draft;
    if (!d || d.version !== 1 || !Array.isArray(d.checks) || d.checks.length !== CHECKS.length) return null;
    return {
      draft: { ...blankDraft(), ...d, values: { ...emptyValues(), ...d.values } },
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
    };
  } catch {
    return null;
  }
}

function store(value: Stored): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function clear() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: nothing to clear.
  }
}

const timeLabel = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** Derived facts every step needs. */
export function deriveDraft(d: RequestDraft) {
  const checksPassed = d.checks.filter((c, i) => checkPassed(i, c)).length;
  const detailsComplete = FIELDS.every((f) => d.values[f.key].trim().length > 0);
  const interviewComplete = d.topic >= TOPICS.length;
  const answeredCount = Object.values(d.answers).filter((a) => a && a !== "flagged").length;
  const flaggedCount = Object.values(d.answers).filter((a) => a === "flagged").length;
  const gatePassed = checksPassed === CHECKS.length;

  /** A step is reachable once visited, as long as everything before it still holds. */
  const canReach = (step: number) => {
    if (step > d.maxStep) return false;
    if (step >= 1 && !gatePassed) return false;
    if (step >= 2 && !detailsComplete) return false;
    if (step >= 3 && !interviewComplete) return false;
    return true;
  };

  return { checksPassed, detailsComplete, interviewComplete, answeredCount, flaggedCount, gatePassed, canReach };
}

export function useRequestDraft() {
  const [initial] = useState(blankDraft);
  const [draft, setDraft] = useState<RequestDraft>(initial);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  /** The draft object last written to storage; autosave skips when unchanged, so an untouched blank draft is never saved. */
  const lastSaved = useRef<RequestDraft | null>(initial);

  // Restore after mount; localStorage does not exist during server rendering.
  useEffect(() => {
    const saved = load();
    if (saved) {
      lastSaved.current = saved.draft;
      setDraft(saved.draft);
      setSavedAt(saved.savedAt || null);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((d: RequestDraft) => {
    const at = timeLabel();
    setSaveFailed(!store({ draft: d, savedAt: at }));
    lastSaved.current = d;
    setSavedAt(at);
  }, []);

  // Autosave shortly after each change.
  useEffect(() => {
    if (!hydrated || draft === lastSaved.current) return;
    const t = window.setTimeout(() => persist(draft), AUTOSAVE_MS);
    return () => window.clearTimeout(t);
  }, [draft, hydrated, persist]);

  const update = useCallback((fn: (d: RequestDraft) => RequestDraft) => setDraft(fn), []);

  const saveNow = useCallback(() => persist(draft), [draft, persist]);

  /** Drops the stored draft, e.g. after submitting. */
  const reset = useCallback(() => {
    clear();
    const blank = blankDraft();
    lastSaved.current = blank;
    setDraft(blank);
    setSavedAt(null);
    setSaveFailed(false);
  }, []);

  return { draft, savedAt, saveFailed, hydrated, update, saveNow, reset };
}
