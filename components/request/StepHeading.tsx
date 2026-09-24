"use client";

import { useEffect, useRef } from "react";
import { STEPS } from "@/lib/requests/config";
import styles from "./StepHeading.module.css";

type Props = { step: number; title: string; lead?: React.ReactNode };

/** Eyebrow "Step N of 4 · Name", H1 and lead. Takes focus on mount so step changes are announced. */
export function StepHeading({ step, title, lead }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step]);

  return (
    <div className={styles.heading}>
      <span className={styles.eyebrow}>
        Step {step + 1} of {STEPS.length} · {STEPS[step].title}
      </span>
      <h1 ref={ref} tabIndex={-1} className={styles.title}>
        {title}
      </h1>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}
