"use client";

import Link from "next/link";
import { useState } from "react";
import { ChoicePill } from "@/components/ui/ChoicePill";
import { PurpleButton } from "@/components/ui/PurpleButton";
import { CHECKS, checkPassed, evidenceProblem, MAX_UPLOAD_MB } from "@/lib/requests/config";
import type { CheckState } from "@/lib/requests/types";
import { StepHeading } from "../StepHeading";
import styles from "./QualificationStep.module.css";

type Props = {
  checks: CheckState[];
  onChange: (index: number, patch: Partial<CheckState>) => void;
  onContinue: () => void;
};

const matchesAccept = (file: File, accept: string) => {
  const name = file.name.toLowerCase();
  return accept.split(",").some((a) => {
    const rule = a.trim().toLowerCase();
    return rule.startsWith(".") ? name.endsWith(rule) : file.type === rule;
  });
};

export function QualificationStep({ checks, onChange, onContinue }: Props) {
  const [fileErrors, setFileErrors] = useState<Record<number, string>>({});
  const passed = checks.filter((c, i) => checkPassed(i, c)).length;
  const allPassed = passed === CHECKS.length;

  const pickFile = (i: number, file: File | undefined) => {
    if (!file) return;
    const accept = CHECKS[i].accept ?? "";
    const error = !matchesAccept(file, accept)
      ? `That file type isn’t accepted. ${CHECKS[i].fileHint}.`
      : file.size > MAX_UPLOAD_MB * 1024 * 1024
        ? `Files must be ${MAX_UPLOAD_MB} MB or smaller.`
        : "";
    setFileErrors((e) => ({ ...e, [i]: error }));
    if (!error) onChange(i, { evidence: file.name });
  };

  return (
    <>
      <StepHeading
        step={0}
        title="Confirm you are ready to request"
        lead="Each yes needs evidence. If something is not ready yet, we will point you to the template and keep your draft."
      />

      <ol className={styles.checks}>
        {CHECKS.map((c, i) => {
          const state = checks[i];
          const ok = checkPassed(i, state);
          const problem = evidenceProblem(i, state);
          const titleId = `check-${i}-title`;
          return (
            <li key={c.title} className={`${styles.card} ${ok ? styles.passed : ""}`}>
              <div className={styles.row}>
                <span className={styles.num} aria-hidden="true">
                  {ok ? "✓" : i + 1}
                </span>
                <div className={styles.copy}>
                  <h2 id={titleId} className={styles.title}>
                    {c.title}
                    {ok && <span className="sr-only"> — passed</span>}
                  </h2>
                  <p className={styles.desc}>{c.description}</p>
                </div>
                <div className={styles.choices} role="group" aria-label={`${c.title}: ready?`}>
                  <ChoicePill selected={state.answer === "yes"} onClick={() => onChange(i, { answer: "yes" })}>
                    Yes
                  </ChoicePill>
                  <ChoicePill selected={state.answer === "no"} onClick={() => onChange(i, { answer: "no" })}>
                    Not yet
                  </ChoicePill>
                </div>
              </div>

              {state.answer === "yes" && c.kind === "text" && (
                <div className={styles.evidence}>
                  <input
                    className={styles.text}
                    value={state.evidence}
                    placeholder={c.placeholder}
                    aria-label={`${c.title}: ${c.placeholder}`}
                    aria-invalid={problem ? true : undefined}
                    aria-describedby={problem ? `check-${i}-error` : undefined}
                    maxLength={200}
                    onChange={(e) => onChange(i, { evidence: e.target.value })}
                  />
                  {problem && (
                    <p id={`check-${i}-error`} className={styles.error}>
                      {problem}
                    </p>
                  )}
                </div>
              )}

              {state.answer === "yes" && c.kind === "file" && (
                <div className={styles.evidence}>
                  <label className={styles.upload}>
                    <span className={styles.uploadIcon} aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 16V4" />
                        <path d="M7 9l5-5 5 5" />
                        <path d="M5 20h14" />
                      </svg>
                    </span>
                    <span className={`${styles.fileName} ${state.evidence ? "" : styles.placeholder}`}>
                      {state.evidence || c.fileHint}
                    </span>
                    <span className={styles.fileAction}>{state.evidence ? "Replace" : "Browse"}</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept={c.accept}
                      aria-label={`${c.title}: ${state.evidence ? `replace ${state.evidence}` : c.fileHint}`}
                      aria-describedby={fileErrors[i] ? `check-${i}-error` : undefined}
                      onChange={(e) => {
                        pickFile(i, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {fileErrors[i] && (
                    <p id={`check-${i}-error`} className={styles.error}>
                      {fileErrors[i]}
                    </p>
                  )}
                </div>
              )}

              {state.answer === "no" && (
                <div className={styles.notYet}>
                  <p>
                    No problem. Use the <strong>{c.template}</strong>, then come back. Your draft is saved.
                  </p>
                  <Link href={c.templateHref}>Open in knowledge base →</Link>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className={styles.footer}>
        <PurpleButton withArrow disabled={!allPassed} onClick={onContinue}>
          Continue to project details
        </PurpleButton>
        <span className={styles.hint} aria-live="polite">
          {allPassed ? "All three checks passed" : `${passed} of ${CHECKS.length} checks have evidence`}
        </span>
      </div>
    </>
  );
}
