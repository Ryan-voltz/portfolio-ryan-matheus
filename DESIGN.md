---
name: Ryan Matheus — General Arrangement
description: The portfolio of a solo systems developer, set as an engineering drawing sheet.
colors:
  sheet: "#eff1f2"
  field: "#e4e7e9"
  ink: "#111518"
  ink-2: "#4e585f"
  ink-3: "#5f6c73"
  rule: "#c3cace"
  rule-strong: "#7c888e"
  redline: "#c8271a"
  redline-ink: "#a8200f"
  plate-ink: "#fbfcfc"
  sheet-dark: "#0f1315"
  field-dark: "#171c1f"
  ink-dark: "#e8ecee"
  ink-2-dark: "#a5b0b6"
  ink-3-dark: "#79868d"
  rule-dark: "#2c3438"
  rule-strong-dark: "#5a666c"
  redline-dark: "#ff5340"
  redline-ink-dark: "#ff7361"
  plate-ink-dark: "#12100f"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.85rem, 8.2vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.032em"
    fontVariation: "'wdth' 92"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 2vw, 1.7rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.65rem, 1.1rem + 2.4vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.022em"
    fontVariation: "'wdth' 94"
  subtitle:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 0.95rem + 0.9vw, 1.45rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.98rem + 0.42vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  tag:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.13em"
    fontVariation: "'wdth' 92"
  label:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 88"
    fontFeature: "tabular-nums"
rounded:
  none: "0"
  hairline: "1px"
  circle: "50%"
spacing:
  row: "0.9rem"
  field-head: "1.5rem"
  list-row: "1.5rem"
  block: "2.25rem"
  field: "5rem"
  field-lg: "7rem"
  filing-margin: "11rem"
components:
  plate:
    backgroundColor: "{colors.redline}"
    textColor: "{colors.plate-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.95rem 1.4rem"
  plate-hover:
    backgroundColor: "transparent"
    textColor: "{colors.redline-ink}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.tag}"
    rounded: "{rounded.none}"
    padding: "0.6rem 0.85rem"
  chip-hover:
    textColor: "{colors.ink}"
  cartouche-label:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
    padding: "0.5rem 0.75rem"
  cartouche-value:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0.5rem 0.75rem"
  callout:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "3.25rem"
    height: "3.25rem"
  mount:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.none}"
  redline-note:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.15rem 1.25rem 1.25rem"
  schedule-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem 0"
---

# Design System: Ryan Matheus — General Arrangement

## Overview

**Creative North Star: "The General Arrangement Drawing"**

This is not a portfolio that shows work. It is the *drawing* of the work — the general-arrangement sheet an engineer produces between "we need a system" and "here is the system." Every page is a plotted sheet: a double border with registration ticks, a filing margin down the bound edge, hairline rules dividing the fields, section callouts pointing at mounted details, a schedule of parts, and a title block that closes the sheet. The subject is a developer who architects, builds, hardens and hands over business systems alone, and the sheet is the artifact that claim naturally produces.

The system's density is low and its precision is high. Nothing is decorated; everything is measured, labelled or ruled. Type is set at two extremes — a heading at drawing scale and a lettered label at 11px — with very little in between, exactly as a real sheet is lettered. The one saturated field on any screen is the primary action.

The rejected reference is the category default this world exists to refuse: the developer portfolio as a hero band over a grid of same-size project cards, with a gradient headline and a soft-shadowed card lift on hover. There is no gradient, no card lift and no shadow anywhere in this system.

**Key Characteristics:**
- Line, label and field — never fill, shadow or ornament.
- One accent, drafting redline, reserved for revision, state and the single primary action.
- Two lettering registers (drawing gothic and dimension mono) with a strict division of labour.
- Every claim that can be measured is drawn as a dimension, not written as an adjective.
- Sheets, not pages: home is sheet 01, each case sheet 02–04, and the set is numbered on every screen.

## Colors

A cool, neutral drafting palette in both themes, with exactly one saturated colour. Light is vellum under office light; dark is drafting film on a light table. Neither is a default — the site follows `prefers-color-scheme` and has no toggle.

