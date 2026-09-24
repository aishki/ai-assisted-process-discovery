"use client";

import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Avatar, HeaderActions, HeaderBar, Wordmark } from "@/components/layout/HeaderBar";
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
      <HeaderBar>
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

        <Wordmark product={inKnowledgeBase ? "Knowledge Base" : "Automation Portal"} href={KB_HOME_HREF} />

        <SearchBox index={searchIndex} />

        <HeaderActions>
          <PurpleButton href={NEW_REQUEST_HREF}>New request</PurpleButton>
          <Avatar initials={initials} current={pathname === PROFILE_HREF} />
        </HeaderActions>
      </HeaderBar>

      <MenuDrawer open={menuOpen} onClose={closeMenu} />
    </>
  );
}
