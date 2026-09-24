# BITS Design System

The design system for **BITS — Business Intelligence & Transformation Solutions**, the
automation team inside **Carelon Global Solutions Philippines (CGSPH)**. BITS builds the
internal tools that automate Operations' own processes: attendance tagging, request
tracking, reporting, facilities intake, and the *Brainwave* employee-innovation platform.

The surface this system dresses is the **BITS internal webpage** — a small marketing-style
site aimed at CGSPH colleagues: a landing carousel, a filterable gallery of offered tools,
a tool-detail template, and a news section. It sits inside the Carelon / Elevance Health
corporate brand (purple-led), not the Wellpoint navy/magenta brand.

## Sources this was built from

| Source | What was taken from it |
|---|---|
| Figma: **BITS webpage 2.0 Dev Copy.fig** (mounted, page `BITS-Webpage-2.0`, 134 frames) | The whole component inventory, every exact size/radius/colour, all copy, all imagery and logos, the 22 Figma Variables in `tokens/fig-tokens.css` |
| Upload: **`uploads/branding.png`** | The Carelon/Elevance corporate primary + secondary colour palettes, with Pantone/CMYK/RGB/HEX and the accessible-text substitutes |
| Codebase: **`design/`** (read-only mount) | `SKILL.md`, `reference.md`, `elevance-corporate-alt.md`, `typography-setup.md` — the Wellpoint Digital Guidelines write-up, the Elevance-corporate alt palette, the Elevance Sans weight table, the icon brand-safety rules, the 12-col grid and the `8…128` spacing scale |
| Figma: **Wellpoint Digital Guide.fig** | **Not accessible.** It was named in the brief (frames `Wellpoint-Digital-Guidelines`, `Categorical-Icons-7-7`) but the mounted virtual filesystem only exposes the BITS file. Nothing from it was guessed — the Wellpoint material here comes from the `design/` codebase write-up instead. Re-attach it if those frames matter. |

No public-web reference was used as a substitute for the file.

## Index

