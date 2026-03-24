import { defineQuery } from "next-sanity";

const coverImageFields = `
  coverImage {
    crop,
    hotspot,
    asset
  }
`;

const bundleItemFields = `
  "bundleItems": coalesce(bundleItems, [])[]{
    _key,
    title,
    sortOrder,
    "fullPdfUrl": coalesce(fullPdfFile.asset->url, fullPdfUrl)
  }
`;

const logoImageFields = `
  logoImage {
    crop,
    hotspot,
    asset
  }
`;

/** Missing listingStatus = published (legacy documents). */
const categoryListed = `coalesce(listingStatus, "published") == "published"`;
const examListed = `coalesce(listingStatus, "published") == "published"`;
const productListed = `coalesce(listingStatus, "published") == "published"`;
const examChainListed = `${examListed} && coalesce(category->listingStatus, "published") == "published"`;
const productChainListed = `${productListed} && coalesce(exam->listingStatus, "published") == "published" && coalesce(exam->category->listingStatus, "published") == "published"`;

export const categoriesQuery = defineQuery(`
  *[_type == "category" && ${categoryListed}] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    ${coverImageFields}
  }
`);

export const categoryBySlugQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug && ${categoryListed}][0] {
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
  *[_type == "exam" && category->slug.current == $categorySlug && ${examChainListed}] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    ${logoImageFields},
    ${coverImageFields},
    "productCount": count(*[_type == "product" && exam._ref == ^._id && ${productListed}]),
    "categorySlug": category->slug.current,
    "categoryTitle": category->title
  }
`);

export const examBySlugsQuery = defineQuery(`
  *[_type == "exam" && slug.current == $examSlug && category->slug.current == $categorySlug && ${examChainListed}][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    ${logoImageFields},
    ${coverImageFields},
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    seoTitle,
    seoDescription
  }
`);

/** All exams with category slugs — for catalog filter UI */
export const examsCatalogFilterQuery = defineQuery(`
  *[_type == "exam" && ${examChainListed}] | order(category->sortOrder asc, sortOrder asc, title asc) {
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
    "deliveryMode": coalesce(deliveryMode, "single"),
    "bundleItemCount": count(coalesce(bundleItems, [])),
    "previewPdfUrl": coalesce(previewPdfFile.asset->url, previewPdfUrl),
    featured,
    ${coverImageFields},
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current,
    "examTitle": exam->title,
    "categoryTitle": exam->category->title
`;

/** Same as product cards plus human-readable hierarchy for catalog grid */
const productCatalogFields = `
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    pricePaise,
    accessMode,
    "deliveryMode": coalesce(deliveryMode, "single"),
    "bundleItemCount": count(coalesce(bundleItems, [])),
    ${coverImageFields},
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current,
    "examTitle": exam->title,
    "categoryTitle": exam->category->title
`;

export const productsCatalogCountQuery = defineQuery(`
  count(*[_type == "product"
    && ${productChainListed}
    && (!defined($categorySlug) || $categorySlug == "" || exam->category->slug.current == $categorySlug)
    && (!defined($examSlug) || $examSlug == "" || exam->slug.current == $examSlug)
  ])
`);

export const productsCatalogPagedQuery = defineQuery(`
  *[_type == "product"
    && ${productChainListed}
    && (!defined($categorySlug) || $categorySlug == "" || exam->category->slug.current == $categorySlug)
    && (!defined($examSlug) || $examSlug == "" || exam->slug.current == $examSlug)
  ] | order(sortOrder asc, _createdAt desc) [$start...$end] {
    ${productCatalogFields}
  }
`);

/** match() — pass $pattern e.g. "*sbi po*" from the API */
export const productsSearchQuery = defineQuery(`
  *[_type == "product" && ${productChainListed} && (
    title match $pattern ||
    shortDescription match $pattern ||
    (defined(body) && pt::text(body) match $pattern) ||
    exam->title match $pattern ||
    exam->category->title match $pattern
  )] | order(sortOrder asc, _createdAt desc) [0...24] {
    ${productCatalogFields}
  }
`);

export const categoriesSearchQuery = defineQuery(`
  *[_type == "category" && ${categoryListed} && defined(slug.current) && (
    title match $pattern ||
    (defined(description) && description match $pattern)
  )] | order(sortOrder asc, title asc) [0...12] {
    _id,
    title,
    "slug": slug.current,
    ${coverImageFields}
  }
`);

export const examsSearchQuery = defineQuery(`
  *[_type == "exam" && ${examChainListed} && defined(slug.current) && defined(category->slug.current) && (
    title match $pattern ||
    (defined(description) && description match $pattern) ||
    category->title match $pattern
  )] | order(category->sortOrder asc, sortOrder asc, title asc) [0...12] {
    _id,
    title,
    "slug": slug.current,
    ${logoImageFields},
    ${coverImageFields},
    "categorySlug": category->slug.current,
    "categoryTitle": category->title
  }
`);

export const productsByExamQuery = defineQuery(`
  *[_type == "product" && exam._ref == $examId && ${productChainListed}] | order(sortOrder asc, _createdAt desc) {
    ${productCardFields}
  }
`);

export const productCountByExamQuery = defineQuery(`
  count(*[_type == "product" && exam._ref == $examId && ${productChainListed}])
`);

export const productsByExamPagedQuery = defineQuery(`
  *[_type == "product" && exam._ref == $examId && ${productChainListed}] | order(sortOrder asc, _createdAt desc) [$start...$end] {
    ${productCardFields}
  }
`);

export const featuredProductsQuery = defineQuery(`
  *[_type == "product" && featured == true && ${productChainListed}] | order(sortOrder asc, _createdAt desc)[0...8] {
    ${productCardFields}
  }
`);

/** Public product fields only — resolved PDF URLs, no raw file refs */
export const productBySlugPublicQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug && ${productChainListed}][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    body,
    pricePaise,
    accessMode,
    "deliveryMode": coalesce(deliveryMode, "single"),
    "bundleItemCount": count(coalesce(bundleItems, [])),
    "previewPdfUrl": coalesce(previewPdfFile.asset->url, previewPdfUrl),
    previewStartPage,
    previewEndPage,
    seoTitle,
    seoDescription,
    ${coverImageFields},
    "examTitle": exam->title,
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current,
    "categoryTitle": exam->category->title
  }
`);

