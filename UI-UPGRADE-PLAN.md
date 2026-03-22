# PrepareUp — full UI upgrade plan

This document is a roadmap to push the storefront beyond the current mint-themed baseline: clearer hierarchy, stronger trust, and a more “finished” product feel. Scope is **front-end + content presentation**; payment and CMS contracts stay stable unless noted.

## Goals

- **Recognition**: PrepareUp reads as a dedicated study PDF shop, not a generic template.
- **Trust before pay**: Preview, price, and “what you get” are obvious on every product surface.
- **Consistency**: One spacing scale, one type scale, one card language across home, browse, category, exam, product, checkout, and success.
- **Mobile-first**: Thumb-reachable CTAs, readable previews, no nested-interactive bugs.

## Phase 1 — Brand & shell (quick wins)

- **Wordmark**: Optional small logo mark beside text in header (SVG); keep text fallback.
- **Header**: Slightly taller nav on desktop; active route indicator; “About” grouped with core links.
- **Footer**: Multi-column (Shop / Legal / About), optional support email line from env.
- **404 / empty states**: Illustration or icon + single CTA back to browse (reuse mint palette).

## Phase 2 — Home & discovery

- **Home hero**: Stronger value prop (India + exams + PDFs); optional stats strip (e.g. “Instant download”) only if truthful.
- **Browse**: Filter/sort row (price, free/paid, newest); denser grid option; sticky subnav on long pages.
- **Category / exam**: Breadcrumb consistency; “N PDFs” count; featured item slot per exam (CMS or query).

## Phase 3 — Product & PDF experience

- **Product page**: Sticky buy box on desktop; collapsible “What’s inside”; trust row (refund link, format PDF, delivery instant).
- **Preview**: Loading skeleton on iframe; optional page-count line from CMS later.
- **Checkout**: Step copy (“Pay → Download”); align Razorpay branding with site green.

## Phase 4 — Polish & performance

- **Motion**: Subtle `prefers-reduced-motion`-safe transitions on cards and sheet.
- **Images**: All hero/ category covers use consistent aspect ratios and `sizes`.
- **Audit**: Lighthouse pass on `/`, `/browse`, `/p/[slug]`, `/checkout/[slug]`.

## Out of scope (unless product asks)

- Embedded Sanity Studio at `/studio`.
- Reviews/ratings (needs backend).
- Site-wide search (Algolia/Sanity full-text) — add after IA stabilizes.

## Success criteria

- No invalid HTML (e.g. no nested `<button>`).
- CLS stable on product and home after above-the-fold images.
- One coherent design language from header through checkout success.

---

*Exploratory pass: codebase routes and components were surveyed to align this plan with the current App Router layout (`src/app/`) and shared components (`src/components/`).*
