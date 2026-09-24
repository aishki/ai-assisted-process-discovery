"use client";

import { useCallback, useEffect, useState } from "react";
import { PurpleButton } from "@/components/ui/PurpleButton";
import { api, isAbort } from "@/lib/requests/client";
import type { ReviewRequest, ReviewResponse } from "@/lib/requests/types";
import { ProgressBar } from "../ProgressBar";
import { StepHeading } from "../StepHeading";
import styles from "./ReviewStep.module.css";

type Props = {
  title: string;
  input: ReviewRequest;
  onReviewed: (review: ReviewResponse) => void;
  onBack: () => void;
  onSubmit: (score: number) => Promise<void>;
};

const STRONG = 80;

export function ReviewStep({ title, input, onReviewed, onBack, onSubmit }: Props) {
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const inputKey = JSON.stringify(input);

  const load = useCallback(
    (signal?: AbortSignal) => {
      setLoadError(false);
      api
        .review(JSON.parse(inputKey) as ReviewRequest, signal)
        .then((r) => {
          setReview(r);
          onReviewed(r);
        })
        .catch((err) => {
          if (isAbort(err)) return;
          console.error("Review failed", err);
          setLoadError(true);
        });
    },
    [inputKey, onReviewed],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const submit = async () => {
    if (!review) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      await onSubmit(review.score);
    } catch (err) {
      console.error("Submit failed", err);
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  return (
    <>
      <StepHeading step={3} title={title || "Your request"} />

      {loadError && (
        <div className={styles.errorBox} role="alert">
          <p>We couldn’t draft your review.</p>
          <button type="button" onClick={() => load()}>
            Try again
          </button>
        </div>
      )}

      {!review && !loadError && (
        <p className={styles.loading} aria-live="polite">
          Drafting your readiness score and platform suggestion…
        </p>
      )}

      {review && (
        <div className={styles.grid}>
          <section className={styles.readiness} aria-labelledby="review-readiness">
            <div className={styles.overall}>
              <span className={styles.score}>{review.score}%</span>
              <h2 id="review-readiness" className={styles.cardTitle}>
                Readiness
              </h2>
            </div>
            <ul className={styles.rows}>
              {review.rows.map((r) => {
                const strong = r.pct >= STRONG;
                return (
                  <li key={r.label} className={styles.row}>
                    <div className={styles.rowHead}>
                      <span>{r.label}</span>
                      <span className={`${styles.rowPct} ${strong ? styles.strong : ""}`}>{r.pct}%</span>
                    </div>
                    <ProgressBar value={r.pct} label={r.label} tone={strong ? "purple" : "amber"} />
                  </li>
                );
              })}
            </ul>
          </section>

          <div className={styles.side}>
            <section className={styles.platform} aria-labelledby="review-platform">
              <h2 id="review-platform" className={styles.platformLabel}>
                Suggested platform · AI draft
              </h2>
              <span className={styles.platformName}>{review.platform}</span>
              <p className={styles.platformWhy}>{review.rationale}</p>
            </section>

            <section className={styles.questions} aria-labelledby="review-questions">
              <h2 id="review-questions" className={styles.cardTitle}>
                Open questions · {review.openQuestions.length}
              </h2>
              <ul className={styles.qList}>
                {review.openQuestions.map((q) => (
                  <li key={q.text} className={styles.q}>
                    <span className={styles.qText}>{q.text}</span>
                    <span className={`${styles.who} ${q.assignee === "ABA" ? styles.aba : styles.requester}`}>
                      {q.assignee}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}

      <div className={styles.guardrail}>
        <strong>Draft only</strong>
        <span>
          The readiness score, platform and assumptions are AI drafts. A BITS reviewer validates them, and the ABA
          and manager decide scope, priority and platform.
        </span>
      </div>

      <div className={styles.actions}>
        <PurpleButton variant="outline" onClick={onBack} disabled={submitting}>
          Back to interview
        </PurpleButton>
        <PurpleButton withArrow onClick={submit} disabled={!review || submitting}>
          {submitting ? "Submitting…" : "Submit request"}
        </PurpleButton>
        {submitError && (
          <span className={styles.submitError} role="alert">
            Your request wasn’t submitted. Your draft is saved — try again.
          </span>
        )}
      </div>
    </>
  );
}
