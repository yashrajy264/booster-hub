import { defineField, defineType } from "sanity";

function hasAsset(file: unknown): boolean {
  return Boolean(
    file &&
      typeof file === "object" &&
      "asset" in file &&
      (file as { asset?: { _ref?: string } }).asset?._ref,
  );
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
      to: [{ type: "exam" }],
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
          };
          if (value || hasAsset(parent?.previewPdfFile)) return true;
          return "Upload a preview PDF or enter a preview URL";
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
          };
          if (value || hasAsset(parent?.fullPdfFile)) return true;
          return "Upload the full PDF or enter a full PDF URL";
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
