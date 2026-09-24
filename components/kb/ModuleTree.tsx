"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { kbPageHref } from "@/lib/routes";
import type { KbModule } from "@/lib/kb/types";
import styles from "./ModuleTree.module.css";

type Params = { module?: string; page?: string };

export function ModuleTree({ modules }: { modules: KbModule[] }) {
  const { module: activeModule, page: activePage } = useParams<Params>();
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    activeModule ? { [activeModule]: true } : {},
  );

  // Selecting a page (from the tree, prev/next or the banner) also opens its module.
  const [seenModule, setSeenModule] = useState(activeModule);
  if (activeModule !== seenModule) {
    setSeenModule(activeModule);
    if (activeModule && !open[activeModule]) setOpen((o) => ({ ...o, [activeModule]: true }));
  }

  const toggle = (slug: string) => setOpen((o) => ({ ...o, [slug]: !o[slug] }));

  return (
    <aside className={styles.tree} aria-label="Knowledge base modules">
      <div className={styles.head}>
        <span className={styles.label}>Modules</span>
        <span className={styles.count}>{modules.length}</span>
      </div>

      {modules.map((m) => {
        const isActive = m.slug === activeModule;
        const isOpen = !!open[m.slug];
        const listId = `kb-module-${m.slug}`;
        return (
          <div key={m.slug} className={styles.module}>
            <button
              type="button"
              className={`${styles.moduleButton} ${isActive ? styles.moduleActive : ""}`}
              aria-expanded={isOpen}
              aria-controls={listId}
              onClick={() => toggle(m.slug)}
            >
              <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`} aria-hidden="true">
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path d="M2 0.5 7 4 2 7.5z" fill="currentColor" />
                </svg>
              </span>
              <span className={styles.moduleTitle}>{m.title}</span>
            </button>

            {isOpen && (
              <ul id={listId} className={styles.children}>
                {m.children.map((c) => {
                  const selected = isActive && c.slug === activePage;
                  return (
                    <li key={c.slug}>
                      <Link
                        href={kbPageHref(m.slug, c.slug)}
                        className={`${styles.child} ${selected ? styles.childSelected : ""}`}
                        aria-current={selected ? "page" : undefined}
                      >
                        {c.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}
