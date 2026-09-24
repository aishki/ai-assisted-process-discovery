import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/kb/Breadcrumb";
import { Highlight } from "@/components/kb/Highlight";
import { PageIcon, ReferenceIcon, SearchIcon } from "@/components/kb/icons";
import { search } from "@/lib/kb/queries";
import { snippet } from "@/lib/kb/search";
import { ASK_INPUT_ID, CHECKLIST_HREF, KB_HOME_HREF, kbPageHref } from "@/lib/routes";
import styles from "./page.module.css";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

const SUGGESTED = [
  { title: "Before you request checklist", href: CHECKLIST_HREF },
  { title: "Selection criteria", href: kbPageHref("platform-guides", "selection-criteria") },
  { title: "Request process and timelines", href: kbPageHref("start-here", "request-process-and-timelines") },
  { title: "FAQs", href: kbPageHref("faqs-and-glossary", "faqs") },
];

const readQuery = (q: string | string[] | undefined) => (Array.isArray(q) ? q[0] : q ?? "").trim();

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = readQuery((await searchParams).q);
  return { title: q ? `“${q}” · Search · BITS Knowledge Base` : "Search · BITS Knowledge Base" };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = readQuery((await searchParams).q);
  const hits = q ? await search(q, 30) : [];

  return (
    <>
      <div className={styles.intro}>
        <Breadcrumb items={[{ label: "Knowledge base", href: KB_HOME_HREF }, { label: "Search" }]} />
        <h1 className={styles.title}>{q ? <>Results for “{q}”</> : "Search the knowledge base"}</h1>

        <form action="/knowledge-base/search" method="get" role="search" className={styles.form}>
          <label className={styles.field}>
            <SearchIcon />
            <input
              type="search"
              name="q"
              defaultValue={q}
              aria-label="Search the knowledge base"
              placeholder="Search guides, flows, standards and templates"
            />
          </label>
          <button type="submit" className={styles.submit}>
            Search
          </button>
        </form>

        {q && (
          <p className={styles.count} aria-live="polite">
            {hits.length === 0 ? "No results" : `${hits.length} result${hits.length === 1 ? "" : "s"}`}
          </p>
        )}
      </div>

      {q && hits.length > 0 && (
        <ul className={styles.results}>
          {hits.map((hit) => {
            const Icon = hit.kind === "page" ? PageIcon : ReferenceIcon;
            return (
              <li key={`${hit.kind}-${hit.href}-${hit.title}`}>
                <Link href={hit.href} className={styles.result}>
                  <span className={styles.icon}>
                    <Icon />
                  </span>
                  <span className={styles.body}>
                    <span className={styles.meta}>
                      {hit.kind === "page" ? "Page" : "Resource"} · {hit.context}
                    </span>
                    <span className={styles.resultTitle}>
                      <Highlight text={hit.title} query={q} />
                    </span>
                    {hit.kind === "page" && (
                      <span className={styles.snippet}>
                        <Highlight text={snippet(hit.text, q)} query={q} />
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {q && hits.length === 0 && (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Nothing matches “{q}”</h2>
          <ul className={styles.tips}>
            <li>Check the spelling, or use fewer words.</li>
            <li>Try the platform or template name, for example “Power Apps” or “charter”.</li>
            <li>
              Ask it as a question in <a href={`#${ASK_INPUT_ID}`}>Ask the knowledge base</a>.
            </li>
          </ul>
        </div>
      )}

      <section aria-labelledby="kb-suggested" className={styles.suggested}>
        <h2 id="kb-suggested" className={styles.suggestedTitle}>
          {q && hits.length > 0 ? "Popular pages" : "Start with these"}
        </h2>
        <ul className={styles.chips}>
          {SUGGESTED.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className={styles.chip}>
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
