"use client";

import { useCallback, useState } from "react";
import { PurpleButton } from "@/components/ui/PurpleButton";
import { NEW_REQUEST_HREF } from "@/lib/routes";
import { MenuDrawer } from "./MenuDrawer";
import { SearchIcon } from "./icons";
import styles from "./KbHeader.module.css";

export function KbHeader({ initials }: { initials: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.hamburger}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="kb-menu"
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={styles.wordmark}>
          <span className={styles.brand}>BITS</span>
          <span className={styles.product}>Knowledge Base</span>
        </div>

        <form className={styles.searchWrap} role="search" onSubmit={(e) => e.preventDefault()}>
          <label className={styles.search}>
            <SearchIcon />
            <input
              type="search"
              aria-label="Search the knowledge base"
              placeholder="Ask a question or search the knowledge base"
            />
          </label>
        </form>

        <div className={styles.actions}>
          <PurpleButton href={NEW_REQUEST_HREF}>New request</PurpleButton>
          <div className={styles.avatar} aria-label="Your profile">
            {initials}
          </div>
        </div>
      </header>

      <MenuDrawer open={menuOpen} onClose={closeMenu} />
    </>
  );
}