### Primary
- **Drafting Redline** (`#c8271a` light / `#ff5340` dark): the pen an engineer marks a check print with. Reserved for revision marks, the active state of navigation and locale, the registration ticks, the overall dimension bracket, the "to be supplied" and "rev pending" notes, and the single filled action plate. **Redline Ink** (`#a8200f` / `#ff7361`) is its text-safe sibling, used wherever the accent carries words rather than a rule.

### Neutral
- **Vellum** (`#eff1f2` light) / **Film** (`#0f1315` dark): the sheet itself; the page ground everywhere.
- **Field Tone** (`#e4e7e9` / `#171c1f`): recessed cells — the title block's label column, the inside of an empty mount, the scrollbar track.
- **Graphite** (`#111518` / `#e8ecee`): headings and any lettering that must read first.
- **Graphite 2** (`#4e585f` / `#a5b0b6`): body copy and leads. 6.5:1 on vellum.
- **Graphite 3** (`#5f6c73` / `#79868d`): labels, dimensions, captions, inactive stations. 4.75:1 on vellum — chosen so an 11px label still clears AA.
- **Hairline** (`#c3cace` / `#2c3438`): the construction rules that divide fields and list rows.
- **Heavy Line** (`#7c888e` / `#5a666c`): the drawing border, the dimension chain, table heads and control edges. 3.3:1 on vellum, so it clears the non-text contrast floor.

### Named Rules

**The One Pen Rule.** Redline is the only saturated colour in the system, and it is never used for emphasis, decoration or category. It appears where a real drafting pen appears: a revision, an unresolved item, the current position, and the one thing the visitor is asked to do. If a second colour is ever needed, the answer is a second *mark*, not a second hue.

**The Cool Ground Rule.** Both grounds are blue-grey neutrals. Warm paper, cream and ivory are prohibited: the world is film and vellum, not stationery, and a warm ground reads as an editorial template rather than a plotted sheet.

## Typography

**Display Font:** Archivo (variable, `wdth` 62–125 and `wght` 100–900), self-hosted via `next/font/google`, with `ui-sans-serif, system-ui, sans-serif` behind it.
**Body Font:** Archivo — the same family, at 400.
**Label/Mono Font:** Martian Mono (variable `wdth`), with `ui-monospace, SFMono-Regular, monospace` behind it.

**Character:** A real drawing is lettered in one single-stroke gothic throughout, so this system is essentially monotypic: Archivo does headings, body and labels, semi-condensed (`wdth` 88–94%) wherever it is set in caps. Martian Mono is the second register only — the typewriter face a drawing uses for figures, codes and stamped status.

### Hierarchy
- **Display** (700, `clamp(2.85rem, 8.2vw, 5.5rem)`, lh 0.92, ls −0.032em, `wdth` 92): the name on sheet 01 and the project name on each case sheet. One per page.
- **Headline** (500, `clamp(1.15rem, 2vw, 1.7rem)`, lh 1.2, ls −0.02em): the pinned role line under the name. Measure capped at 38ch.
- **Title** (600, `clamp(1.65rem, 1.1rem + 2.4vw, 2.6rem)`, lh 1.04, ls −0.022em, `wdth` 94): field headings — one per section.
- **Subtitle** (600, `clamp(1.15rem, 0.95rem + 0.9vw, 1.45rem)`, lh 1.15): sub-headings inside a field, project names in a schedule row.
- **Lead** (400, `clamp(1.0625rem, 0.98rem + 0.42vw, 1.25rem)`, lh 1.55, Graphite 2): the sentence under a field heading. Measure 62–64ch.
- **Body** (400, 1rem, lh 1.6, Graphite 2): notes, context, delivered items. Measure capped at 68ch.
- **Tag** (600, 0.6875rem, ls 0.13em, uppercase, `wdth` 92): drawing lettering for names and actions — navigation, field labels in the margin, project type lines, secondary actions, channel chips, sheet-nav labels, station names.
- **Label** (Martian Mono, 0.6875rem, ls 0.14em, uppercase, tabular): dimensions, codes and status — title-block labels and values, station numbers, sheet and revision numbers, detail captions, schedule column heads and item numbers, domains, stack values, status lines.

