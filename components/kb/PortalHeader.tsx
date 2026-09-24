"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { PurpleButton } from "@/components/ui/PurpleButton";
import type { KbSearchEntry } from "@/lib/kb/types";
import { KB_HOME_HREF, NEW_REQUEST_HREF, PROFILE_HREF } from "@/lib/routes";
import { MenuDrawer } from "./MenuDrawer";
import { SearchBox } from "./SearchBox";
import styles from "./PortalHeader.module.css";

type Props = { initials: string; searchIndex: KbSearchEntry[] };

export function PortalHeader({ initials, searchIndex }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const inKnowledgeBase = pathname.startsWith(KB_HOME_HREF);

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

        <Link href={KB_HOME_HREF} className={styles.wordmark}>
          <span className={styles.brand}>BITS</span>
          <span className={styles.product}>{inKnowledgeBase ? "Knowledge Base" : "Automation Portal"}</span>
        </Link>

        <SearchBox index={searchIndex} />

        <div className={styles.actions}>
          <PurpleButton href={NEW_REQUEST_HREF}>New request</PurpleButton>
          <Link
            href={PROFILE_HREF}
            className={styles.avatar}
            aria-label="Your profile"
            aria-current={pathname === PROFILE_HREF ? "page" : undefined}
          >
            {initials}
          </Link>
        </div>
      </header>

      <MenuDrawer open={menuOpen} onClose={closeMenu} />
    </>
  );
}
