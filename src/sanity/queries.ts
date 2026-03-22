import { defineQuery } from "next-sanity";

export const categoriesQuery = defineQuery(`
  *[_type == "category"] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

export const examsByCategorySlugQuery = defineQuery(`
  *[_type == "exam" && category->slug.current == $categorySlug] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "categorySlug": category->slug.current,
    "categoryTitle": category->title
  }
`);

export const examBySlugsQuery = defineQuery(`
  *[_type == "exam" && slug.current == $examSlug && category->slug.current == $categorySlug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    seoTitle,
    seoDescription
  }
`);

export const productsByExamQuery = defineQuery(`
  *[_type == "product" && exam._ref == $examId] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    pricePaise,
    accessMode,
    previewPdfUrl,
    featured,
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current
  }
`);

export const featuredProductsQuery = defineQuery(`
  *[_type == "product" && featured == true] | order(_createdAt desc)[0...8] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    pricePaise,
    accessMode,
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current
  }
`);

/** Public product fields only — no fullPdfUrl */
export const productBySlugPublicQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    body,
    pricePaise,
    accessMode,
    previewPdfUrl,
    seoTitle,
    seoDescription,
    "examTitle": exam->title,
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current,
    "categoryTitle": exam->category->title
  }
`);

/** Server-only: includes full PDF URL for fulfillment */
export const productByIdFullQuery = defineQuery(`
  *[_type == "product" && _id == $id][0] {
    _id,
    title,
    "slug": slug.current,
    accessMode,
    fullPdfUrl,
    pricePaise
  }
`);

export const productBySlugFullQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    accessMode,
    fullPdfUrl,
    pricePaise
  }
`);

export const orderByPaymentIdQuery = defineQuery(`
  *[_type == "order" && razorpayPaymentId == $paymentId][0] {
    _id,
    status,
    email,
    razorpayPaymentId
  }
`);
