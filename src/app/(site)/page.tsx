import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { BookOpen, CheckCircle2, CreditCard, Download, Play, Star } from "lucide-react";

import { GlobalSearch } from "@/components/global-search";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { getPublicSanityClient } from "@/sanity/client";
import { categoriesQuery, featuredProductsQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

export const revalidate = 60;

function categoryCoverUrl(cover: SanityImageSource | null | undefined) {
  if (!cover) return null;
  return urlForImage(cover)?.width(800).height(520).fit("crop").auto("format").url() ?? null;
}

export default async function HomePage() {
  const client = getPublicSanityClient();
  const categories = client ? await client.fetch(categoriesQuery) : [];
  const featured = client ? await client.fetch(featuredProductsQuery) : [];

  return (
    <div className="pb-20">
      {/* Hero Section Container */}
      <section className="mx-auto mt-6 max-w-[1400px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-muted/80 via-muted/50 to-background px-6 py-16 sm:px-12 sm:py-24 lg:px-20 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <div className="max-w-xl space-y-10">
              <div className="inline-flex items-center gap-3 rounded-full bg-background/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Star className="size-3.5 fill-current" />
                </span>
                <span>10k+ Students</span>
                <span className="text-muted-foreground">Read Our Success Stories</span>
              </div>

              <h1 className="font-heading text-6xl font-normal leading-[1.1] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem]">
                Prepare<span className="text-primary">+</span>
              </h1>

              <div className="space-y-8 border-t border-border/60 pt-8">
                <p className="text-xl leading-relaxed text-muted-foreground">
                  Drive your exam scores higher with focused PDF study packs. Up to 50x faster revision.
                </p>

                {client ? (
                  <div className="w-full max-w-xl pt-2">
                    <GlobalSearch variant="light" />
                  </div>
                ) : null}

                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="size-10 rounded-full border-2 border-background bg-muted" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Loved the performance</p>
                    <p className="text-muted-foreground">100% Satisfied / <Star className="inline size-3 fill-primary text-primary" /> 4.9</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/browse" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 text-base")}>
                    Download — It's Free
                  </Link>
                  <Link href="/browse" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
                    Our Catalog <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Content - Floating Bento Box Style */}
            <div className="relative h-[500px] w-full lg:h-[600px]">
              {/* Main Image Container */}
              <div className="absolute inset-y-0 right-0 w-[90%] overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/40 to-primary/10">
                <div className="absolute inset-0 bg-[url('/about-hero.png')] bg-cover bg-center opacity-60 mix-blend-overlay" />
              </div>

              {/* Floating Elements */}
              <div className="absolute left-0 top-1/4 flex flex-col gap-3">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-background/90 px-5 py-3 shadow-lg backdrop-blur-md">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckCircle2 className="size-4" />
                  </span>
                  <span className="text-sm font-medium">Current Affairs 2026?</span>
                </div>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-primary px-5 py-3 text-primary-foreground shadow-lg">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary-foreground/20">
                    <CheckCircle2 className="size-4" />
                  </span>
                  <span className="text-sm font-medium">Practice MCQs?</span>
                </div>
              </div>

              <div className="absolute right-8 top-12 rounded-3xl bg-background/80 p-6 shadow-xl backdrop-blur-md">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">— UP TO</p>
                <p className="mt-2 font-heading text-5xl tracking-tight">60%</p>
                <p className="mt-1 text-sm text-muted-foreground">More retention<br/>this week</p>
              </div>

              <div className="absolute bottom-12 right-12 flex items-center gap-6 rounded-3xl bg-background/80 p-4 pr-8 shadow-xl backdrop-blur-md">
                <div className="size-24 rounded-2xl bg-muted" />
                <div>
                  <p className="font-medium text-foreground">SSC CGL Tier 1</p>
                  <p className="font-heading text-2xl tracking-tight">₹49.00</p>
                  <div className="mt-1 flex items-center gap-1 text-sm font-medium">
                    <Star className="size-4 fill-primary text-primary" /> 4.8
                  </div>
                </div>
              </div>

              <button className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-xl transition-transform hover:scale-110">
                <Play className="size-6 fill-foreground text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground sm:justify-between lg:gap-12">
          {["SSC", "UPSC", "Banking", "State Exams", "Railways"].map((exam) => (
            <span key={exam} className="font-heading text-2xl font-medium tracking-tight opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              {exam}
            </span>
          ))}
        </div>
      </section>

      {!client ? (
        <p className="mx-auto mt-24 max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          Connect Sanity (see <code className="font-mono text-xs">.env.example</code>) to load
          categories and products.
        </p>
      ) : null}

      {categories.length > 0 ? (
        <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">Categories</h2>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Explore exams and PDF packs by category.
              </p>
            </div>
            <Link href="/browse" className="hidden text-sm font-medium hover:underline sm:block">
              View all
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(
              (c: {
                _id: string;
                title: string;
                slug: string;
                description?: string | null;
                coverImage?: SanityImageSource | null;
              }) => {
                const img = categoryCoverUrl(c.coverImage);
                return (
                  <li key={c._id}>
                    <Link
                      href={`/${c.slug}`}
                      className="group block overflow-hidden rounded-[2rem] border border-border/80 bg-card p-2 shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
                        {img ? (
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/40">
                            <span className="font-heading text-2xl text-primary/50">{c.title}</span>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-6">
                        <span className="font-heading text-xl text-foreground group-hover:underline">
                          {c.title}
                        </span>
                        {c.description ? (
                          <p className="mt-2 line-clamp-2 text-muted-foreground">
                            {c.description}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
          <div className="rounded-[3rem] bg-muted/30 px-6 py-16 sm:px-12 sm:py-24">
            <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">Featured PDFs</h2>
            <p className="mt-3 text-lg text-muted-foreground">Hand-picked packs for your preparation.</p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </section>
      ) : null}
    </div>
  );
}
