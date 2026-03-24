import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Top-level group (e.g. Banking, SSC).",
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
      name: "listingStatus",
      title: "Listing status",
      description:
        "Published: visible on the public site. Unpublished: hidden from browse/search; orders are unchanged. You can still delete documents if nothing blocks the reference (orders use a weak link to products).",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description: "Optional hero image for the category hub and browse cards.",
      type: "image",
      options: { hotspot: true },
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
});
