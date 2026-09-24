import "server-only";
import { MODULES, MY_REQUESTS, UPDATES } from "./data";
import type { KbModule, KbPage, KbPageLink, KbRequest, KbUpdate } from "./types";

// Stand-ins for the REST API named in the handoff (GET /modules, GET /pages/:id,
// GET /updates, GET /me/requests). Swap the bodies for fetch calls once it exists.

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

export async function getModules(): Promise<KbModule[]> {
  return TREE;
}

export async function getAllPageLinks(): Promise<KbPageLink[]> {
  return FLAT;
}

export async function getPage(moduleSlug: string, pageSlug: string): Promise<KbPage | null> {
  const mi = TREE.findIndex((m) => m.slug === moduleSlug);
  if (mi < 0) return null;
  const ci = TREE[mi].children.findIndex((c) => c.slug === pageSlug);
  if (ci < 0) return null;

  const mod = MODULES[mi];
  const ch = mod.children[ci];
  const i = FLAT.findIndex((f) => f.moduleSlug === moduleSlug && f.pageSlug === pageSlug);

  return {
    moduleSlug,
    moduleTitle: mod.title,
    slug: pageSlug,
    title: ch.title,
    owner: ch.owner ?? "BITS Automation Team",
    updated: ch.updated ?? "January 2026",
    summary:
      ch.summary ??
      `${ch.title} is part of ${mod.title}. Content for this page is being gathered by the module owner.`,
    cards: ch.cards ?? [],
    resources: ch.resources ?? [{ title: `${ch.title} overview`, kind: "Guide" }],
    prev: FLAT[(i - 1 + FLAT.length) % FLAT.length],
    next: FLAT[(i + 1) % FLAT.length],
  };
}

export async function getRecentUpdates(limit = 3): Promise<KbUpdate[]> {
  return UPDATES.slice(0, limit);
}

export async function getMyRequests(limit = 3): Promise<KbRequest[]> {
  return MY_REQUESTS.slice(0, limit);
}