### Named Rules

**The Two Registers Rule.** Mono is for what a drawing sets in mono: dimensions, codes, item numbers, domains, revision and status. Everything a person reads or clicks — nav, headings, body, buttons, chips, field labels — is the gothic. Monospace used to make something *look* technical is the failure this rule exists to prevent.

**The Two Extremes Rule.** The sheet is lettered at drawing scale or at 11px, with very little between. Resist inventing a mid-size heading to soften a jump; the jump is the drawing's own rhythm.

## Layout

The page is a sheet, not a column. `.sheet` centres at `max-width: 96rem` with `padding-inline: clamp(0.75rem, 3vw, 2.25rem)`. At ≥80rem the inline-start padding opens to **11rem**: that is the filing margin, the wider margin a plotted sheet keeps down its bound edge, and it is where the station rail and the fixed margin hairline live. Below 80rem the margin closes and the rail is replaced by the header's section strip.

Fields are separated by one full-measure `1px` heavy rule, then a `9rem` margin column and the content column: `lg:grid-cols-[9rem_minmax(0,1fr)]`. The field label sits in that margin beside the heading. Below `lg` the grid collapses and the label is **dropped, never stacked above the heading** — a label above a heading is a kicker, and this system does not ship one.

Vertical rhythm: `py-20 md:py-28` per field, `mt-6` from the field rule to its heading, `mt-12`–`mt-14` from heading block to content, `py-6` per list row, `1.5rem`/`2.25rem`/`3rem` for internal gaps. More space above a heading than below it, everywhere.

Breakpoints are Tailwind's defaults — `sm` 640, `md` 768, `lg` 1024, `xl` 1280 — and the system changes shape at three of them: `md` turns the dimension chain from vertical to horizontal and reveals the drawing border, `lg` opens the two-column fields and the margin labels, `xl` (80rem) opens the filing margin, the station rail and the margin hairline.

The construction grid (`.field-grid`, 2.5rem squares at ~5% ink, radially masked) is laid under the fields where a drawing field belongs: the first viewport, the details field, the issue block and each case sheet's overview and result. It is a ground, not a texture — it never runs under running body copy at full strength.

## Elevation & Depth

**There are no shadows in this system — none, in either theme.** Depth is conveyed the way a drawing conveys it: by line weight and by tone. A `1px` hairline is a construction line; a `1px` heavy line is a cut edge or a border; a `1.5px` redline is a revision. A recessed surface takes the Field Tone rather than an inset shadow, and the title block's label column additionally carries a 45° hairline hatch (`.hatch`) — poché, the tone a drawing puts on a cut face.

### Named Rules

**The No-Shadow Rule.** A drawing is ink on a flat sheet. Any `box-shadow`, bevel, emboss, glow or faux-material effect is out of the world, including on hover. When an element needs to separate from the ground, it takes a rule, a tone or a tick — never a shadow.

## Shapes

Radius is **zero** everywhere. The two exceptions are both drawing devices, not styling: the section callout is a `50%` circle bisected by a rule (letter over sheet number), and the focus ring rounds by `1px` so a dashed rectangle does not read as a hard corner artefact.

Recurring silhouettes:
- **Registration tick** — an L of two 2px redline borders on a 10–14px box, at the corners of the sheet frame and of every mounted detail.
- **Revision triangle** — a CSS-border triangle, 11px wide, marking status and every unresolved item.
- **Dimension chain** — a rule with vertical extension ticks at both ends and solid arrowheads inside, labelled beneath.
- **Overall bracket** — a 1.5px redline rule with two downward end ticks, spanning a whole chain and carrying its total.

## Components

### Buttons
- **Shape:** square (radius 0), `1.5px` border.
- **Primary — the Plate:** the only filled field on the page. Redline ground, `#fbfcfc` text (`#12100f` in dark), `0.95rem 1.4rem`, with a drawn arrow that advances 4px on hover.
- **Hover / Focus:** the plate *empties* — ground goes transparent, text and border become Redline Ink. Focus is the global dashed redline ring at 3px offset.
- **Secondary:** a Tag-set text link with a drawn arrow, no border, colour shifting to Redline Ink on hover.

