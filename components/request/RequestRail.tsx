import { CHECKS, TIPS, TOPICS } from "@/lib/requests/config";
import { ProgressBar } from "./ProgressBar";
import styles from "./RequestRail.module.css";

type Props = {
  score: number;
  checksPassed: number;
  answeredCount: number;
  openQuestions: number;
  step: number;
};

export function RequestRail({ score, checksPassed, answeredCount, openQuestions, step }: Props) {
  const tip = TIPS[Math.min(step, TIPS.length - 1)];
  return (
    <aside className={styles.rail} aria-label="Request progress">
      <section className={styles.card} aria-labelledby="req-progress-title">
        <h2 id="req-progress-title" className={styles.heading}>
          Your request
        </h2>
        <div className={styles.score}>
          <span className={styles.pct}>{score}%</span>
          <span className={styles.ready}>ready</span>
        </div>
        <ProgressBar value={score} label="Readiness" />
        <dl className={styles.stats}>
          <div>
            <dt>Checks passed</dt>
            <dd>
              {checksPassed} / {CHECKS.length}
            </dd>
          </div>
          <div>
            <dt>Interview answered</dt>
            <dd>
              {answeredCount} / {TOPICS.length}
            </dd>
          </div>
          <div>
            <dt>Open questions</dt>
            <dd>{openQuestions}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.tip} aria-live="polite">
        <h2 className={styles.tipTitle}>{tip.title}</h2>
        <p className={styles.tipBody}>{tip.body}</p>
      </section>
    </aside>
  );
}
