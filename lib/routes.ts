export const kbPageHref = (moduleSlug: string, pageSlug: string) =>
  `/knowledge-base/${moduleSlug}/${pageSlug}`;

export const CHECKLIST_HREF = kbPageHref("start-here", "before-you-request-checklist");

// Module 2 (gated automation request) and the other portal areas are out of scope for
// this build. Point these at real routes as they land.
export const NEW_REQUEST_HREF = "#";
export const MY_REQUESTS_HREF = "#";

export type MenuGroup = { group: string; items: { label: string; href: string }[] };

export const MENU: MenuGroup[] = [
  {
    group: "Everyone",
    items: [
      { label: "Home", href: "#" },
      { label: "Knowledge base", href: "/knowledge-base" },
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
      { label: "Requests I am POC on", href: "#" },
      { label: "Saved pages", href: "#" },
    ],
  },
  {
    // Shown by assignment, not a fixed role — gate on the user's assignments once auth exists.
    group: "BITS team",
    items: [
      { label: "Request queue", href: "#" },
      { label: "Module ownership and reviews", href: "#" },
    ],
  },
];
