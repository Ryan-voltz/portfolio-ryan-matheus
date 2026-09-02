# Ryan Matheus — portfolio

Trilingual portfolio (English / Portuguese / Spanish) for **Ryan Matheus**, full-stack
developer of custom CRM, ERP, e-commerce and compliance systems.

The site is built as a **general-arrangement drawing sheet**: hairline rules, a dimension
chain that measures the four stages of delivery under one name, section callouts, mounted
details, a schedule of works, and a title block. Home is *sheet 01*; each featured case has
its own sheet.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no config file) |
| i18n | next-intl 4 — English at `/`, Portuguese at `/pt`, Spanish at `/es` |
| Fonts | Archivo + Martian Mono, self-hosted via `next/font/google` |
| Theme | Automatic light/dark from `prefers-color-scheme` (no toggle, by design) |
| Deploy | Vercel |

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

---

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel. No build settings need changing —
   Vercel detects Next.js.
2. Add the environment variable, in **Production** and **Preview**:

   ```
   NEXT_PUBLIC_SITE_URL=https://ryanmatheus.com.br
   ```

   It drives `metadataBase`, canonical URLs, the `hreflang` alternates, `sitemap.xml`,
   `robots.txt` and the Open Graph card. Without it the site falls back to the same
   value hard-coded in `src/content/site.ts`.
3. In **Settings → Domains**, add `ryanmatheus.com.br` and `www.ryanmatheus.com.br`, then
   point the registrar's DNS at the records Vercel shows.

Everything except the locale middleware is statically generated (`next build` prerenders
all nine pages plus three Open Graph images), so the site serves from the edge cache.

---

## Where the content lives

All prose is in `messages/en.json`, `messages/pt.json`, `messages/es.json`. The three files
have identical shapes — if you add a key, add it to all three.

Structured data (URLs, stacks, screenshots, sheet numbers) is in
`src/content/projects.ts`. Brand constants (name, headline, email, links, revision) are in
`src/content/site.ts`.

### ⚠ Placeholders waiting on you

Two visible redline notes ship on purpose, because no result was supplied and none was
invented:

| Where | Key to edit |
|---|---|
| `/work/voltz-hub` → Result | `work.voltz-hub.result` in all three message files |
| `/work/blumenns` → Result | `work.blumenns.result` in all three message files |

Write the real outcome into those keys and the redline note is replaced automatically —
`src/content/projects.ts` decides which of the two renders by the project's `result` field,
so also change `result: 'pending'` to `result: 'qualitative'` for that project.

`/work/volare` already states its result honestly: the platform is newly launched, has no
figures yet, and says so.

### ⚠ Portrait

The About section shows a "to be supplied" mount. To fill it:

1. Drop a **4:5** image at `public/portrait.jpg`.
2. In `src/app/[locale]/page.tsx`, replace the placeholder `<div className="mount …">`
   block with a `next/image` inside the same `.mount` wrapper.

---

## Adding another project to the schedule

1. Add the site to the `SITES` array in `scripts/capture-sites.mjs`, then run
   `node scripts/capture-sites.mjs <slug>` to capture a real screenshot into
   `public/shots/<slug>.webp`. (Needs Chrome or Edge installed.)
2. Push an entry onto `otherProjects` in `src/content/projects.ts`.
3. Add `projects.<slug>.name` and `projects.<slug>.type` to all three message files.

That is all — the schedule table, the sitemap and the row count in the section lead read
straight from the array.

Promoting a project to a **featured case** (its own sheet) additionally needs an entry in
`featuredProjects` with a `callout` letter and `sheet` number, plus a `work.<slug>` block
in each message file (`name`, `type`, `summary`, `shotAlt`, `context`, `challenge`,
`delivered.d1–d4`, `result`). Bump `sheetCount` in `src/content/site.ts`.

---

## Content rules baked into this repo

These are not stylistic preferences — they are the reason several sections read the way
they do. Keep them when editing:

1. **No invented metrics.** No number appears anywhere that was not supplied. Where a
   result is unknown, a visible redline placeholder ships instead.
2. **No AI tool is ever named.** The delivery process is described in general terms —
   requirements and architecture, AI-accelerated development, hands-on refinement — and
   never by product name.
3. **Sole authorship.** The three featured cases were built by Ryan alone; no "we" or
   "team" language is used about them anywhere, in any language.
4. **One truth across three languages.** A fact stated in one locale is stated in all
   three, and a placeholder in one is a placeholder in all three.

---

## Images

`public/shots/*.webp` are real headless-Chromium screenshots of the live production sites,
captured at 1440×900 @2x and downscaled to 1600px wide. Nothing is AI-generated, stock or
composited. Origin for each file is recorded in `public/shots/PROVENANCE.txt` and in the
per-file `.webp.json` sidecars. Re-run `node scripts/capture-sites.mjs` to refresh them
when a client site is redesigned.

---

## Design system

`DESIGN.md` records the built visual world — tokens, lettering, the drawing primitives and
the rules that govern them. `src/app/globals.css` is the single source of the tokens; the
custom classes live in `@layer components` so Tailwind utilities can override them at a
call site.
