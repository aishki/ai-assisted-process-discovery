import Link from "next/link";
import { Fragment } from "react";
import styles from "./Breadcrumb.module.css";

export type Crumb = { label: string; href?: string };

/** Every crumb but the last is a link; the last is the current page. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${c.label}-${i}`}>
              <li>
                {last || !c.href ? (
                  <span className={last ? styles.current : undefined} aria-current={last ? "page" : undefined}>
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className={styles.link}>
                    {c.label}
                  </Link>
                )}
              </li>
              {!last && (
                <li aria-hidden="true" className={styles.sep}>
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
