import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeYouRequestBanner } from "@/components/kb/BeforeYouRequestBanner";
import { DocumentIcon } from "@/components/kb/icons";
import { BANNER_COOKIE } from "@/lib/kb/banner";
import { getPage } from "@/lib/kb/queries";
import { kbPageHref } from "@/lib/routes";
import styles from "./page.module.css";

type Props = { params: Promise<{ module: string; page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: moduleSlug, page: pageSlug } = await params;
  const page = await getPage(moduleSlug, pageSlug);
  return { title: page ? `${page.title} · BITS Knowledge Base` : "BITS Knowledge Base" };
}

export default async function KnowledgeBasePage({ params }: Props) {
  const { module: moduleSlug, page: pageSlug } = await params;
  const [page, cookieStore] = await Promise.all([getPage(moduleSlug, pageSlug), cookies()]);
  if (!page) notFound();

  const showBanner = cookieStore.get(BANNER_COOKIE)?.value !== "1";

  return (
    <>
      {showBanner && <BeforeYouRequestBanner />}

      <div className={styles.intro}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <span>Knowledge base</span>
          <span aria-hidden="true">/</span>
          <span>{page.moduleTitle}</span>
          <span aria-hidden="true">/</span>
          <span className={styles.crumbCurrent} aria-current="page">
            {page.title}
          </span>
        </nav>
        <h1 className={styles.title}>{page.title}</h1>
        <div className={styles.chips}>
          <span className={styles.reviewedChip}>Reviewed {page.updated}</span>
        </div>
        <p className={styles.summary}>{page.summary}</p>
      </div>

      {page.cards.length > 0 && (
        <div className={styles.cards}>
          {page.cards.map((c) => (
            <div key={c.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardBody}>{c.body}</p>
            </div>
          ))}
        </div>
      )}

      <section className={styles.section} aria-labelledby="kb-in-section">
        <h2 id="kb-in-section" className={styles.sectionTitle}>
          In this section
        </h2>
        <ul className={styles.resources}>
          {page.resources.map((r) => (
            <li key={r.title} className={styles.resource}>
              <span className={styles.resourceIcon}>
                <DocumentIcon />
              </span>
              <span className={styles.resourceTitle}>{r.title}</span>
              <span className={styles.resourceKind}>{r.kind}</span>
            </li>
          ))}
        </ul>
      </section>

      <nav className={styles.pager} aria-label="Previous and next page">
        <Link href={kbPageHref(page.prev.moduleSlug, page.prev.pageSlug)} rel="prev">
          ← {page.prev.title}
        </Link>
        <Link href={kbPageHref(page.next.moduleSlug, page.next.pageSlug)} rel="next">
          {page.next.title} →
        </Link>
      </nav>
    </>
  );
}
