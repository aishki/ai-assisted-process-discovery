import styles from "./ThreeColumnLayout.module.css";

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
  children: React.ReactNode;
  /** Extra class for the main column, e.g. different padding. */
  mainClassName?: string;
};

/**
 * The portal grid: grey left column | main | right rail.
 * ≥1200px: 288 | 1fr | 300. Below 1200px the rail wraps under main. Below 820px the
 * left column narrows to 240px.
 */
export function ThreeColumnLayout({ left, right, children, mainClassName }: Props) {
  return (
    <div className={styles.grid}>
      <div className={styles.left}>{left}</div>
      <main className={[styles.main, mainClassName].filter(Boolean).join(" ")}>{children}</main>
      <div className={styles.right}>{right}</div>
    </div>
  );
}
