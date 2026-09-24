export type KbCard = { title: string; body: string };

export type KbResource = { title: string; kind: string };

export type KbPageSource = {
  title: string;
  updated?: string;
  summary?: string;
  cards?: KbCard[];
  resources?: KbResource[];
};

export type KbModuleSource = { title: string; children: KbPageSource[] };

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
  slug: string;
  title: string;
  updated: string;
  summary: string;
  cards: KbCard[];
  resources: KbResource[];
  prev: KbPageLink;
  next: KbPageLink;
};

export type KbUpdate = { when: string; what: string };

export type RequestStatus = "AI review" | "Needs info" | "Draft";

export type KbRequest = { id: string; status: RequestStatus };
