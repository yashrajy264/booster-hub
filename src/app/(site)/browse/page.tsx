import Link from "next/link";

import { CatalogProductCard, type CatalogProductItem } from "@/components/catalog-product-card";
import { GlobalSearch } from "@/components/global-search";
import { CATALOG_PAGE_SIZE } from "@/lib/catalog-constants";
import { cn } from "@/lib/utils";
import { getPublicSanityClient } from "@/sanity/client";
import {
  categoriesQuery,
  examsCatalogFilterQuery,
  productsCatalogCountQuery,
  productsCatalogPagedQuery,
} from "@/sanity/queries";

export const revalidate = 60;

type CategoryRow = { _id: string; title: string; slug: string };
type ExamFilterRow = {
  _id: string;
  title: string;
  slug: string;
  categorySlug: string | null;
  categoryTitle: string | null;
};

function buildBrowseHref(opts: {
  page?: number;
  category?: string;
  exam?: string;
}) {
  const p = new URLSearchParams();
  if (opts.page && opts.page > 1) p.set("page", String(opts.page));
  if (opts.category) p.set("category", opts.category);
  if (opts.exam) p.set("exam", opts.exam);
  const s = p.toString();
  return s ? `/browse?${s}` : "/browse";
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; exam?: string }>;
}) {
  const client = getPublicSanityClient();
  const sp = await searchParams;
  const pageRaw = Number.parseInt(sp.page ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  let categorySlug = (sp.category ?? "").trim();
  let examSlug = (sp.exam ?? "").trim();

  if (!client) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="font-heading text-3xl tracking-tight text-foreground">Catalog</h1>
        <p className="mt-4 text-muted-foreground">
          Configure <code className="font-mono text-sm text-primary">NEXT_PUBLIC_SANITY_PROJECT_ID</code> to load the
          catalog.
        </p>
      </div>
    );
  }

  const categories = (await client.fetch(categoriesQuery)) as CategoryRow[];
  const allExams = (await client.fetch(examsCatalogFilterQuery)) as ExamFilterRow[];

  if (examSlug && categorySlug) {
    const ex = allExams.find((e) => e.slug === examSlug && e.categorySlug === categorySlug);
    if (!ex) {
      examSlug = "";
    }
  } else if (examSlug && !categorySlug) {
    const ex = allExams.find((e) => e.slug === examSlug);
    categorySlug = ex?.categorySlug ?? "";
  }

  const examsForCategory = categorySlug
    ? allExams.filter((e) => e.categorySlug === categorySlug)
    : [];

  if (examSlug && categorySlug && !examsForCategory.some((e) => e.slug === examSlug)) {
    examSlug = "";
  }

  const count = (await client.fetch(productsCatalogCountQuery, {
    categorySlug: categorySlug || "",
    examSlug: examSlug || "",
  })) as number;

  const totalPages = Math.max(1, Math.ceil(count / CATALOG_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * CATALOG_PAGE_SIZE;
  const end = start + CATALOG_PAGE_SIZE;

  const products = (await client.fetch(productsCatalogPagedQuery, {
    categorySlug: categorySlug || "",
    examSlug: examSlug || "",
    start,
    end,
  })) as CatalogProductItem[];

  const filterBase = { category: categorySlug, exam: examSlug };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="border-b border-border/80 bg-gradient-to-b from-primary/[0.07] via-muted/35 to-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl">Find your pack</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Explore PDFs by category and exam, or search to go straight to the pack you need.
          </p>
          <div className="mt-8 max-w-2xl">
            <GlobalSearch variant="light" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</p>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              href={buildBrowseHref({ exam: undefined })}
              active={!categorySlug}
              label="All"
            />
            {categories.map((c) => (
              <FilterPill
                key={c._id}
                href={buildBrowseHref({ category: c.slug })}
                active={categorySlug === c.slug}
                label={c.title}
              />
            ))}
          </div>
        </div>

        {categorySlug ? (
          <div className="mt-8 flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Exam</p>
            <div className="flex flex-wrap gap-2">
              <FilterPill
                href={buildBrowseHref({ category: categorySlug })}
                active={!examSlug}
                label="All in category"
              />
              {examsForCategory.map((e) => (
                <FilterPill
                  key={e._id}
                  href={buildBrowseHref({ category: categorySlug, exam: e.slug })}
                  active={examSlug === e.slug}
                  label={e.title}
                />
              ))}
            </div>
          </div>
        ) : null}

        <p className="mt-10 text-sm text-muted-foreground">
          {count === 0 ? (
            "No products match these filters."
          ) : (
            <>
              Showing{" "}
              <span className="text-foreground">
                {start + 1}–{Math.min(start + products.length, count)}
              </span>{" "}
              of <span className="text-foreground">{count}</span>
            </>
          )}
        </p>

        {products.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center shadow-sm">
            <p className="font-heading text-xl text-foreground">Nothing here yet</p>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {count === 0
                ? "There are no PDF packs in the catalog for this view. Try another filter or check back after new content is published in Sanity."
                : "No packs on this page."}
            </p>
            <Link href="/browse" className="mt-8 inline-flex text-sm font-medium text-primary hover:underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <li key={p._id}>
                <CatalogProductCard product={p} />
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 ? (
          <nav
            className="mt-14 flex flex-wrap items-center justify-center gap-2"
            aria-label="Catalog pagination"
          >
            <PaginationLink
              href={buildBrowseHref({ ...filterBase, page: safePage - 1 })}
              disabled={safePage <= 1}
              label="Previous"
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => {
                if (totalPages <= 7) return true;
                if (n === 1 || n === totalPages) return true;
                return Math.abs(n - safePage) <= 1;
              })
              .map((n, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev !== undefined && n - prev > 1;
                return (
                  <span key={n} className="flex items-center gap-2">
                    {showEllipsis ? <span className="px-1 text-muted-foreground">…</span> : null}
                    <PaginationLink
                      href={buildBrowseHref({ ...filterBase, page: n })}
                      disabled={false}
                      label={String(n)}
                      current={n === safePage}
                    />
                  </span>
                );
              })}
            <PaginationLink
              href={buildBrowseHref({ ...filterBase, page: safePage + 1 })}
              disabled={safePage >= totalPages}
              label="Next"
            />
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border/80 bg-card text-foreground shadow-sm hover:border-border hover:bg-accent/60",
      )}
    >
      {label}
    </Link>
  );
}

function PaginationLink({
  href,
  disabled,
  label,
  current,
}: {
  href: string;
  disabled: boolean;
  label: string;
  current?: boolean;
}) {
  if (disabled) {
    return (
      <span
        className="rounded-full border border-border/80 bg-muted/30 px-4 py-2 text-sm text-muted-foreground"
        aria-disabled="true"
      >
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-colors shadow-sm",
        current
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border/80 bg-card text-foreground hover:border-border hover:bg-accent/60",
      )}
      aria-current={current ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
