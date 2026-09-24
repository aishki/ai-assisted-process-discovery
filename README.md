# Handoff: BITS Knowledge Base (Automation Portal, Module 1)

## Overview
Module 1 of the BITS Automation Portal for Carelon Global Solutions Philippines (CGSPH). This is a self-service knowledge base with no role gating, where associates read platform guides, flows, standards and templates before they request an automation. Module 2 (the gated automation request) is out of scope here; this module only links to it through "New request", the "Before you request" banner and the menu.

## About the design files
The files in this bundle are **design references created in HTML**. They show the intended look and behaviour; they are not production code to copy. Recreate them in the target codebase's existing environment and patterns. If no codebase exists yet, pick a suitable stack; the team's proposal names React + REST + PostgreSQL for web apps.

`Knowledge Base.dc.html` is a single-file prototype. The markup is between `<x-dc>` tags, and the logic, including all sample data, is in the `<script data-dc-script>` class at the bottom. Open it in a browser through a local server (for example `npx serve .`) so relative paths resolve.

## Fidelity
**High-fidelity.** Colours, type, radii and spacing are final and follow the BITS Design System (Carelon/Elevance purple-led brand). Content is partly placeholder (see Data).

## Screen: Knowledge base

### Layout
- Full-height column: sticky header (72px), then a CSS grid body.
- Grid at ≥1200px wide: `288px | minmax(0,1fr) | 300px` (left sidebar, main, right rail).
- Below 1200px: `288px | 1fr`, and the right rail wraps under main (it spans column 2).
- Below 820px: the left sidebar narrows to 240px.

### Header (sticky, white, bottom border `1px rgba(0,0,0,0.12)`)
- Hamburger button: 44×44, radius 22, three 2px purple bars, hover bg `#EBE4FF`. Opens the menu drawer.
- Wordmark: "BITS" 20/600 `#5009B5`, then "Knowledge Base" 16/500 `#231E33`.
- Search pill, centred: max-width 520, height 42, radius 21, bg `#F5F5F5`, inset ring `1px #EBE4FF`, purple magnifier icon. Placeholder: "Ask a question or search the knowledge base".
- Right side: "New request" solid purple pill button, and a 38px avatar circle (bg `#EBE4FF`, initials 14/600 `#5009B5`).

### Left sidebar: module tree (bg `#F5F5F5`, right border `rgba(0,0,0,0.08)`, padding 24/18)
- Header row: "MODULES" 13/600, 0.08em tracking, `#5009B5`; the count (15) on the right in 12/500 at 60% ink.
- 15 top-level modules. Each is a row button: padding 9/8, radius 10, hover `#EBE4FF`, caret ▸/▾ (11px), title 15px.
  - Active module (it contains the selected page): title 600 `#5009B5`, purple caret.
  - Inactive: title 400 `#231E33`, caret at 50% ink.
- Clicking a module toggles it open or closed. Several can be open at once.
- Open module children: indented list, left margin 15, padding-left 14, left border `1px #D6CCF0`. Each child is a 14px button, padding 7/10, radius 8.
  - Selected child: bg `#FFFFFF`, 600 `#5009B5`.
  - Other children: transparent, 400 `#231E33`, hover `#EBE4FF`.
- Selecting a child also opens its parent module.

### Main (padding 32/44/56, 28px vertical gap)
1. **"Before you request" banner** (dismissible):
   - bg `#2B1B49`, radius 20, padding 28/32, overflow hidden.
   - Carelon supergraphic SVG placed top-right, 720px wide, 45% opacity, cropped by the banner.
   - Eyebrow "BEFORE YOU REQUEST": 13/600, `#C9A8FF`.
   - Headline "Complete the four qualification checks first": 26/500, −0.02em, white.
   - Body 15/1.5, `#E6D9FE`.
   - Buttons: "Open checklist" (inverse pill) jumps to *Start here › Before you request checklist*; a 40px ✕ outline circle dismisses the banner.
   - The row wraps at narrow widths.
2. **Breadcrumb**: "Knowledge base / {Module} / {Page}", 13px at 60% ink. The last crumb is `#5009B5` 500. It wraps.
3. **Title**: H1 40/500, line-height 1.15, −0.02em, `#5009B5`.
4. **Meta chips** (font Inter):
   - "Owner · {name}": bg `#EBE4FF`, 12/600 purple, radius 20, padding 5/12.
   - "Reviewed {date}": inset ring `#EBE4FF`, 12/500.
5. **Summary**: max-width 760, 18/1.6, +0.01em.
6. **Cards** (optional): grid `repeat(auto-fit, minmax(220px,1fr))`, gap 20. Each card is white, radius 15, **inset 1px `#EBE4FF` ring, no shadow**, padding 24, with a title 18/600 and a body 14/1.5 at 75% ink.
7. **"In this section"**: heading 18/600, then resource rows. Each row has padding 16/4, top border `#EBE4FF`, a 34px purple-tint document icon tile (radius 10), the title (15px) and the kind (for example "Template · .docx", 12/500 Inter at 60% ink).
8. **Previous/next**: top border `1px #5009B5`; "← {prev page}" and "{next page} →" in 14/600 purple. These step through every child page in tree order and wrap around at either end.

