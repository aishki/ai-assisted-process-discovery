import { PurpleButton } from "@/components/ui/PurpleButton";
import type { PlaceholderArea } from "@/lib/routes";
import { CHECKLIST_HREF, KB_HOME_HREF } from "@/lib/routes";
import styles from "./ComingSoon.module.css";

type Props = PlaceholderArea & {
  /** Extra detail above the body, e.g. a request ID and status. */
  children?: React.ReactNode;
  /** Point request-related pages at the checklist so people can prepare meanwhile. */
  showChecklist?: boolean;
};

/** Stand-in for portal areas outside Module 1, so no link in the knowledge base dead-ends. */
export function ComingSoon({ title, body, module, children, showChecklist }: Props) {
  return (
    <main className={styles.main}>
      <div className={styles.panel}>
        <img src="/graphics/supergraphic-connection-1.svg" alt="" className={styles.graphic} />
        <div className={styles.content}>
          <span className={styles.eyebrow}>Coming soon{module ? ` · ${module}` : ""}</span>
          <h1 className={styles.title}>{title}</h1>
          {children}
          <p className={styles.body}>{body}</p>
          <div className={styles.actions}>
            {showChecklist && (
              <PurpleButton variant="inverse" href={CHECKLIST_HREF}>
                Open checklist
              </PurpleButton>
            )}
            <PurpleButton
              variant={showChecklist ? "outline" : "inverse"}
              className={showChecklist ? styles.outlineOnDark : undefined}
              href={KB_HOME_HREF}
            >
              Back to knowledge base
            </PurpleButton>
          </div>
        </div>
      </div>
    </main>
  );
}
