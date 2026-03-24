import { defineField, defineType } from "sanity";

export const exam = defineType({
  name: "exam",
  title: "Exam",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Exam or subcategory under the category (e.g. SBI PO).",
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
      name: "category",
      title: "Category",
      type: "reference",
      weak: true,
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "listingStatus",
      title: "Listing status",
      description:
        "Published: visible on the public site. Unpublished: hidden from catalog; existing orders are unaffected.",
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
      name: "logoImage",
      title: "Exam logo",
      description: "Square or compact logo shown on exam cards in the category hub. Falls back to cover image if empty.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description: "Optional larger image for catalog and category cards (subcategory / exam level).",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      initialValue: 0,
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
    select: { title: "title", logo: "logoImage", cover: "coverImage" },
    prepare({ title, logo, cover }) {
      return {
        title: title ?? "Untitled exam",
        media: logo ?? cover,
      };
    },
  },
});
