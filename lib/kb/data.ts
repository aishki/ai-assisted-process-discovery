import type { KbModuleSource, KbRequest, KbUpdate } from "./types";

// Sample content from the design handoff. Start here and Platform guides hold real
// draft content; every other page is placeholder. Requirements and discovery,
// Standards and conventions, Testing and UAT, and Support and maintenance are
// unconfirmed filler modules — confirm them with the team.
export const MODULES: KbModuleSource[] = [
  { title: "Start here", children: [
    { title: "Before you request checklist", owner: "Isabel", updated: "February 4, 2026", summary: "Four checks must pass before the automation request opens: an identified opportunity, an uploaded project charter, a named POC and an uploaded project storyboard. Each yes needs evidence, so the gate cannot be clicked through.",
      cards: [{ title: "Opportunity identified", body: "Reference to the logged opportunity is required." }, { title: "Project charter", body: "Upload the signed charter using the library template." }, { title: "POC identified", body: "Name the process owner who will answer follow-ups." }, { title: "Project storyboard", body: "Upload the current-to-future process storyboard." }],
      resources: [{ title: "Project charter template", kind: "Template · .docx" }, { title: "Storyboard template", kind: "Template · .pptx" }, { title: "What happens if a check fails", kind: "Guide · 3 min" }] },
    { title: "Request process and timelines", owner: "Adrian", updated: "January 28, 2026", summary: "How a request moves from draft to approved, who reviews it at each step, and how long each stage usually takes.",
      cards: [{ title: "Draft to submitted", body: "The requester completes the form and AI interview." }, { title: "AI review", body: "Readiness score and open questions are generated." }, { title: "ABA and manager review", body: "Scope, priority and platform are decided." }],
      resources: [{ title: "Status definitions", kind: "Reference" }, { title: "Typical review times", kind: "Reference" }] },
  ] },
  { title: "Platform guides", children: [
    { title: "Power Apps", owner: "Isabel", updated: "February 4, 2026", summary: "Power Apps suits internal tools with a known user group, data held in SharePoint or Dataverse, and approved connectors. It is the fastest route for forms, trackers and approval flows.",
      cards: [{ title: "When it fits", body: "Under 500 users, standard connectors, form-driven workflows." }, { title: "Limits", body: "Delegation limits on large lists; premium connectors need licensing." }, { title: "Typical build", body: "Canvas app with Power Automate flows for approvals." }],
      resources: [{ title: "Choosing between Power Apps and a web app", kind: "Guide · 6 min" }, { title: "Licensing and approved connectors", kind: "Reference" }, { title: "Power Apps screen template", kind: "Template · .msapp" }] },
    { title: "Web app", owner: "Adrian", updated: "January 28, 2026", summary: "Web apps suit tools with many users, complex logic or integrations outside the Power Platform. Built and hosted by BITS on the approved stack.",
      cards: [{ title: "When it fits", body: "Large user base, custom logic, external data sources." }, { title: "Limits", body: "Longer build time and a hosting review before release." }, { title: "Typical build", body: "React front end with a REST API and PostgreSQL." }],
      resources: [{ title: "Web app development flow, v2", kind: "Guide · 8 min" }, { title: "Hosting and deployment", kind: "Reference" }] },
    { title: "Desktop app", owner: "Adrian", updated: "December 12, 2025", summary: "Desktop apps suit tasks tied to local files or legacy systems that cannot be reached from the browser.",
      cards: [{ title: "When it fits", body: "Local file processing, legacy system automation." }, { title: "Limits", body: "Needs install and update management per machine." }],
      resources: [{ title: "Desktop packaging checklist", kind: "Reference" }] },
    { title: "Selection criteria", owner: "Isabel · Adrian", updated: "February 4, 2026", summary: "How BITS chooses a platform: number of users, data sources, integration needs, complexity and support model.",
      cards: [{ title: "Users", body: "Who uses it and how many." }, { title: "Data", body: "Where it lives and how sensitive it is." }, { title: "Complexity", body: "Logic, integrations and scale." }],
      resources: [{ title: "Platform decision matrix", kind: "Template · .xlsx" }] },
  ] },
  { title: "Development flows", children: [{ title: "Power Apps flow" }, { title: "Web app flow" }, { title: "UAT and release" }] },
  { title: "Requirements and discovery", children: [{ title: "Discovery categories" }, { title: "Writing good requirements" }] },
  { title: "Standards and conventions", children: [{ title: "Naming conventions" }, { title: "Code review standards" }] },
  { title: "Testing and UAT", children: [{ title: "Test planning" }, { title: "UAT sign-off" }] },
  { title: "Support and maintenance", children: [{ title: "Support model" }, { title: "Change requests" }] },
  { title: "Frameworks and tech stack", children: [{ title: "Approved stack" }, { title: "Libraries and tools" }] },
  { title: "Architecture and patterns", children: [{ title: "Solution patterns" }, { title: "Integration patterns" }] },
  { title: "Environments and licensing", children: [{ title: "Environments" }, { title: "Licensing" }, { title: "Approved connectors" }] },
  { title: "Security and data handling", children: [{ title: "Data classification" }, { title: "Access and permissions" }] },
  { title: "Templates library", children: [{ title: "Charter and storyboard" }, { title: "UAT checklist" }] },
  { title: "Past projects portfolio", children: [{ title: "By platform" }, { title: "By department" }] },
  { title: "Developer directory", children: [{ title: "BITS developers" }, { title: "Skills and availability" }] },
  { title: "FAQs and glossary", children: [{ title: "FAQs" }, { title: "Glossary" }] },
];

export const UPDATES: KbUpdate[] = [
  { when: "2 days ago", what: "Approved connectors list revised" },
  { when: "Last week", what: "New UAT checklist template added" },
  { when: "January 28, 2026", what: "Web app development flow, v2" },
];

export const MY_REQUESTS: KbRequest[] = [
  { id: "ATT-014", status: "AI review" },
  { id: "ATT-011", status: "Needs info" },
  { id: "ATT-009", status: "Draft" },
];
