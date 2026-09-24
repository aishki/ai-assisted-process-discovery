import "server-only";
import { kbPageHref } from "@/lib/routes";
import { MODULES, MY_REQUESTS, UPDATES } from "./data";
import { searchEntries, tokenize } from "./search";
import type {
  KbAskResponse,
  KbModule,
  KbPage,
  KbPageLink,
  KbRequest,
  KbResource,
  KbResourceType,
  KbSearchEntry,
  KbSearchHit,
  KbUpdate,
} from "./types";

// Stand-ins for the REST API named in the handoff (GET /modules, GET /pages/:id,
// GET /updates, GET /me/requests, POST /kb/ask). Swap the bodies for fetch calls
// once it exists.

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const TREE: KbModule[] = MODULES.map((m) => ({
  slug: slugify(m.title),
  title: m.title,
  children: m.children.map((c) => ({ slug: slugify(c.title), title: c.title })),
}));

/** Every child page in tree order, used for previous/next stepping. */
const FLAT: KbPageLink[] = TREE.flatMap((m) =>
  m.children.map((c) => ({ moduleSlug: m.slug, pageSlug: c.slug, title: c.title })),
);

export const DEFAULT_PAGE = { moduleSlug: "platform-guides", pageSlug: "power-apps" };

/** Resolves a "module/page" link, or null if that page does not exist. */
function resolveLink(link: string | undefined): string | null {
  if (!link) return null;
  const [m, p] = link.split("/");
  return FLAT.some((f) => f.moduleSlug === m && f.pageSlug === p) ? kbPageHref(m, p) : null;
}

const resourceType = (kind: string): KbResourceType =>
  kind.startsWith("Template") ? "template" : kind.startsWith("Guide") ? "guide" : "reference";

function buildPage(mi: number, ci: number): KbPage {
  const mod = MODULES[mi];
  const ch = mod.children[ci];
  const moduleSlug = TREE[mi].slug;
  const pageSlug = TREE[mi].children[ci].slug;
  const i = FLAT.findIndex((f) => f.moduleSlug === moduleSlug && f.pageSlug === pageSlug);
  const sources = ch.resources ?? [{ title: `${ch.title} overview`, kind: "Guide" }];

  return {
    moduleSlug,
    moduleTitle: mod.title,
    moduleHref: kbPageHref(moduleSlug, TREE[mi].children[0].slug),
    slug: pageSlug,
    title: ch.title,
    updated: ch.updated ?? "January 2026",
    summary:
      ch.summary ??
      `${ch.title} is part of ${mod.title}. Content for this page is being gathered by the module owner.`,
    cards: ch.cards ?? [],
    resources: sources.map<KbResource>((r) => ({
      title: r.title,
      kind: r.kind,
      type: resourceType(r.kind),
      href: resolveLink(r.link),
    })),
    prev: FLAT[(i - 1 + FLAT.length) % FLAT.length],
    next: FLAT[(i + 1) % FLAT.length],
  };
}

const PAGES: KbPage[] = MODULES.flatMap((m, mi) => m.children.map((_, ci) => buildPage(mi, ci)));

const INDEX: KbSearchEntry[] = PAGES.flatMap((p) => {
  const pageHref = kbPageHref(p.moduleSlug, p.slug);
  return [
    {
      kind: "page" as const,
      title: p.title,
      context: p.moduleTitle,
      text: [p.summary, ...p.cards.map((c) => `${c.title} ${c.body}`)].join(" "),
      href: pageHref,
    },
    // Only resources that lead somewhere; the rest would just repeat their page.
    ...p.resources.flatMap((r) =>
      r.href
        ? [{ kind: "resource" as const, title: r.title, context: `${p.moduleTitle} › ${p.title}`, text: r.kind, href: r.href }]
        : [],
    ),
  ];
});

const PAGE_INDEX = INDEX.filter((e) => e.kind === "page");

export async function getModules(): Promise<KbModule[]> {
  return TREE;
}

export async function getAllPageLinks(): Promise<KbPageLink[]> {
  return FLAT;
}

export async function getPage(moduleSlug: string, pageSlug: string): Promise<KbPage | null> {
  return PAGES.find((p) => p.moduleSlug === moduleSlug && p.slug === pageSlug) ?? null;
}

export async function getSearchIndex(): Promise<KbSearchEntry[]> {
  return INDEX;
}

export async function search(query: string, limit = 20): Promise<KbSearchHit[]> {
  return searchEntries(INDEX, query, limit);
}

/** Draft answer built from the best-matching page. Answers always cite their sources. */
export async function ask(question: string): Promise<KbAskResponse> {
  // Score word by word so questions comparing two things ("Power Apps or web app?")
  // cite both sides; pages matching every word get a bonus.
  const scores = new Map<string, KbSearchHit>();
  const add = (hit: KbSearchHit, bonus = 0) => {
    const prev = scores.get(hit.href);
    scores.set(hit.href, { ...hit, score: (prev?.score ?? 0) + hit.score + bonus });
  };
  searchEntries(PAGE_INDEX, question, 5).forEach((hit) => add(hit, 10));
  for (const word of tokenize(question)) {
    searchEntries(PAGE_INDEX, word, 5).forEach((hit) => add(hit));
  }
  const hits = [...scores.values()].sort((a, b) => b.score - a.score).slice(0, 3);
  if (hits.length === 0) return { answer: null, sources: [] };

  const top = PAGES.find((p) => kbPageHref(p.moduleSlug, p.slug) === hits[0].href);
  return {
    answer: top?.summary ?? null,
    sources: hits.map(({ title, context, href }) => ({ title, context, href })),
  };
}

export async function getRecentUpdates(limit = 3): Promise<KbUpdate[]> {
  return UPDATES.slice(0, limit).map((u) => ({ when: u.when, what: u.what, href: resolveLink(u.link) }));
}

export async function getMyRequests(limit = 3): Promise<KbRequest[]> {
  return MY_REQUESTS.slice(0, limit);
}

export async function getRequest(id: string): Promise<KbRequest | null> {
  return MY_REQUESTS.find((r) => r.id === id) ?? null;
}
