import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CatalogPagination } from "@/components/catalog-pagination";
import { ProductCard, type ProductCardItem } from "@/components/product-card";
import { CATALOG_PAGE_SIZE } from "@/lib/catalog-constants";
import { getPublicSanityClient } from "@/sanity/client";
import {
  examBySlugsQuery,
  productCountByExamQuery,
  productsByExamPagedQuery,
} from "@/sanity/queries";

export const revalidate = 60;

type Props = {
  params: Promise<{ categorySlug: string; examSlug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { categorySlug, examSlug } = await params;
  const client = getPublicSanityClient();
  if (!client) return { title: "Exam" };
  const exam = await client.fetch(examBySlugsQuery, { categorySlug, examSlug });
  if (!exam) return { title: "Not found" };
  return {
    title: exam.seoTitle || exam.title,
    description: exam.seoDescription || exam.description,
  };
}

export default async function ExamPage({ params, searchParams }: Props) {
  const { categorySlug, examSlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const client = getPublicSanityClient();
  if (!client) notFound();

  const exam = await client.fetch(examBySlugsQuery, { categorySlug, examSlug });
  if (!exam) notFound();

  const total = (await client.fetch(productCountByExamQuery, {
    examId: exam._id,
  })) as number;
  const totalPages = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  if (page > totalPages && total > 0) notFound();

  const start = (page - 1) * CATALOG_PAGE_SIZE;
  const end = start + CATALOG_PAGE_SIZE;

  const products = (await client.fetch(productsByExamPagedQuery, {
    examId: exam._id,
    start,
    end,
  })) as ProductCardItem[];

  const listPath = `/${categorySlug}/${examSlug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: exam.categoryTitle, href: `/${categorySlug}` },
          { label: exam.title },
        ]}
      />
      <h1 className="mt-4 font-heading text-3xl tracking-tight sm:text-4xl">{exam.title}</h1>
      {exam.description ? (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {exam.description}
        </p>
      ) : null}

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-5 sm:col-span-2">
            <p className="text-sm text-muted-foreground">No PDFs listed for this exam yet.</p>
            <Link href="/browse" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
              Browse all packs
            </Link>
          </div>
        ) : (
          products.map((p) => <ProductCard key={p._id} product={p} />)
        )}
      </div>

      <CatalogPagination pathname={listPath} page={page} totalPages={totalPages} />
    </div>
  );
}
