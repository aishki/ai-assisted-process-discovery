"use client";

import { useCallback, useMemo, useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { api } from "@/lib/requests/client";
import { CHARTER_CHECK } from "@/lib/requests/config";
import { detailsPct, readiness } from "@/lib/requests/readiness";
import type {
  CheckState,
  ChatMessage,
  FieldKey,
  InterviewTurnRequest,
  InterviewTurnResponse,
  PrefillResponse,
  ReviewResponse,
  Sensitivity,
} from "@/lib/requests/types";
import { Confirmation } from "./Confirmation";
import { RequestHeader } from "./RequestHeader";
import { RequestRail } from "./RequestRail";
import { Stepper } from "./Stepper";
import { DetailsStep } from "./steps/DetailsStep";
import { InterviewStep } from "./steps/InterviewStep";
import { QualificationStep } from "./steps/QualificationStep";
import { ReviewStep } from "./steps/ReviewStep";
import { deriveDraft, useRequestDraft } from "./useRequestDraft";
import styles from "./RequestFlow.module.css";

/** What the rail keeps showing after the draft is cleared on submit. */
type Submitted = { id: string; score: number; answeredCount: number; openQuestions: number };

let messageSeq = 0;
const messageId = () => `${Date.now().toString(36)}-${(messageSeq++).toString(36)}`;

export function RequestFlow({ initials }: { initials: string }) {
  const { draft, savedAt, saveFailed, hydrated, update, saveNow, reset } = useRequestDraft();
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const [reviewOpenCount, setReviewOpenCount] = useState<number | null>(null);

  const d = deriveDraft(draft);
  const details = detailsPct(draft.values, draft.maxStep >= 2);
  const { score } = readiness({ checksPassed: d.checksPassed, details, answers: draft.answers });

  // ---- step navigation ----
  const goTo = useCallback(
    (step: number) => update((s) => ({ ...s, step, maxStep: Math.max(s.maxStep, step) })),
    [update],
  );

  // ---- step 1 ----
  const setCheck = useCallback(
    (index: number, patch: Partial<CheckState>) =>
      update((s) => ({ ...s, checks: s.checks.map((c, i) => (i === index ? { ...c, ...patch } : c)) })),
    [update],
  );

  // ---- step 2 ----
  const applyPrefill = useCallback(
    (result: PrefillResponse, source: string) =>
      update((s) => {
        // Never overwrite what the requester has already confirmed.
        const values = { ...s.values };
        for (const key of Object.keys(result.values) as FieldKey[]) {
          if (!s.edited[key]) values[key] = result.values[key];
        }
        return { ...s, values, prefilledFrom: source };
      }),
    [update],
  );
  const editField = useCallback(
    (key: FieldKey, value: string) =>
      update((s) => ({ ...s, values: { ...s.values, [key]: value }, edited: { ...s.edited, [key]: true } })),
    [update],
  );
  const setSensitivity = useCallback((value: Sensitivity) => update((s) => ({ ...s, sensitivity: value })), [update]);

  // ---- step 3 ----
  const addUserMessage = useCallback(
    (text: string) =>
      update((s) => ({ ...s, messages: [...s.messages, { id: messageId(), from: "user", text } satisfies ChatMessage] })),
    [update],
  );
  const applyTurn = useCallback(
    (response: InterviewTurnResponse, turn: InterviewTurnRequest) =>
      update((s) => ({
        ...s,
        messages: [
          ...s.messages,
          ...response.messages.map((m): ChatMessage => ({ id: messageId(), from: "ai", text: m.text, tag: m.tag })),
        ],
        topic: response.nextTopic,
        followUpAsked: response.followUpAsked,
        answers:
          response.topicStatus && turn.action !== "start"
            ? { ...s.answers, [turn.topic]: response.topicStatus }
            : s.answers,
      })),
    [update],
  );

  // ---- step 4 ----
  const onReviewed = useCallback((r: ReviewResponse) => setReviewOpenCount(r.openQuestions.length), []);
  const reviewInput = useMemo(
    () => ({
      checksPassed: d.checksPassed,
      values: draft.values,
      detailsConfirmed: draft.maxStep >= 2,
      answers: draft.answers,
    }),
    [d.checksPassed, draft.values, draft.maxStep, draft.answers],
  );
  const openQuestions = draft.step === 3 && reviewOpenCount !== null ? reviewOpenCount : d.flaggedCount;
  const submit = useCallback(
    async (finalScore: number) => {
      const { id } = await api.submit({ title: draft.values.title, sensitivity: draft.sensitivity, score: finalScore });
      setSubmitted({ id, score: finalScore, answeredCount: d.answeredCount, openQuestions });
      reset();
    },
    [draft.values.title, draft.sensitivity, d.answeredCount, openQuestions, reset],
  );

  const restart = useCallback(() => {
    setSubmitted(null);
    setReviewOpenCount(null);
    reset();
  }, [reset]);

  const charterName = draft.checks[CHARTER_CHECK].evidence || "your charter";
  // A restored draft may point past a step that no longer holds (e.g. evidence removed).
  const step = d.canReach(draft.step) ? draft.step : 0;

  return (
    <div className={styles.shell}>
      <RequestHeader
        initials={initials}
        submitted={submitted !== null}
        savedAt={savedAt}
        saveFailed={saveFailed}
        onSave={saveNow}
      />
      <ThreeColumnLayout
        mainClassName={styles.main}
        left={
          <Stepper
            current={step}
            maxStep={draft.maxStep}
            submitted={submitted !== null}
            canReach={d.canReach}
            onGo={goTo}
          />
        }
        right={
          <RequestRail
            score={submitted?.score ?? score}
            checksPassed={submitted ? 4 : d.checksPassed}
            answeredCount={submitted?.answeredCount ?? d.answeredCount}
            openQuestions={submitted?.openQuestions ?? openQuestions}
            step={submitted ? 3 : step}
          />
        }
      >
        {!hydrated ? (
          <p className={styles.loading}>Loading your draft…</p>
        ) : submitted ? (
          <Confirmation id={submitted.id} onRestart={restart} />
        ) : step === 0 ? (
          <QualificationStep checks={draft.checks} onChange={setCheck} onContinue={() => goTo(1)} />
        ) : step === 1 ? (
          <DetailsStep
            draft={draft}
            charterName={charterName}
            onPrefill={applyPrefill}
            onEdit={editField}
            onSensitivity={setSensitivity}
            onBack={() => goTo(0)}
            onNext={() => goTo(2)}
          />
        ) : step === 2 ? (
          <InterviewStep draft={draft} onUserMessage={addUserMessage} onTurn={applyTurn} onNext={() => goTo(3)} />
        ) : (
          <ReviewStep
            title={draft.values.title}
            input={reviewInput}
            onReviewed={onReviewed}
            onBack={() => goTo(2)}
            onSubmit={submit}
          />
        )}
      </ThreeColumnLayout>
    </div>
  );
}