### Chips
- **Style:** transparent, `1px` Heavy Line border, Tag lettering, `0.6rem 0.85rem`, an outbound arrow glyph inside.
- **State:** hover raises the border to Redline and washes the ground with `color-mix(in oklab, redline 7%, transparent)`.

### Cards / Containers
There are no cards. The container vocabulary is the **mount** (a `1px` Heavy Line frame with two redline registration ticks and a caption rule beneath, holding a screenshot), the **cartouche** (a bordered two-column table of label/value rows with a hatched label column), and the **redline note** (a `1.5px` dashed redline box on a 6% redline wash, used only where a fact is not yet supplied). Internal padding is `0.7rem 0.9rem` for table cells and `1.15rem 1.25rem` for notes.

### Navigation
- **Header:** Tag lettering, Graphite, shifting to Redline Ink on hover. Sticky, on a 94%-opaque sheet with a 6px backdrop blur and a hairline bottom rule. Below `lg` the section links move to a scrollable strip under the wordmark.
- **Station rail (≥80rem):** the page's single vertical axis, fixed in the filing margin. A mono station number, a hairline mark, and a Tag-set name. The active station takes the redline **and** stretches its mark to `scaleX(1.45)` — the state is a mark first, a colour second.
- **Locale switcher:** three real links in a bordered segmented control, not a dropdown. Active carries Redline Ink plus a redline underline that scales in from the left, and `aria-current`.

### Signature component — the Dimension Chain
The system's thesis device. Four spans measured across the full sheet width, each with extension ticks and inward arrowheads and its stage lettered beneath; then one redline overall bracket spanning all four, carrying a single name as its dimension value. It appears twice: measuring the delivery stages on sheet 01, and measuring the delivered scope on every case sheet. Below `md` it rotates to a vertical chain with the bracket running down the left.

### Motion
One authored moment, one curve. Rules draw themselves in left to right (`transform: scaleX(0 → 1)`, 900ms), and labels settle 5px upward behind them (560ms, `--draw-delay` staggered). Every transition in the system uses `cubic-bezier(0.16, 1, 0.3, 1)`; durations are 200–260ms for state, 320–620ms for reveals, 900ms for a drawing rule. Leader lines are stroke-drawn to two-thirds at rest and complete on hover or focus. Under `prefers-reduced-motion: reduce` all of it resolves to the finished state, and a `<noscript>` block does the same, because **no text in this system is ever gated on JavaScript** — only rules animate.

## Do's and Don'ts

### Do:
- **Do** carry state as a mark before a colour — a revision triangle, a stretched rail tick, an underline that scales in. It survives greyscale, colour blindness and a printed sheet.
- **Do** keep the filing margin empty of content at ≥80rem; it belongs to the rail and the margin line.
- **Do** give a new component a rule, a tick or a tone when it needs to separate — the vocabulary is already there.
- **Do** put a fact that is not yet supplied into a redline note that names the gap, in every locale. An honest hole is part of this system.
- **Do** set anything a person reads or clicks in Archivo, and anything measured in Martian Mono.
- **Do** open every field with one full-measure heavy rule and put its label in the margin at `lg` and above.

### Don't:
- **Don't** add a shadow, bevel, glow, gradient or faux material, in any theme or state.
- **Don't** introduce a second accent colour, or use redline for anything that is not revision, state or the primary action.
- **Don't** stack a label above a heading at any breakpoint.
- **Don't** set body copy, headings, navigation or buttons in the mono. Monospace as a costume for "technical" is the one type mistake this system cannot absorb.
- **Don't** use a warm or cream ground; the world is film and vellum.
- **Don't** build a grid of same-size cards. The page's containers are mounts, cartouches, schedules and notes.
- **Don't** gate text on a reveal animation. Content is readable at first paint, with or without JavaScript.
- **Don't** number a section unless the sequence carries information the reader needs — the station rail and drawing notes are numbered because a drawing's index and notes genuinely are.
