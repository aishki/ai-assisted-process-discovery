"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { activeMenuHref, MENU } from "@/lib/routes";
import styles from "./MenuDrawer.module.css";

export function MenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeHref = activeMenuHref(usePathname());

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <nav id="kb-menu" className={styles.panel} aria-label="Portal menu">
        <div className={styles.top}>
          <span className={styles.brand}>BITS</span>
          <button ref={closeRef} type="button" className={styles.close} aria-label="Close menu" onClick={onClose}>
            ✕
          </button>
        </div>

        {MENU.map((g) => (
          <div key={g.group} className={styles.group}>
            <span className={styles.groupLabel}>{g.group}</span>
            {g.items.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${styles.item} ${active ? styles.active : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}

        <span className={styles.footer}>© 2026 CGSPH. All rights reserved.</span>
      </nav>
    </>
  );
}