export const productByHierarchySlugsQuery = defineQuery(`
  *[_type == "product"
    && slug.current == $productSlug
    && exam->slug.current == $examSlug
    && exam->category->slug.current == $categorySlug
    && ${productChainListed}
  ][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    body,
    pricePaise,
    accessMode,
    "deliveryMode": coalesce(deliveryMode, "single"),
    "bundleItemCount": count(coalesce(bundleItems, [])),
    "previewPdfUrl": coalesce(previewPdfFile.asset->url, previewPdfUrl),
    previewStartPage,
    previewEndPage,
    seoTitle,
    seoDescription,
    ${coverImageFields},
    "examTitle": exam->title,
    "examSlug": exam->slug.current,
    "categorySlug": exam->category->slug.current,
    "categoryTitle": exam->category->title
  }
`);

/** Server preview resolver: includes both manual preview and full PDF sources */
export const productBySlugPreviewQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug && ${productChainListed}][0] {
    _id,
    title,
    "slug": slug.current,
    "deliveryMode": coalesce(deliveryMode, "single"),
    "manualPreviewPdfUrl": coalesce(previewPdfFile.asset->url, previewPdfUrl),
    "fullPdfUrl": coalesce(fullPdfFile.asset->url, fullPdfUrl),
    ${bundleItemFields},
    previewStartPage,
    previewEndPage
  }
`);

/** Server-only: includes full PDF URL for fulfillment */
export const productByIdFullQuery = defineQuery(`
  *[_type == "product" && _id == $id][0] {
    _id,
    title,
    "slug": slug.current,
    accessMode,
    "deliveryMode": coalesce(deliveryMode, "single"),
    "fullPdfUrl": coalesce(fullPdfFile.asset->url, fullPdfUrl),
    ${bundleItemFields},
    pricePaise
  }
`);

export const productBySlugFullQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    accessMode,
    "deliveryMode": coalesce(deliveryMode, "single"),
    "fullPdfUrl": coalesce(fullPdfFile.asset->url, fullPdfUrl),
    ${bundleItemFields},
    pricePaise
  }
`);

export const orderByPaymentIdQuery = defineQuery(`
  *[_type == "order" && razorpayPaymentId == $paymentId][0] {
    _id,
    status,
    email,
    razorpayPaymentId,
    confirmationEmailSentAt,
    confirmationEmailId
  }
`);
