export const kbPageHref = (moduleSlug: string, pageSlug: string) =>
  `/knowledge-base/${moduleSlug}/${pageSlug}`;

export const KB_HOME_HREF = "/knowledge-base";
export const CHECKLIST_HREF = kbPageHref("start-here", "before-you-request-checklist");
export const kbSearchHref = (q: string) => `/knowledge-base/search?q=${encodeURIComponent(q)}`;

/** id of the Ask the knowledge base input, so other pages can link straight to it. */
export const ASK_INPUT_ID = "kb-ask";

export const HOME_HREF = "/home";
export const NEW_REQUEST_HREF = "/requests/new";
export const MY_REQUESTS_HREF = "/requests";
export const POC_REQUESTS_HREF = "/requests/poc";
export const SAVED_PAGES_HREF = "/saved";
export const REQUEST_QUEUE_HREF = "/queue";
export const OWNERSHIP_HREF = "/ownership";
export const PROFILE_HREF = "/profile";
export const requestHref = (id: string) => `/requests/${id}`;

/**
 * Portal areas outside Module 1. Each renders a "coming soon" page until it is built,
 * so no control in the knowledge base leads nowhere.
 */
export type PlaceholderArea = { title: string; body: string; module?: string };

export const PLACEHOLDERS = {
  home: {
    title: "Automation Portal home",
    body: "Your starting point for the knowledge base, your requests and team updates.",
  },
  newRequest: {
    title: "Request an automation",
    module: "Module 2",
    body: "The gated request form opens after the four qualification checks pass. Until it is live, get your evidence ready with the checklist.",
  },
  myRequests: {
    title: "My requests",
    module: "Module 2",
    body: "Track every request you have raised, see its status and answer follow-up questions from reviewers.",
  },
  pocRequests: {
    title: "Requests I am POC on",
    module: "Module 2",
    body: "Requests that name you as the process owner, so you can answer reviewer questions quickly.",
  },
  saved: {
    title: "Saved pages",
    body: "Knowledge base pages you have saved for later, in one list.",
  },
  queue: {
    title: "Request queue",
    module: "BITS team",
    body: "Incoming requests for review, with readiness scores and open questions from the AI review.",
  },
  ownership: {
    title: "Module ownership and reviews",
    module: "BITS team",
    body: "Who maintains each knowledge base module, and which pages are due for review.",
  },
  profile: {
    title: "Your profile",
    body: "Your details, notification settings and sign out.",
  },
} satisfies Record<string, PlaceholderArea>;

export type MenuGroup = { group: string; items: { label: string; href: string }[] };

export const MENU: MenuGroup[] = [
  {
    group: "Everyone",
    items: [
      { label: "Home", href: HOME_HREF },
      { label: "Knowledge base", href: KB_HOME_HREF },
      { label: "Before you request", href: CHECKLIST_HREF },
      { label: "Templates library", href: kbPageHref("templates-library", "charter-and-storyboard") },
      { label: "Past projects portfolio", href: kbPageHref("past-projects-portfolio", "by-platform") },
      { label: "FAQs and glossary", href: kbPageHref("faqs-and-glossary", "faqs") },
    ],
  },
  {
    group: "My work",
    items: [
      { label: "Request an automation", href: NEW_REQUEST_HREF },
      { label: "My requests", href: MY_REQUESTS_HREF },
      { label: "Requests I am POC on", href: POC_REQUESTS_HREF },
      { label: "Saved pages", href: SAVED_PAGES_HREF },
    ],
  },
  {
    // Shown by assignment, not a fixed role — gate on the user's assignments once auth exists.
    group: "BITS team",
    items: [
      { label: "Request queue", href: REQUEST_QUEUE_HREF },
      { label: "Module ownership and reviews", href: OWNERSHIP_HREF },
    ],
  },
];

/**
 * The menu item for the current path: an exact match wins, otherwise the longest item
 * whose href is a prefix (so any knowledge base page highlights "Knowledge base").
 */
export function activeMenuHref(pathname: string): string | null {
  const hrefs = MENU.flatMap((g) => g.items.map((i) => i.href));
  if (hrefs.includes(pathname)) return pathname;
  const prefixes = hrefs.filter((h) => pathname.startsWith(`${h}/`));
  return prefixes.sort((a, b) => b.length - a.length)[0] ?? null;
}
