"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChoicePill } from "@/components/ui/ChoicePill";
import { PurpleButton } from "@/components/ui/PurpleButton";
import { api, isAbort } from "@/lib/requests/client";
import { FIELDS, SENSITIVITY } from "@/lib/requests/config";
import type { FieldKey, PrefillResponse, RequestDraft, Sensitivity } from "@/lib/requests/types";
import { StepHeading } from "../StepHeading";
import styles from "./DetailsStep.module.css";

/** Callbacks must be stable (useCallback): the pre-fill effect depends on them. */
type Props = {
  draft: RequestDraft;
  charterName: string;
  onPrefill: (result: PrefillResponse, source: string) => void;
  onEdit: (key: FieldKey, value: string) => void;
  onSensitivity: (value: Sensitivity) => void;
  onBack: () => void;
  onNext: () => void;
};

const LOW_CONFIDENCE = 0.7;

export function DetailsStep({ draft, charterName, onPrefill, onEdit, onSensitivity, onBack, onNext }: Props) {
  const needsPrefill = draft.prefilledFrom !== charterName;
  const [status, setStatus] = useState<"idle" | "loading" | "error">(needsPrefill ? "loading" : "idle");
  const [confidence, setConfidence] = useState<Partial<Record<FieldKey, number>>>({});
  const [showErrors, setShowErrors] = useState(false);
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLTextAreaElement | null>>>({});

  const runPrefill = useCallback(
    (signal?: AbortSignal) => {
      setStatus("loading");
      api
        .prefill(charterName, signal)
        .then((result) => {
          setConfidence(result.confidence);
          onPrefill(result, charterName);
          setStatus("idle");
        })
        .catch((err) => {
          if (isAbort(err)) return;
          console.error("Pre-fill failed", err);
          setStatus("error");
        });
    },
    [charterName, onPrefill],
  );

  useEffect(() => {
    if (!needsPrefill) return;
    const controller = new AbortController();
    runPrefill(controller.signal);
    return () => controller.abort();
  }, [needsPrefill, runPrefill]);

  const loading = status === "loading";
  const missing = FIELDS.filter((f) => !draft.values[f.key].trim());

  const next = () => {
    if (missing.length > 0) {
      setShowErrors(true);
      fieldRefs.current[missing[0].key]?.focus();
      return;
    }
    onNext();
  };

  return (
    <>
      <StepHeading
        step={1}
        title="Check what we pulled from your charter"
        lead={
          <>
            Fields marked AI pre-filled were read from <strong>{charterName}</strong>. Edit anything that is wrong
            — your edits replace the draft.
          </>
        }
      />

      <div aria-live="polite">
        {loading && (
          <p className={styles.status}>
            <span className={styles.spinner} aria-hidden="true" />
            Reading {charterName}…
          </p>
        )}
        {status === "error" && (
          <div className={styles.errorBox}>
            <p>We couldn’t read your charter. You can fill the fields in yourself, or try again.</p>
            <button type="button" onClick={() => runPrefill()}>
              Try again
            </button>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {FIELDS.map((f) => {
          const value = draft.values[f.key];
          const prefilled = draft.prefilledFrom !== null && !draft.edited[f.key] && value.trim().length > 0;
          const lowConfidence = prefilled && (confidence[f.key] ?? 1) < LOW_CONFIDENCE;
          const invalid = showErrors && !value.trim();
          const id = `field-${f.key}`;
          return (
            <div key={f.key} className={`${styles.field} ${f.wide ? styles.wide : ""}`}>
              <div className={styles.labelRow}>
                <label htmlFor={id} className={styles.label}>
                  {f.label}
                </label>
                {prefilled && (
                  <span className={`${styles.chip} ${lowConfidence ? styles.chipCheck : ""}`}>
                    {lowConfidence ? "AI pre-filled · please check" : "AI pre-filled"}
                  </span>
                )}
                {draft.edited[f.key] && <span className={styles.confirmed}>Confirmed by you</span>}
              </div>
              <textarea
                id={id}
                ref={(el) => {
                  fieldRefs.current[f.key] = el;
                }}
                rows={f.rows}
                value={value}
                disabled={loading}
                aria-busy={loading}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? `${id}-error` : undefined}
                maxLength={2000}
                className={`${styles.input} ${draft.edited[f.key] ? styles.edited : ""} ${loading ? styles.skeleton : ""}`}
                onChange={(e) => onEdit(f.key, e.target.value)}
              />
              {invalid && (
                <span id={`${id}-error`} className={styles.fieldError}>
                  Add the {f.label.toLowerCase()} to continue.
                </span>
              )}
            </div>
          );
        })}
      </div>

      <fieldset className={styles.sensitivity}>
        <legend className={styles.label}>Data sensitivity</legend>
        <div className={styles.pills}>
          {SENSITIVITY.map((option) => (
            <ChoicePill key={option} selected={draft.sensitivity === option} onClick={() => onSensitivity(option)}>
              {option}
            </ChoicePill>
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <PurpleButton variant="outline" onClick={onBack}>
          Back
        </PurpleButton>
        <PurpleButton withArrow disabled={loading} onClick={next}>
          Start the interview
        </PurpleButton>
        {showErrors && missing.length > 0 && (
          <span className={styles.summary} role="alert">
            {missing.length === 1 ? "1 field needs an answer." : `${missing.length} fields need an answer.`}
          </span>
        )}
      </div>
    </>
  );
}
