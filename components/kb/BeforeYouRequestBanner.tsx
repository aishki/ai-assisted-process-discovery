"use client";

import { useState } from "react";
import { PurpleButton } from "@/components/ui/PurpleButton";
import { BANNER_COOKIE } from "@/lib/kb/banner";
import { CHECKLIST_HREF } from "@/lib/routes";
import styles from "./BeforeYouRequestBanner.module.css";

export function BeforeYouRequestBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const dismiss = () => {
    document.cookie = `${BANNER_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
    setVisible(false);
  };

  return (
    <section className={styles.banner} aria-labelledby="kb-banner-title">
      <img src="/graphics/supergraphic-connection-1.svg" alt="" className={styles.graphic} />
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Before you request</span>
        <h2 id="kb-banner-title" className={styles.headline}>
          Complete the three qualification checks first
        </h2>
        <p className={styles.body}>
          Brainwave submission at Project status, project charter and named POC. Templates for each are in the library.
        </p>
      </div>
      <div className={styles.actions}>
        <PurpleButton variant="inverse" href={CHECKLIST_HREF}>
          Open checklist
        </PurpleButton>
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={dismiss}>
          ✕
        </button>
      </div>
    </section>
  );
}
