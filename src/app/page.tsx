import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { getPublicSanityClient } from "@/sanity/client";
import { categoriesQuery, featuredProductsQuery } from "@/sanity/queries";

export const revalidate = 60;

export default async function HomePage() {
  const client = getPublicSanityClient();
  const categories = client ? await client.fetch(categoriesQuery) : [];
  const featured = client ? await client.fetch(featuredProductsQuery) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <section className="max-w-2xl space-y-6">
        <h1 className="font-heading text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
          Study PDFs for less.
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          BoosterHub lists focused PDF packs for government and competitive exams — current affairs,
          practice questions, and quick tips — priced for students.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/browse" className={cn(buttonVariants(), "rounded-none")}>
            Browse categories
          </Link>
          <Link
            href="/legal"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-none")}
          >
            Policies
          </Link>
        </div>
      </section>

      {!client ? (
        <p className="mt-16 text-sm text-muted-foreground">
          Connect Sanity (see <code className="font-mono text-xs">.env.example</code>) to load
          categories and products.
        </p>
      ) : null}

      {categories.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-heading text-2xl tracking-tight">Categories</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map(
              (c: { _id: string; title: string; slug: string; description?: string | null }) => (
                <li key={c._id} className="border border-border p-4">
                  <Link href={`/browse#${c.slug}`} className="font-medium hover:underline">
                    {c.title}
                  </Link>
                  {c.description ? (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  ) : null}
                </li>
              ),
            )}
          </ul>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-heading text-2xl tracking-tight">Featured PDFs</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {featured.map(
              (p: {
                _id: string;
                title: string;
                slug: string;
                shortDescription?: string | null;
                pricePaise?: number | null;
                accessMode: string;
                examSlug?: string | null;
                categorySlug?: string | null;
              }) => (
                <ProductCard
                  key={p._id}
                  product={{
                    ...p,
                    categorySlug: p.categorySlug ?? null,
                    examSlug: p.examSlug ?? null,
                  }}
                />
              ),
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
