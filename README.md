# PrepareUp

Next.js storefront for PDF study packs (government and competitive exams), with [Sanity](https://www.sanity.io/) as the CMS and Razorpay for payments.

See [`UI-UPGRADE-PLAN.md`](./UI-UPGRADE-PLAN.md) for the roadmap for the next visual and UX pass.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and tokens as needed.

## Sanity Studio (CMS)

Editors manage content in **Sanity Studio** (not in the public site footer).

```bash
npm run studio
```

This runs `sanity dev` and opens the Studio. In the **Catalog** group you can:

1. **Categories** — title, slug, description, optional cover image, sort order, SEO.
2. **Exams** — link each exam to a category; set sort order and SEO.
3. **PDF products** — title, slug, exam, **sort order** (listing order), **cover image**, short and rich description, price/access (free vs paid).
4. **PDFs** — upload **Preview PDF** and **Full PDF** files, or use the legacy URL fields until files are uploaded. At least one source is required for preview and for full PDF respectively.

Orders are listed under **Orders**.

## Build

```bash
npm run build
npm start
```

## Stack

- Next.js App Router, Tailwind CSS v4, shadcn-style UI primitives
- `next-sanity` + GROQ for content
- Razorpay for checkout
