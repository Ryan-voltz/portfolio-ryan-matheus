# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Confirmed by the user in the original brief: Next.js (App Router) + TypeScript + Tailwind CSS, internationalized with next-intl (or an equivalent native Next.js solution). Deploy target is Vercel with a custom domain: **ryanmatheus.com.br** (confirmed in interview). Automatic dark/light mode driven by `prefers-color-scheme`.

Routing: English is the default locale; Portuguese (PT-BR) and Spanish are additional. The language selector lives in the header and must keep the visitor on the same page when switching.

## Users

Primary: prospective clients evaluating whether to hire Ryan Matheus to build a custom business system — CRM, ERP, e-commerce, or a compliance/financial platform. They arrive from a referral, a cold outreach reply, or a search, on desktop or phone, and are deciding within a few minutes whether this person can be trusted with a system their company will run on.

The site is trilingual because the audience spans three markets: international/English-speaking buyers, Brazilian buyers (the existing client base and every live reference project), and Spanish-speaking buyers.

Secondary: recruiters or agency partners scanning for stack fit and delivery ownership.

## Product Purpose

A personal portfolio that converts evaluation into a first conversation by email. Success is a qualified inbound message at ryan.voltzagency@gmail.com. The site must read as a working professional's evidence file, not as a developer's résumé page: real shipped systems, real URLs, an honest account of how the work gets delivered.

## Positioning

Ryan builds *business systems*, not marketing sites — CRM, ERP, e-commerce with admin panels, and compliance/financial platforms — and he owns the entire delivery himself: requirements and system architecture, AI-accelerated development across front-end and back-end, and hands-on refinement (security, edge cases, finalization) before every handoff. He built his own automated auditing tool to test delivered systems end-to-end. All three featured cases were developed by him personally, alone, 100%.

The differentiator a neighboring freelancer could not truthfully copy: sole authorship of production systems that companies actually run on, across three industries, plus a self-built end-to-end auditing tool for the handoff.

## Operating Context

Ryan started as an IT assistant at a logistics/customs-brokerage company, where he learned SQL, PHP, Firebird, and Laravel working on internal systems. He later founded Voltz Agency, where he personally develops the company's flagship systems end-to-end, and now also takes select freelance projects directly. He holds a certification in prompt engineering. 3+ years of experience.

## Capabilities and Constraints

Site structure is fixed by the brief:

- Single-page home: hero, about, the three featured cases (each linking to its own page), grid of other projects, contact, footer.
- One dedicated page per featured case at `/[locale]/work/[slug]`, each with: project hero, context/challenge, stack, and what was delivered.
- The "other projects" grid must be trivially extensible — more projects will be added later.

**Hard content rules, binding in all three languages:**

1. Never invent metrics, numbers, or results that are not written in the brief. Where the user marked `[FILL IN]`, render a visible placeholder for him to complete — never a fabricated figure.
2. Never name a specific AI tool used in development (not Lovable, not Claude Code, not any other). Describe only process and architecture in general terms.
3. All three featured cases were built by Ryan personally and alone — never use team language for them.
4. Translations must preserve the same facts and the same content rules; nothing may be invented in one language that does not exist in another.

## Brand Commitments

- Name: **Ryan Matheus**
- Headline: **"Full-Stack Developer — Custom CRM/ERP, E-commerce & Business Systems"**
- Contact email: **ryan.voltzagency@gmail.com**
- LinkedIn: https://www.linkedin.com/in/ryan-matheus-7955b2231/
- GitHub: https://github.com/Ryan-voltz
- WhatsApp: +55 71 99250-6752 (wa.me/5571992506752)
- Experience: 3+ years
- Affiliation: founder of Voltz Agency

Voice: sober, factual, first-person-adjacent. Credibility over enthusiasm. No superlatives that the evidence does not carry.

## Evidence on Hand

**Featured cases (own page each, all built by Ryan alone, 100%):**

1. **Volare Company** — https://volarecompany.com.br/ — public-procurement compliance platform. Stack: React, Vite, Supabase. Automated search of the PNCP (Brazilian government procurement portal), tender monitoring, and compliance with Law 14.133/2021. **Newly launched, still in early use — no results metric exists. Describe qualitatively only; inventing a number is prohibited.**
2. **Voltz Hub** — https://voltzhub.com.br/ — task and project management SaaS, Voltz Agency's own internal product. Stack: React, Vite, Supabase, Framer Motion. Built by Ryan alone as founder. **Result: `[FILL IN]` — visible placeholder required.**
3. **Blumenns** — https://blumenns.com/ — semi-jewelry e-commerce (925 silver, 18k gold plating) with an authenticated admin panel for product management. Stack: React, Vite. **Result: `[FILL IN]` — visible placeholder required.**

**Other projects grid (simple cards, no dedicated page):**

- Seu Puto Store — https://seuputostore.com.br/ — fashion/streetwear e-commerce
- Overall Clã — https://overalclasuplementos.com.br/ — supplements e-commerce with its own admin/CRM area
- Fipec — https://fipec.com.br/ — auto-parts e-commerce with WhatsApp quoting
- G7 Comércio — https://g7comercio.com.br/ — pedagogical projects and teacher-training platform (BNCC)
- Grupo Educare — https://editoraeducare.com.br/ — textbook distributor for school networks across Brazil

**Deliberately absent — must not be fabricated:** client testimonials, revenue or traffic figures, user counts, uptime numbers, project timelines, pricing, awards, employer logos beyond those named above, and any result for the three featured cases other than what is written here.

**Imagery:** the user chose to have real screenshots captured from the live sites (confirmed in interview). No headshot has been provided.

## Product Principles

1. **Evidence over adjectives.** Every claim on the page traces to a shipped system with a public URL. Where evidence is missing, the gap is shown honestly, not filled.
2. **Sole authorship is the story.** The through-line is one person owning architecture, build, hardening, and handoff — not a stack list.
3. **Three languages, one truth.** Locale changes the wording, never the facts, the rules, or the placeholders.
4. **Credibility is a visual argument.** The design has to look like it belongs to someone who builds systems companies depend on — sober, precise, and legible before it is expressive.
5. **Built to be extended.** Projects, locales, and cases are data, so adding the next one is an edit to content, not to layout.

## Accessibility & Inclusion

No specific standard was mandated by the user. Baseline requirement derived from the audience: the site must be fully legible and operable on phone and desktop, in light and dark, with keyboard access to the language switcher and all navigation, and text contrast that survives an outdoor screen — an evaluator reading it on a phone between meetings is the real usage scene.
