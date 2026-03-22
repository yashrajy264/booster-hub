import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "PDF product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
      name: "previewPdfUrl",
      title: "Preview / sample PDF URL",
      description: "Public URL for students to preview (sample pages).",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullPdfUrl",
      title: "Full PDF URL (server-only)",
      description:
        "Not exposed on the public site. Served only after payment (paid) or immediately (free).",
      type: "url",
      validation: (Rule) => Rule.required(),
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
    select: { title: "title", access: "accessMode" },
    prepare({ title, access }) {
      return { title: title ?? "Untitled", subtitle: access };
    },
  },
});