- `styles.css` — the single entry point consumers link. `@import` list only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css`, plus generated `fig-tokens.css` (the Figma Variables).
- `components/` — the reusable primitives, grouped `core/ forms/ content/ navigation/ brand/ chrome/ stars/`. Each has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and one `@dsCard` HTML per directory.
- `guidelines/` — the foundation specimen cards (Colors, Type, Spacing, Brand).
- `ui_kits/bits-web/` — click-through recreation of the site. See its `README.md`.
- `templates/bits-page/` — a starting-point page template consuming projects can copy.
- `assets/` — `logos/`, `graphics/`, `imagery/`, `icons/`.
- `thumbnail.html` — the homepage tile.
- `SKILL.md` — Agent-Skills-compatible entry point.

### Components

**core** — `PurpleButton`, `TertiaryButton`, `ArrowButton`, `ChevronButton`, `Pager`
**forms** — `Checkbox`, `FilterCheckbox`, `FilterChip`, `FilterGroup`, `FilterClearIcon`
**content** — `Hero`, `StatCard`, `ToolCard`, `NewsCard`, `SectionHeading`, `SectionParagraph`, `Testimonial`, `AwardBanner`, `TitleAndBodySection`
**navigation** — `Navbar`, `Footer`, `BackButton`
**brand** — `LogoLockup`, `Supergraphic`
**chrome** — `BrowserFrame`, `MacOSWindowButtons`, `SafariIcon`
**stars** — `StarIcon` (the ergonomic wrapper: `<StarIcon name="StarFilledPlain" />`), plus
one thin alias component per source symbol so the kit's vocabulary maps 1:1:
`StarCombo1`, `StarCombo2`, `StarCombo3`, `StarCombo4`, `StarCombo5`, `StarCombo6`,
`StarCombo7`, `StarCombo8`, `StarFilledLong`, `StarFilledPlain`, `StarFilledRay`,
`StarFilledSmoothinnercorner`, `StarFilledSmoothray`, `StarFilledThin`,
`StarFilledThinsmooth`, `StarFilledWide`, `StarFilledcirclePlain1`,
`StarFilledcirclePlain2`, `StarFilledcirclePlain3`, `StarFilledcirclePlain4`,
`StarFilledcirclePlain5`, `StarFilledcirclePlain6`, `StarFilledcirclePlain7`,
`StarFilledcirclePlain8`, `StarFilledovalPlain1`, `StarFilledovalPlain2`,
`StarFilledovalPlain3`, `StarFilledovalPlain4`, `StarFilledovalPlain5`,
`StarFilledovalPlain6`, `StarFilledovalPlain7`, `StarFilledovalPlain8`, `StarStrokeLong`,
`StarStrokePlain`, `StarStrokeRaydown`, `StarStrokeSmoothcorner`, `StarStrokeSmoothray`,
`StarStrokeThin`, `StarStrokeThinsmooth`, `StarStrokeWide`, `StarStrokecircleLong1`,
`StarStrokecircleLong2`, `StarStrokecircleLong3`, `StarStrokecircleLong4`,
`StarStrokecircleLong5`, `StarStrokecircleLong6`, `StarStrokecircleLong7`,
`StarStrokecircleLong8`, `StarStrokeovalRaydown1`, `StarStrokeovalRaydown2`,
`StarStrokeovalRaydown3`, `StarStrokeovalRaydown4`, `StarStrokeovalRaydown5`,
`StarStrokeovalRaydown6`, `StarStrokeovalRaydown7`, `StarStrokeovalRaydown8`.

### How the names map to the Figma file

The source file names most of its reusable pieces as frames rather than Figma component
sets, so the component names here are the file's own layer names, PascalCased:

| Component | Source name |
|---|---|
| `PurpleButton` | `purple-button` (solid / outline / on-dark instances) |
| `TertiaryButton` | `Tertiary Button` (library symbol `42:171`) |
| `ArrowButton` | `Arrow Button` |
| `ChevronButton` | `Chevron` (48px carousel control) |
| `Pager` / dot | `Pager` / `Active` |
| `Checkbox` | `& Checkbox` — the 18-variant library family (State × Disabled × Size) |
| `FilterCheckbox` | `& Checkbox` — the 2-state squircle family (`state=true` / `state=false`) |
| `FilterChip` | `filtter-1` |
| `FilterGroup` | `filter-group` |
| `FilterClearIcon` | `filter_alt_off_24dp_5009B5_FILL0_wght400_GRAD0_opsz24 1` (2 states) |
| `Hero` | `Landing` / `Hero-Component` hero block |
| `StatCard` | `Stat` (inside `stats-component`) |
| `ToolCard` | `Card` (`115:973`, inside `offered-tools`) |
| `NewsCard` | `Card` (`105:614`, inside `news`) |
| `SectionHeading` | the `Subtitle` + `Title` pair repeated in every section |
| `SectionParagraph` | `paragraph-component` |
| `Testimonial` | `testimonial-component` |
| `AwardBanner` | `award-component` |
| `TitleAndBodySection` | `title-and-body-section-v1` / `-v2` |
| `Navbar` / `Footer` / `BackButton` | `navbar` / `Footer-Light` / `back-btn 1` |
| `LogoLockup` | `Logo` group (three marks) |
| `Supergraphic` | `crl_supergraphic_linear_connection` / `_focus` |
| `MacOSWindowButtons` / `SafariIcon` / `BrowserFrame` | `Chrome / MacOS window buttons`, `Safari / Icons` (6 types), `Browser` |
| `StarIcon` | the 56 `star/*` symbols |

### Figma kit coverage — 63 families → 28 components, all accounted for

The file's inventory is 4 component sets + 59 standalone symbols = 63 "families". Every
one is implemented; the count differs only because families were folded where the file
itself is repetitive:

| Source families | Count | Implemented as |
|---|---|---|
| `star/filled/*`, `star/stroke/*`, `star/combo/*`, `star/filledcircle/*`, `star/filledoval/*`, `star/strokecircle/*`, `star/strokeoval/*` | 56 | **One alias component per symbol** (`StarFilledPlain`, `StarCombo1`, …) over a shared **`StarIcon`** wrapper. Each symbol's real path data is in `components/stars/icon-data.js`; nothing was dropped or redrawn. |
| `Safari / Icons` (Type: 6 variants) | 1 | **`SafariIcon`** — `type` prop covers all six. *Renamed:* the source name isn't a valid identifier. |
| `& Checkbox` (State × Disabled × Size, 18 variants) | 1 | **`Checkbox`** |
| `& Checkbox` (state: 2) | 1 | **`FilterCheckbox`** |
| `filter_alt_off_24dp_5009B5_...` (state: 2) | 1 | **`FilterClearIcon`**. *Renamed:* the source name is a Material Symbols export filename. |
| `Chrome / MacOS window buttons` | 1 | **`MacOSWindowButtons`**. *Renamed:* the source name isn't a valid identifier. |
| `filter-group` | 1 | **`FilterGroup`** |
| `Tertiary Button` | 1 | **`TertiaryButton`** |
| **Total** | **63** | **nothing skipped** |

Three families therefore show as "not built" to any tool matching on literal names —
`Safari / Icons`, `Chrome / MacOS window buttons/MacOS window buttons` and
`filter_alt_off_24dp_5009B5_FILL0_wght400_GRAD0_opsz24 1`. They **are** built, as
`SafariIcon`, `MacOSWindowButtons` and `FilterClearIcon`; their source names cannot be
JavaScript exports.

The remaining 20 components (`Hero`, `Navbar`, `Footer`, `ToolCard`, `NewsCard`,
`StatCard`, `Testimonial`, `AwardBanner`, `SectionParagraph`, `SectionHeading`,
`TitleAndBodySection`, `PurpleButton`, `ArrowButton`, `ChevronButton`, `Pager`,
`BackButton`, `FilterChip`, `LogoLockup`, `BrowserFrame`, `Supergraphic`) are **not**
inventions — they are the file's reusable pieces, which its author drew as named **frames**
rather than promoting to Figma component sets. Their source layer names are in the
mapping table above (`purple-button`, `navbar`, `Footer-Light`, `Card` 115:973, `Card`
105:614, `Stat`, `testimonial-component`, `award-component`, `paragraph-component`,
`title-and-body-section-v1/v2`, `Arrow Button`, `Chevron`, `Pager`, `back-btn 1`,
`filtter-1`, `Logo`, `Browser`, `crl_supergraphic_linear_connection`). A tool inspecting
only the file's *component sets* won't see them; they are in the file all the same.

**Genuine additions — 2, both wrappers, no new visual design:**

- `StarIcon` — the 56-symbol wrapper described above.
- `Supergraphic` — a positioning wrapper so the brand asset is always placed and cropped
  the same way.

Nothing else was invented: there is no Input, Select, Switch, Tabs, Dialog, Toast or
Tooltip here because the source file defines none.

### Intentional additions

These 24 component names have no matching Figma **component set** name and are confirmed
intentional. Each row says what it is and why the name differs.

| Component | Reason |
|---|---|
| `PurpleButton` | Source frame `purple-button` (frame, not a component set) |
| `ArrowButton` | Source frame `Arrow Button` |
| `ChevronButton` | Source frame `Chevron` (48px carousel control) |
| `Pager` | Source frames `Pager` + `Active` dot |
| `FilterChip` | Source frame `filtter-1` (typo in the file; renamed) |
| `FilterClearIcon` | Family `filter_alt_off_24dp_5009B5_FILL0_wght400_GRAD0_opsz24 1` — source name is an export filename, not a valid identifier |
| `Hero` | Source frames `Landing` / `Hero-Component` hero block |
| `StatCard` | Source frame `Stat` (inside `stats-component`) |
| `ToolCard` | Source frame `Card` (`115:973`, inside `offered-tools`) — renamed to disambiguate from the news `Card` |
| `NewsCard` | Source frame `Card` (`105:614`, inside `news`) — same disambiguation |
| `SectionHeading` | The `Subtitle` + `Title` pair repeated in every section |
| `SectionParagraph` | Source frame `paragraph-component` |
| `Testimonial` | Source frame `testimonial-component` |
| `AwardBanner` | Source frame `award-component` |
| `TitleAndBodySection` | Source frames `title-and-body-section-v1` / `-v2` |
| `Navbar` | Source frame `navbar` |
| `Footer` | Source frame `Footer-Light` |
| `BackButton` | Source frame `back-btn 1` |
| `LogoLockup` | Source group `Logo` (three brand marks) |
| `Supergraphic` | Addition — positioning wrapper for `crl_supergraphic_linear_connection` / `_focus` |
| `BrowserFrame` | Source frame `Browser` |
| `MacOSWindowButtons` | Family `Chrome / MacOS window buttons/MacOS window buttons` — source name isn't a valid identifier |
| `SafariIcon` | Family `Safari / Icons` (Type: 6) — source name isn't a valid identifier |
| `StarIcon` | Addition — shared wrapper behind the 56 star alias components |

Only `Supergraphic` and `StarIcon` are true additions; the other 22 are the file's own
frames and library symbols, renamed only where the source name cannot be a JavaScript
export or collides with another.

**Derived (not measured) values, all flagged in code:** the inactive pager dot
(`Primary-300`), the M/L checkbox sizes (only S exists in the file), the primary hover
(`#3E0790`) and the amber/green window dots. Warning (`#F2BC35`) and error (`#D20A36`)
come from the Wellpoint guide in `design/`, not from the BITS file.

---

## Content fundamentals

**Voice: professional and techy, written by the team about the team.** First-person plural
for BITS, second person almost never. The pattern is *claim → mechanism → benefit*, one
sentence each.

- "At Business Intelligence and Transformation Solutions (BITS), we **believe innovation
  should empower— not overwhelm**."
- "We **don't just deliver tools—we deliver clarity, agility, and results**."
- "Looking ahead to 2026, we're focused on what matters most: advanced analytics and AI,
  intelligent automation, modern platforms, and a future-ready workforce."

**Casing:** sentence case everywhere — headlines, buttons ("What we offer", "Learn more",
"Read More" — the file is inconsistent on *More*; prefer "Read more"), nav tabs are the
exception and use Title Case ("What We Offer"). Never all-caps.

**Headline shape:** an eyebrow that names the topic (`2026: What's Next`, `Offered tools`,
`News and Updates`, `Innovation`) sits above a 64px statement that runs two lines and is
broken manually. Statements are declarative and present-tense: "Powering a smarter, more
connected CGSPH"; "Empowering progress through insight and innovation".

**Body copy** is 2–4 sentences, no bullets in the marketing sections, and uses the em dash
freely (often unspaced: "empower— not overwhelm", "tools—we deliver"). The file mixes
American and British spellings ("honours", "organisation", "recognized") — pick British
for press-release copy, American for product UI, and stay consistent within a page.

**Product copy** (tool descriptions) is plain, sequential and mechanical: what the tool
lets whom do, then what it improves. "Allows team leaders and supervisors to effectively
tag agents' daily attendance and promptly report any system-related issues. It simplifies
monitoring, ensures accurate documentation, and supports the timely resolution of
technical concerns."

**Numbers carry the argument.** Metrics are stated bare and large — `700+`, `32`, `11.5%`,
`5 Years` — each with a two-line gloss ("Employee Ideas" / "Submitted through the Brainwave
innovation platform.").

**No emoji, ever.** No exclamation marks. No "unlock/leverage/supercharge". Acronyms are
expanded on first use (BITS, CGSPH, IT-BPM). Dates are written out: "February 4, 2026".
Copyright line: "© 2026 CGSPH. All rights reserved."

---

## Visual foundations

**Colour.** One brand purple, `#5009B5`, does the heavy lifting: it is the headline
colour, the primary fill, the nav-tab colour, the footer rule and the icon colour. Body
text is `#231E33`. Surfaces are white or `#F5F5F5`; the one dark surface is `#2B1B49`
(news). Tints (`#EBE4FF`, `#E6D9FE`) carry rings, avatars and the arrow button. Cyan,
turquoise and light purple appear almost exclusively *inside the supergraphic asset* — as
flat UI they are used sparingly and never as backgrounds.

**Backgrounds are plain.** White, `#F5F5F5`, or `#2B1B49` — flat fills, full-bleed, edge
to edge. **No CSS gradients.** The single sanctioned gradient in the whole system is the
placed Carelon supergraphic (`assets/graphics/supergraphic-connection-*.svg`), dropped in
oversized and cropped by its frame so only a sweep of it is visible behind hero copy. If
you want visual energy, add a star glyph or a photograph — not a gradient.

**Type.** *Elevance Sans* for everything brand-facing; *Inter* for stats, tertiary buttons
and table chrome (that split is in the file, not a preference). Medium (500) is the default
display weight — headlines are 500, not bold; Semibold (600) is for nav, buttons and the
award line. Display sizes run 64 / 55 / 48 / 40 / 36; body is 20/30px with `+0.01em`
tracking; tight `−0.02em` tracking on everything 24px and up. Line-height is `100%` on
hero-scale type, `1.15–1.26` on titles, `1.5` on small copy.

**Layout.** A 1440px frame, 96px page gutter (70px on tool templates, 100px on the news
hero), 24px grid gap, 81px fixed navbar with a `rgba(0,0,0,0.12)` hairline. Sections are
full-bleed horizontal bands stacked vertically — the page is a stack of bands, never a
container-in-container. Section padding is 40–82px vertical. Hero content is centred and
capped at 1053px; body bands are left-aligned.

**Corners are rounded and modern.** 15px on cards, 16px on stat cards, 20px on pill
buttons and panels, 34px on large panels, 41px on the filter rail, full-round (108px) on
icon buttons. The filter checkbox is a squircle at the file's exact `10.140845px`.

**Cards** are white with a **1px `#EBE4FF` inset ring and no shadow** — that ring is the
system's card signature. Stat cards and news rows have neither ring nor shadow; they are
defined by padding alone. Shadows exist (`--shadow-md`, `--shadow-lg`) but are reserved for
things that float above the page, like the browser mockup.

**Borders & dividers.** Hairline `rgba(0,0,0,0.12)` under the navbar; a 1px **purple** rule
in the footer; `#CBD2DC` for neutral table borders.

**Interaction.** The source file is a static comp, so states are defined here, minimally
and consistently: hover darkens the primary fill to `#3E0790` (outline buttons fill with
`#EBE4FF`), press goes to `#280559`, no scale or bounce. Focus is a 2px `#0C7DB6` ring at
2px offset. Transitions are 200ms on `cubic-bezier(0.2,0,0.2,1)` for colour only — no
motion on layout. There are no entrance animations, no parallax, no marquees.

**Transparency and blur** are effectively unused: one `rgba(35,30,51,0.5)` for the
attribution line, `rgba(60,60,67,0.18)` for the unchecked control, and the navbar hairline.
No glassmorphism, no backdrop blur.

**Imagery** is real, warm, candid workplace photography — teams at desks, award nights,
office interiors — full-bleed and untinted, at natural colour (warm, slightly bright, no
grain, no duotone). Photos crop hard to the frame (`object-fit: cover`) and sit flush
against band edges with no rounding. Tool screenshots appear as-is, inside a 15px-rounded
crop or a browser mockup. Never place a photo behind text.

**Holographic accents** — the brief's "holographic" note is served by the supergraphic's
turquoise→purple→cyan ramp and by the 56 star/sparkle glyphs, used as small `currentColor`
accents on flat ground. Keep them sparse: one or two per band.

---

## Iconography

- **Functional / UI icons: Material Symbols — Outlined.** The one such icon in the source
  file is `filter_alt_off` at 24dp in brand purple (`filter_alt_off_24dp_5009B5_...`),
  which is exported to `assets/icons/filter-alt-off.svg` and wrapped as `FilterClearIcon`.
  Pull any additional UI icon from that same set (SVG or webfont, CC BY 4.0) at the same
  weight — never mix icon families in one screen.
- **Arrows are drawn, not iconised.** The site's motion cue is a hand-built line-and-head
  arrow: a horizontal rule plus a chevron, `0.643px`-radius stroke at 12px, 10px in small
  buttons, 20px rotated −45° in the round `ArrowButton`. The carousel chevron is a 16×8
  stroke at `1.125px` in `#303044`. The back button is a solid 33.3×26 purple arrow. All
  four are reproduced verbatim from the source vectors.
- **Star / sparkle glyphs** (`components/stars/`) — 56 real symbols from the file: filled,
  stroke, circle-inset, oval-inset and combo families. These are the decorative
  "holographic" accents. They paint with `currentColor`.
- **Logos are bitmaps** (`assets/logos/`): Carelon Global Solutions, OPS Support and BITS
  wordmarks, the Carelon four-node icon mark, and white lockups for dark grounds. The file
  contains **no SVG logo**, so nothing was traced or redrawn — use these PNGs, and if a
  vector is needed, request it from Brandhub.
- **Social icons**: the footer repeats one purple 28px glyph four times without naming the
  networks (`assets/icons/footer-social-glyph.svg`). Swap in real per-network marks when
  they are supplied.
- **Brand-safety rule (carried from `design/SKILL.md`, applies always):** never use cross,
  shield or caduceus symbols in any icon. Categorical (content-level) icons are navy or
  white and come from Brandhub only. **No emoji, and no unicode characters used as icons.**

---

## Known gaps

1. **No real font files.** `Elevance Sans` has no `@font-face` — the files in
   `design/assets/fonts/` are 211-byte AppleDouble stubs. `--font-brand` names *Elevance
   Sans* first and falls through to the system UI stack; no other typeface is substituted
   in its place, so specimens render off-metric until the real `.woff2`/`.otf` files land
   in `assets/fonts/`. `guidelines/typography-notes.md` has the `@font-face` block ready
   to paste. **Please upload them.**
2. **The Wellpoint Digital Guide .fig never mounted** — see the sources table.
3. **Two white brand bitmaps are unlabelled** in the source
   (`assets/logos/brand-lockup-white-2x1.png`); confirm which sub-brand it is.
4. **No interaction states in the source** — hover/press/focus values here are derived.
