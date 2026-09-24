import Link from "next/link";
import { MY_REQUESTS_HREF } from "@/lib/routes";
import type { KbRequest, KbUpdate, RequestStatus } from "@/lib/kb/types";
import styles from "./RightRail.module.css";

const STATUS_CLASS: Record<RequestStatus, string> = {
  "AI review": styles.statusReview,
  "Needs info": styles.statusNeedsInfo,
  Draft: styles.statusDraft,
};

export function RightRail({ updates, requests }: { updates: KbUpdate[]; requests: KbRequest[] }) {
  return (
    <aside className={styles.rail} aria-label="Activity">
      <section className={styles.updates}>
        <h2 className={styles.heading}>Recently updated</h2>
        {updates.map((u) => (
          <div key={u.what} className={styles.update}>
            <span className={styles.when}>{u.when}</span>
            <span className={styles.what}>{u.what}</span>
          </div>
        ))}
      </section>

      <section className={styles.requests}>
        <h2 className={styles.heading}>My requests</h2>
        {requests.map((r) => (
          <div key={r.id} className={styles.request}>
            <span className={styles.requestId}>{r.id}</span>
            <span className={`${styles.status} ${STATUS_CLASS[r.status]}`}>{r.status}</span>
          </div>
        ))}
        <Link href={MY_REQUESTS_HREF} className={styles.viewAll}>
          View all requests →
        </Link>
      </section>

      {/* Wire to POST /kb/ask once the endpoint exists. */}
      <section className={styles.ask}>
        <h2 className={styles.askTitle}>Ask the knowledge base</h2>
        <p className={styles.askNote}>Answers are drafts and link back to the source page.</p>
        <input className={styles.askInput} aria-label="Ask the knowledge base" placeholder="Power Apps or web app?" />
      </section>
    </aside>
  );
}
