"use client";

import { useEffect, useRef } from "react";
import { PurpleButton } from "@/components/ui/PurpleButton";
import { STATUS_TRAIL } from "@/lib/requests/config";
import { KB_HOME_HREF, requestHref } from "@/lib/routes";
import styles from "./Confirmation.module.css";

export function Confirmation({ id, onRestart }: { id: string; onRestart: () => void }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <section className={styles.panel} aria-labelledby="confirmation-title">
      <img src="/graphics/supergraphic-connection-1.svg" alt="" className={styles.graphic} />
      <span className={styles.eyebrow}>Request submitted</span>
      <h1 id="confirmation-title" ref={ref} tabIndex={-1} className={styles.title}>
        {id} is with BITS
      </h1>
      <p className={styles.body}>
        AI review runs first, then the ABA and manager. You will be notified if anything needs more information.
      </p>
      <ol className={styles.trail} aria-label="Request status">
        {STATUS_TRAIL.map((label) => {
          const current = label === "Submitted";
          return (
            <li key={label} className={current ? styles.now : undefined} aria-current={current ? "step" : undefined}>
              {label}
            </li>
          );
        })}
      </ol>
      <div className={styles.actions}>
        <PurpleButton variant="inverse" href={KB_HOME_HREF}>
          Back to knowledge base
        </PurpleButton>
        <PurpleButton variant="inverse" href={requestHref(id)}>
          View {id}
        </PurpleButton>
        <PurpleButton variant="inverse" onClick={onRestart}>
          Start another request
        </PurpleButton>
      </div>
    </section>
  );
}
