import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { LandingFaq } from "@/components/landing-faq";
import { LandingHomeHero } from "@/components/landing-home-hero";
import { ProductCard } from "@/components/product-card";
import { getPublicSanityClient } from "@/sanity/client";
import { categoriesQuery, featuredProductsQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

export const revalidate = 60;

function categoryThumbUrl(cover: SanityImageSource | null | undefined) {
  if (!cover) return null;
  return urlForImage(cover)?.width(80).height(80).fit("crop").auto("format").url() ?? null;
}

export default async function HomePage() {
  const client = getPublicSanityClient();
  const categories = client ? await client.fetch(categoriesQuery) : [];
  const featured = client ? await client.fetch(featuredProductsQuery) : [];

  return (
    <div className="pb-24">
      <LandingHomeHero showSearch={Boolean(client)} />

      {categories.length > 0 ? (
        <section className="mx-auto mt-12 max-w-4xl px-4 sm:mt-16 sm:px-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl tracking-tight text-foreground sm:text-3xl">Categories</h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
              Jump to an exam category.
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map(
              (c: {
                _id: string;
                title: string;
                slug: string;
                description?: string | null;
                coverImage?: SanityImageSource | null;
              }) => {
                const thumb = categoryThumbUrl(c.coverImage);
                return (
                  <li key={c._id}>
                    <Link
                      href={`/${c.slug}`}
                      className="group flex max-w-[min(100%,14rem)] items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 pr-4 text-left text-sm text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-accent/50"
                    >
                      <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted">
                        {thumb ? (
                          <Image src={thumb} alt="" fill className="object-cover" sizes="36px" />
                        ) : (
                          <span className="flex h-full items-center justify-center font-heading text-xs text-muted-foreground">
                            {c.title.slice(0, 1)}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 truncate font-medium group-hover:underline">{c.title}</span>
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
          <p className="mt-6 text-center">
            <Link href="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              View all in catalog
            </Link>
          </p>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:mt-24 sm:px-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl tracking-tight text-foreground sm:text-3xl">Featured PDFs</h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
              Hand-picked packs for your preparation.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                coverImage?: SanityImageSource | null;
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

      <LandingFaq />
    </div>
  );
}
