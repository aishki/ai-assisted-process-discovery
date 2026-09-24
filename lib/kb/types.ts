export type KbCard = { title: string; body: string };

/** `link` is "module-slug/page-slug" of the knowledge base page the resource lives on. */
export type KbResourceSource = { title: string; kind: string; link?: string };

export type KbPageSource = {
  title: string;
  updated?: string;
  summary?: string;
  cards?: KbCard[];
  resources?: KbResourceSource[];
};

export type KbModuleSource = { title: string; children: KbPageSource[] };

export type KbResourceType = "template" | "guide" | "reference";

/** A resource row. `href` is null until the file or page exists. */
export type KbResource = { title: string; kind: string; type: KbResourceType; href: string | null };

/** Tree node returned by GET /modules. */
export type KbModule = {
  slug: string;
  title: string;
  children: { slug: string; title: string }[];
};

export type KbPageLink = { moduleSlug: string; pageSlug: string; title: string };

/** Page returned by GET /pages/:id, plus its tree-order neighbours. */
export type KbPage = {
  moduleSlug: string;
  moduleTitle: string;
  /** First page of the module; modules have no landing page yet. */
  moduleHref: string;
  slug: string;
  title: string;
  updated: string;
  summary: string;
  cards: KbCard[];
  resources: KbResource[];
  prev: KbPageLink;
  next: KbPageLink;
};

export type KbUpdateSource = { when: string; what: string; link?: string };

export type KbUpdate = { when: string; what: string; href: string | null };

export type RequestStatus = "AI review" | "Needs info" | "Draft";

export type KbRequest = { id: string; status: RequestStatus };

/** One searchable entry: a page, or a resource listed on a page. */
export type KbSearchEntry = {
  kind: "page" | "resource";
  title: string;
  /** Where it sits, e.g. "Platform guides" or "Platform guides › Power Apps". */
  context: string;
  text: string;
  href: string;
};

export type KbSearchHit = KbSearchEntry & { score: number };

/** Response of POST /kb/ask. `answer` is null when nothing relevant was found. */
export type KbAskResponse = {
  answer: string | null;
  sources: { title: string; context: string; href: string }[];
};
