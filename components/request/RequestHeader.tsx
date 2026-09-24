import Link from "next/link";
import { Avatar, HeaderActions, HeaderBar, Wordmark } from "@/components/layout/HeaderBar";
import { PurpleButton } from "@/components/ui/PurpleButton";
import { KB_HOME_HREF } from "@/lib/routes";
import styles from "./RequestHeader.module.css";

type Props = {
  initials: string;
  submitted: boolean;
  savedAt: string | null;
  saveFailed: boolean;
  onSave: () => void;
};

export function RequestHeader({ initials, submitted, savedAt, saveFailed, onSave }: Props) {
  return (
    <HeaderBar>
      <Link href={KB_HOME_HREF} className={styles.back} aria-label="Back to knowledge base">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="M11 6l-6 6 6 6" />
        </svg>
      </Link>
      <Wordmark product="Automation request" />
      <span className={styles.status}>{submitted ? "Submitted" : "Draft"}</span>

      <HeaderActions>
        {!submitted && (
          <>
            <span className={`${styles.saved} ${saveFailed ? styles.saveFailed : ""}`} role="status">
              {saveFailed ? "Couldn’t save in this browser" : savedAt ? `Saved ${savedAt}` : ""}
            </span>
            <PurpleButton variant="outline" onClick={onSave}>
              Save draft
            </PurpleButton>
          </>
        )}
        <Avatar initials={initials} />
      </HeaderActions>
    </HeaderBar>
  );
}
