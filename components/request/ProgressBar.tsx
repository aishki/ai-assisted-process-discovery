import styles from "./ProgressBar.module.css";

type Props = { value: number; label: string; tone?: "purple" | "amber" };

/** 6px bar on a tint track. */
export function ProgressBar({ value, label, tone = "purple" }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className={`${styles.fill} ${tone === "amber" ? styles.amber : ""}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
