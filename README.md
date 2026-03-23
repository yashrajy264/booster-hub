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

For order confirmation emails via Resend, also set:
- `RESEND_API_KEY`
- `EMAIL_FROM` (must be from a verified Resend domain/sender)
- `EMAIL_REPLY_TO` (optional)
- `RESEND_ORDER_TEMPLATE_ID` (template id from Resend dashboard/templates API)

To create/update and publish the branded `order-confirmation` template from code:

```bash
npm run email:template:sync
```

## Sanity Studio (CMS)

Editors manage content in **Sanity Studio** (not in the public site footer).

```bash
npm run studio
```

This runs `sanity dev` and opens the Studio. In the **Catalog** group you can:

1. **Categories** — title, slug, description, optional cover image, sort order, SEO.
2. **Exams** — link each exam to a category; set sort order and SEO.
3. **PDF products** — title, slug, exam, **sort order** (listing order), **cover image**, short and rich description, price/access (free vs paid).
4. **PDF delivery setup**:
   - Set **Delivery mode** to `Single PDF` for the existing one-file flow.
   - Set **Delivery mode** to `Bundle (PDF kit)` to sell multiple PDFs in one product.
   - For all products, upload **Preview PDF** (or preview URL/range) for public preview.
   - For `Single PDF`, upload **Full PDF** (or legacy full URL).
   - For `Bundle`, add one or more **Bundle PDFs** items (title + uploaded file or URL).

Bundle download behavior:
- **Paid bundle:** customer gets secure time-limited links for both `Download kit (.zip)` and individual PDF files.
- **Free bundle:** same ZIP + individual file links work without payment token.

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
- Resend for transactional emails