### Right rail (padding 32/24, left border, 28px gap)
- **Recently updated**: each item is a date line (12/500 Inter at 60%) and a title line (14px).
- **My requests** card (inset ring, radius 15, padding 20):
  - Each row is an ID (13/600 Inter) and a status pill (11/600, radius 20).
  - Pill colours: AI review = `#5009B5` bg, white text · Needs info = `#F2BC35` bg, `#231E33` text · Draft = `#EBE4FF` bg, purple text.
  - The card ends with a "View all requests →" link.
- **Ask the knowledge base** (bg `#EBE4FF`, radius 15): title 16/600 purple, the note "Answers are drafts and link back to the source page.", and a white pill input (38px tall).

### Menu drawer (from the hamburger)
- Scrim: fixed, `rgba(35,30,51,0.5)`; clicking it closes the drawer.
- Panel: fixed left, 320px wide, white, `--shadow-lg`.
- Header: "BITS" plus a 40px ✕ button in a tint circle.
- Groups: labels are 12/600 uppercase at 60% ink. Items are 15px, padding 11/10, radius 10, hover `#EBE4FF`. The active item ("Knowledge base") gets a tint bg, 600 weight and purple text.
  - **Everyone:** Home · Knowledge base · Before you request · Templates library · Past projects portfolio · FAQs and glossary
  - **My work:** Request an automation · My requests · Requests I am POC on · Saved pages
  - **BITS team:** Request queue · Module ownership and reviews. Show these by assignment, not by a fixed role.
- Footer: "© 2026 CGSPH. All rights reserved." above a 1px purple rule.

## Interactions and state
- `open: {[moduleIndex]: bool}`: which modules are expanded. Default: Platform guides.
- `sel: {mi, ci}`: the selected module and child. Default: Platform guides › Power Apps.
- `banner: bool`: whether the banner is dismissed. Persist this per user in production.
- `menu: bool`: whether the drawer is open.
- Container width comes from a ResizeObserver and drives the responsive columns. Use CSS media or container queries in production.
- Colour transitions are 200ms `cubic-bezier(0.2,0,0.2,1)`. There is no layout motion.
- Focus is shown as a 2px `#0C7DB6` ring at a 2px offset.

## Data (replace with an API)
The prototype's `MODULES` array holds `{title, children:[{title, owner, updated, summary, cards[], resources[]}]}`.

- **Real draft content:** Start here, and Platform guides (Power Apps, Web app, Desktop app, Selection criteria).
- **Placeholder content:** every other child.
- **Unconfirmed modules:** Requirements and discovery, Standards and conventions, Testing and UAT, and Support and maintenance are filler added to reach 15. Confirm them with the team.

Suggested endpoints:
- `GET /modules` returns the tree.
- `GET /pages/:id` returns a page.
- `GET /updates?limit=3` returns recent updates.
- `GET /me/requests?limit=3` returns the current user's requests.
- `POST /kb/ask` returns a draft answer with source page links.

## Design tokens
- **Colours:**
  - Primary: `#5009B5`, hover `#3E0790`, press `#280559`
  - Ink: `#231E33`
  - Surfaces: white, `#F5F5F5`, dark `#2B1B49`
  - Tints: `#EBE4FF`, `#E6D9FE`, `#D6CCF0`, `#C9A8FF`
  - Warning: `#F2BC35`
  - Hairline: `rgba(0,0,0,0.12)`
- **Type:**
  - *Elevance Sans* (brand). Font files are pending from Brandhub; it falls back to the system UI font.
  - *Inter* for chips, meta and IDs.
  - Headlines use weight 500, and buttons and nav use 600.
  - Scale: 40 / 26 / 20 / 18 / 16 / 15 / 14 / 13 / 12.
  - Tracking is −0.02em at 24px and above.
- **Radii:** 8 (tree child) · 10 (rows, icon tiles) · 15 (cards) · 20 (banner, pills) · full (icon buttons).
- **Spacing:** 8-based; section gap 28, card gap 20, gutters 24–44.
- **Cards** use an inset `#EBE4FF` ring and no shadow. Shadows are only for floating elements (the drawer).

## Assets
- `assets/graphics/supergraphic-connection-1.svg`: the Carelon supergraphic, the only sanctioned gradient.
- Icons: the magnifier and document icons are inline SVGs. In production, use Material Symbols Outlined. Brand rule: no cross, shield or caduceus icons, and no emoji.
- Logos: replace the text wordmark with the official BITS/Carelon lockup from Brandhub.

## Files
- `Knowledge Base.dc.html`: the hi-fi prototype, which is the source of truth.
- `Knowledge Base Wireframe.dc.html`: the low-fi options. 1a is the layout, 1b is the sidebar, and 1d is the menu.
- `assets/graphics/supergraphic-connection-1.svg`
