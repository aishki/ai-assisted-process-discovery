import Link from "next/link";
import { MY_REQUESTS_HREF, requestHref } from "@/lib/routes";
import type { KbRequest, KbUpdate, RequestStatus } from "@/lib/kb/types";
import { AskBox } from "./AskBox";
import styles from "./RightRail.module.css";

export const STATUS_CLASS: Record<RequestStatus, string> = {
  Submitted: styles.statusSubmitted,
  "AI review": styles.statusReview,
  "Needs info": styles.statusNeedsInfo,
  Draft: styles.statusDraft,
};

export function StatusPill({ status }: { status: RequestStatus }) {
  return <span className={`${styles.status} ${STATUS_CLASS[status]}`}>{status}</span>;
}

export function RightRail({ updates, requests }: { updates: KbUpdate[]; requests: KbRequest[] }) {
  return (
    <aside className={styles.rail} aria-label="Activity">
      <section className={styles.updates}>
        <h2 className={styles.heading}>Recently updated</h2>
        <ul className={styles.list}>
          {updates.map((u) => {
            const body = (
              <>
                <span className={styles.when}>{u.when}</span>
                <span className={styles.what}>{u.what}</span>
              </>
            );
            return (
              <li key={u.what}>
                {u.href ? (
                  <Link href={u.href} className={`${styles.update} ${styles.linked}`}>
                    {body}
                  </Link>
                ) : (
                  <div className={styles.update}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.requests}>
        <h2 className={styles.heading}>My requests</h2>
        {requests.length === 0 ? (
          <p className={styles.empty}>You have no open requests.</p>
        ) : (
          <ul className={styles.list}>
            {requests.map((r) => (
              <li key={r.id}>
                <Link href={requestHref(r.id)} className={styles.request} aria-label={`${r.id}, ${r.status}`}>
                  <span className={styles.requestId}>{r.id}</span>
                  <StatusPill status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href={MY_REQUESTS_HREF} className={styles.viewAll}>
          View all requests →
        </Link>
      </section>

      <AskBox />
    </aside>
  );
}
