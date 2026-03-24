import { defineField, defineType } from "sanity";

function hasAsset(file: unknown): boolean {
  return Boolean(
    file &&
      typeof file === "object" &&
      "asset" in file &&
      (file as { asset?: { _ref?: string } }).asset?._ref,
  );
}

function hasPreviewRange(value: { previewStartPage?: unknown; previewEndPage?: unknown } | undefined): boolean {
  return Number.isInteger(value?.previewStartPage) && Number.isInteger(value?.previewEndPage);
}

function hasBundleItemSources(
  items: Array<{ fullPdfFile?: unknown; fullPdfUrl?: string } | undefined> | undefined,
): boolean {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.some((item) => Boolean(item && (hasAsset(item.fullPdfFile) || item.fullPdfUrl)));
}

export const product = defineType({
  name: "product",
  title: "PDF product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "PDF pack name (e.g. SBI PO Quant). Linked to one exam.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "exam",
      title: "Exam",
      type: "reference",
      weak: true,
      to: [{ type: "exam" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "listingStatus",
      title: "Listing status",
      description:
        "Published: visible on the public site. Unpublished: hidden from browse/search/checkout; paid orders and history stay intact.",
      type: "string",
      options: {
        list: [
          { title: "Published", value: "published" },
          { title: "Unpublished", value: "unpublished" },
        ],
        layout: "radio",
      },
      initialValue: "published",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      description: "Lower numbers appear first in the exam catalog.",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description: "Shown on cards and the product page.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "pricePaise",
      title: "Price (paise)",
      description: "₹10 = 1000 paise. Ignored when access is free.",
      type: "number",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "accessMode",
      title: "Access",
      type: "string",
      options: {
        list: [
          { title: "Free — full PDF downloadable without payment", value: "free" },
          { title: "Paid — purchase required for full PDF", value: "paid" },
        ],
        layout: "radio",
      },
      initialValue: "paid",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deliveryMode",
      title: "Delivery mode",
      description: "Choose whether this product delivers one PDF or a multi-PDF bundle.",
      type: "string",
      options: {
        list: [
          { title: "Single PDF", value: "single" },
          { title: "Bundle (PDF kit)", value: "bundle" },
        ],
        layout: "radio",
      },
      initialValue: "single",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "previewPdfFile",
      title: "Preview PDF (upload)",
      description: "Sample pages for the public preview. Preferred over URL.",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "previewPdfUrl",
      title: "Preview / sample PDF URL (legacy)",
      description: "Optional if you uploaded a preview PDF above.",
      type: "url",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {
            previewPdfFile?: unknown;
            previewStartPage?: unknown;
            previewEndPage?: unknown;
          };
          if (value || hasAsset(parent?.previewPdfFile) || hasPreviewRange(parent)) return true;
          return "Upload a preview PDF, enter a preview URL, or set a preview page range";
        }),
    }),
    defineField({
      name: "previewStartPage",
      title: "Preview start page",
      description: "Used when no manual preview PDF/URL is provided. Must be >= 1.",
      type: "number",
      validation: (Rule) =>
        Rule.integer()
          .min(1)
          .custom((value, context) => {
            const parent = context.parent as {
              previewPdfFile?: unknown;
              previewPdfUrl?: string;
              previewEndPage?: unknown;
            };
            const hasManual = Boolean(parent?.previewPdfUrl) || hasAsset(parent?.previewPdfFile);
            const end = parent?.previewEndPage;
            if (value == null && end != null) return "Set start page when end page is set";
            if (!hasManual && value == null && end == null) {
              return "Set preview start/end pages when manual preview is not provided";
            }
            return true;
          }),
    }),
    defineField({
      name: "previewEndPage",
      title: "Preview end page",
      description: "Used when no manual preview PDF/URL is provided. Must be >= start page.",
      type: "number",
      validation: (Rule) =>
        Rule.integer()
          .min(1)
          .custom((value, context) => {
            const parent = context.parent as {
              previewPdfFile?: unknown;
              previewPdfUrl?: string;
              previewStartPage?: unknown;
            };
            const hasManual = Boolean(parent?.previewPdfUrl) || hasAsset(parent?.previewPdfFile);
            const start = parent?.previewStartPage;
            if (value == null && start != null) return "Set end page when start page is set";
            if (value != null && Number.isInteger(start) && value < Number(start)) {
              return "End page must be greater than or equal to start page";
            }
            if (!hasManual && value == null && start == null) {
              return "Set preview start/end pages when manual preview is not provided";
            }
            return true;
          }),
    }),
    defineField({
      name: "fullPdfFile",
      title: "Full PDF (upload)",
      description: "Complete file. Not shown on the public site; used for download after purchase or when free.",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "fullPdfUrl",
      title: "Full PDF URL (legacy)",
      description: "Optional if you uploaded the full PDF above.",
      type: "url",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {
            fullPdfFile?: unknown;
            deliveryMode?: string;
          };
          if (parent?.deliveryMode === "bundle") return true;
          if (value || hasAsset(parent?.fullPdfFile)) return true;
          return "Upload the full PDF or enter a full PDF URL";
        }),
    }),
    defineField({
      name: "bundleItems",
      title: "Bundle PDFs",
      description: "Add each PDF included in this kit. Used when delivery mode is Bundle.",
      type: "array",
      hidden: ({ parent }) => (parent as { deliveryMode?: string } | undefined)?.deliveryMode !== "bundle",
      of: [
        defineField({
          name: "item",
          title: "Bundle item",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "PDF title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "sortOrder",
              title: "Sort order",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "fullPdfFile",
              title: "Full PDF (upload)",
              type: "file",
              options: { accept: "application/pdf" },
            }),
            defineField({
              name: "fullPdfUrl",
              title: "Full PDF URL (legacy)",
              type: "url",
              description: "Optional if you uploaded the full PDF above.",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const item = context.parent as { fullPdfFile?: unknown } | undefined;
                  if (value || hasAsset(item?.fullPdfFile)) return true;
                  return "Upload the full PDF or enter a full PDF URL";
                }),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "fullPdfUrl" },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Untitled PDF",
                subtitle: subtitle ?? "Uploaded file",
              };
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {
            deliveryMode?: string;
            bundleItems?: Array<{ fullPdfFile?: unknown; fullPdfUrl?: string } | undefined>;
          };
          if (parent?.deliveryMode !== "bundle") return true;
          if (hasBundleItemSources(parent?.bundleItems) || hasBundleItemSources(value as never)) return true;
          return "Add at least one bundle PDF with uploaded file or URL";
        }),
    }),
    defineField({
      name: "featured",
      title: "Featured on home",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title", access: "accessMode", media: "coverImage" },
    prepare({ title, access, media }) {
      return {
        title: title ?? "Untitled",
        subtitle: access,
        media,
      };
    },
  },
});
