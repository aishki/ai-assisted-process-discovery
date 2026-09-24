import Link from "next/link";
import { PROFILE_HREF } from "@/lib/routes";
import styles from "./HeaderBar.module.css";

/** The sticky 72px bar shared by every portal screen. */
export function HeaderBar({ children }: { children: React.ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

/** "BITS" plus the product name. Links to `href` when given. */
export function Wordmark({ product, href }: { product: string; href?: string }) {
  const content = (
    <>
      <span className={styles.brand}>BITS</span>
      <span className={styles.product}>{product}</span>
    </>
  );
  return href ? (
    <Link href={href} className={`${styles.wordmark} ${styles.linked}`}>
      {content}
    </Link>
  ) : (
    <div className={styles.wordmark}>{content}</div>
  );
}

/** Right-hand group; pushed to the end of the bar. */
export function HeaderActions({ children }: { children: React.ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}

export function Avatar({ initials, current = false }: { initials: string; current?: boolean }) {
  return (
    <Link
      href={PROFILE_HREF}
      className={styles.avatar}
      aria-label="Your profile"
      aria-current={current ? "page" : undefined}
    >
      {initials}
    </Link>
  );
}
