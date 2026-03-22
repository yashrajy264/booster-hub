import { defineQuery } from "next-sanity";

const coverImageFields = `
  coverImage {
    crop,
    hotspot,
    asset
  }
`;

export const categoriesQuery = defineQuery(`
  *[_type == "category"] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    ${coverImageFields}
  }
`);

export const categoryBySlugQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    seoTitle,
    seoDescription,
    ${coverImageFields}
  }
`);

export const examsByCategorySlugQuery = defineQuery(`
  *[_type == "exam" && category->slug.current == $categorySlug] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    ${coverImageFields},
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
    ${coverImageFields},
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    seoTitle,
    seoDescription
  }
`);

/** All exams with category slugs — for catalog filter UI */
export const examsCatalogFilterQuery = defineQuery(`
  *[_type == "exam"] | order(category->sortOrder asc, sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": category->slug.current,
    "categoryTitle": category->title
  }
`);

const productCardFields = `
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    pricePaise,
    accessMode,
    "previewPdfUrl": coalesce(previewPdfFile.asset->url, previewPdfUrl),
    featured,
    ${coverImageFields},
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current
`;

/** Same as product cards plus human-readable hierarchy for catalog grid */
const productCatalogFields = `
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    pricePaise,
    accessMode,
    ${coverImageFields},
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current,
    "examTitle": exam->title,
    "categoryTitle": exam->category->title
`;

export const productsCatalogCountQuery = defineQuery(`
  count(*[_type == "product"
    && (!defined($categorySlug) || $categorySlug == "" || exam->category->slug.current == $categorySlug)
    && (!defined($examSlug) || $examSlug == "" || exam->slug.current == $examSlug)
  ])
`);

export const productsCatalogPagedQuery = defineQuery(`
  *[_type == "product"
    && (!defined($categorySlug) || $categorySlug == "" || exam->category->slug.current == $categorySlug)
    && (!defined($examSlug) || $examSlug == "" || exam->slug.current == $examSlug)
  ] | order(sortOrder asc, _createdAt desc) [$start...$end] {
    ${productCatalogFields}
  }
`);

/** match() — pass $pattern e.g. "*sbi po*" from the API */
export const productsSearchQuery = defineQuery(`
  *[_type == "product" && (
    title match $pattern ||
    shortDescription match $pattern ||
    (defined(body) && pt::text(body) match $pattern) ||
    exam->title match $pattern ||
    exam->category->title match $pattern
  )] | order(sortOrder asc, _createdAt desc) [0...24] {
    ${productCatalogFields}
  }
`);

export const productsByExamQuery = defineQuery(`
  *[_type == "product" && exam._ref == $examId] | order(sortOrder asc, _createdAt desc) {
    ${productCardFields}
  }
`);

export const productCountByExamQuery = defineQuery(`
  count(*[_type == "product" && exam._ref == $examId])
`);

export const productsByExamPagedQuery = defineQuery(`
  *[_type == "product" && exam._ref == $examId] | order(sortOrder asc, _createdAt desc) [$start...$end] {
    ${productCardFields}
  }
`);

export const featuredProductsQuery = defineQuery(`
  *[_type == "product" && featured == true] | order(sortOrder asc, _createdAt desc)[0...8] {
    ${productCardFields}
  }
`);

/** Public product fields only — resolved PDF URLs, no raw file refs */
export const productBySlugPublicQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    body,
    pricePaise,
    accessMode,
    "previewPdfUrl": coalesce(previewPdfFile.asset->url, previewPdfUrl),
    seoTitle,
    seoDescription,
    ${coverImageFields},
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
    "fullPdfUrl": coalesce(fullPdfFile.asset->url, fullPdfUrl),
    pricePaise
  }
`);

export const productBySlugFullQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    accessMode,
    "fullPdfUrl": coalesce(fullPdfFile.asset->url, fullPdfUrl),
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
