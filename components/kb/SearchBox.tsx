"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchEntries, tokenize } from "@/lib/kb/search";
import type { KbSearchEntry } from "@/lib/kb/types";
import { kbSearchHref } from "@/lib/routes";
import { Highlight } from "./Highlight";
import { PageIcon, ReferenceIcon, SearchIcon } from "./icons";
import styles from "./SearchBox.module.css";

const MAX_SUGGESTIONS = 6;

export function SearchBox({ index }: { index: KbSearchEntry[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const trimmed = query.trim();
  const hasQuery = tokenize(trimmed).length > 0;
  const hits = useMemo(() => searchEntries(index, trimmed, MAX_SUGGESTIONS), [index, trimmed]);
  // The last option is always "See all results", so Enter never dead-ends.
  const optionCount = hasQuery ? hits.length + 1 : 0;
  const showList = open && hasQuery;

  // "/" focuses search from anywhere except another text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
    router.push(href);
  };

  const choose = (i: number) => {
    if (i >= 0 && i < hits.length) {
      setQuery("");
      go(hits[i].href);
    } else if (hasQuery) {
      go(kbSearchHref(trimmed));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!optionCount) return;
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => {
        const next = a + step;
        return next >= optionCount ? 0 : next < 0 ? optionCount - 1 : next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      if (showList) setOpen(false);
      else setQuery("");
      setActive(-1);
    }
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <div className={styles.wrap}>
      <form
        role="search"
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          choose(active);
        }}
      >
        <label className={styles.pill}>
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-label="Search the knowledge base"
            aria-autocomplete="list"
            aria-expanded={showList}
            aria-controls={listId}
            aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
            placeholder="Ask a question or search the knowledge base"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKeyDown}
          />
          {!query && (
            <kbd className={styles.kbd} aria-hidden="true">
              /
            </kbd>
          )}
        </label>
      </form>

      {showList && (
        <ul id={listId} role="listbox" aria-label="Search suggestions" className={styles.list}>
          {hits.length === 0 && (
            <li className={styles.empty} role="presentation">
              No pages match “{trimmed}”. Try fewer or different words.
            </li>
          )}
          {hits.map((hit, i) => {
            const Icon = hit.kind === "page" ? PageIcon : ReferenceIcon;
            return (
              <li
                key={`${hit.kind}-${hit.href}-${hit.title}`}
                id={optionId(i)}
                role="option"
                aria-selected={active === i}
                className={`${styles.option} ${active === i ? styles.active : ""}`}
                // Keep focus in the input so blur does not close the list before the click lands.
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
              >
                <span className={styles.icon}>
                  <Icon size={14} />
                </span>
                <span className={styles.text}>
                  <span className={styles.title}>
                    <Highlight text={hit.title} query={trimmed} />
                  </span>
                  <span className={styles.context}>
                    {hit.kind === "resource" ? "Resource · " : ""}
                    {hit.context}
                  </span>
                </span>
              </li>
            );
          })}
          <li
            id={optionId(hits.length)}
            role="option"
            aria-selected={active === hits.length}
            className={`${styles.option} ${styles.all} ${active === hits.length ? styles.active : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(hits.length)}
            onClick={() => choose(hits.length)}
          >
            See all results for “{trimmed}” →
          </li>
        </ul>
      )}
    </div>
  );
}
