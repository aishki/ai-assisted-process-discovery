import Link from "next/link";
import type { KbResource } from "@/lib/kb/types";
import { RESOURCE_ICONS } from "./icons";
import styles from "./ResourceList.module.css";

export function ResourceList({ resources }: { resources: KbResource[] }) {
  return (
    <ul className={styles.list}>
      {resources.map((r) => {
        const Icon = RESOURCE_ICONS[r.type];
        const external = r.href?.startsWith("https://") ?? false;
        const content = (
          <>
            <span className={styles.icon}>
              <Icon />
            </span>
            <span className={styles.title}>{r.title}</span>
            <span className={styles.kind}>{r.kind}</span>
            {r.href ? (
              <span className={styles.arrow} aria-hidden="true">
                {external ? "↗" : "→"}
              </span>
            ) : (
              <span className={styles.soon}>Not available yet</span>
            )}
          </>
        );
        return (
          <li key={r.title}>
            {r.href && external ? (
              <a href={r.href} target="_blank" rel="noopener noreferrer" className={`${styles.row} ${styles.linked}`}>
                {content}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : r.href ? (
              <Link href={r.href} className={`${styles.row} ${styles.linked}`}>
                {content}
              </Link>
            ) : (
              <div className={`${styles.row} ${styles.unavailable}`}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
