import Link from "next/link";
import { HELP_LINKS, STEPS } from "@/lib/requests/config";
import styles from "./Stepper.module.css";

type Props = {
  current: number;
  /** Highest step visited; steps before it show ✓. */
  maxStep: number;
  submitted: boolean;
  canReach: (step: number) => boolean;
  onGo: (step: number) => void;
};

export function Stepper({ current, maxStep, submitted, canReach, onGo }: Props) {
  return (
    <nav className={styles.stepper} aria-label="Request steps">
      <span className={styles.label}>New request</span>
      <ol className={styles.list}>
        {STEPS.map((s, i) => {
          const isCurrent = !submitted && i === current;
          const done = submitted || (i < maxStep && !isCurrent);
          const reachable = !submitted && canReach(i);
          return (
            <li key={s.title}>
              <button
                type="button"
                className={`${styles.step} ${isCurrent ? styles.current : ""} ${done ? styles.done : ""}`}
                aria-current={isCurrent ? "step" : undefined}
                disabled={!reachable || isCurrent}
                onClick={() => onGo(i)}
              >
                <span className={styles.dot} aria-hidden="true">
                  {done ? "✓" : i + 1}
                </span>
                <span className={styles.text}>
                  <span className={styles.title}>
                    {s.title}
                    {done && <span className="sr-only"> (complete)</span>}
                  </span>
                  <span className={styles.sub}>{s.sub}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.help}>
        <span className={styles.helpTitle}>Need help?</span>
        {HELP_LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
