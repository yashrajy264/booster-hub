import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { SanityImageSource } from "@sanity/image-url";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPublicSanityClient } from "@/sanity/client";
import { categoriesQuery, categoryBySlugQuery, examsByCategorySlugQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

export const revalidate = 60;

type Props = { params: Promise<{ categorySlug: string }> };

function normalizeSlug(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function categoryCoverUrl(cover: SanityImageSource | null | undefined) {
  if (!cover) return null;
  return urlForImage(cover)?.width(1200).height(560).fit("crop").auto("format").url() ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const client = getPublicSanityClient();
  if (!client) return { title: "Category" };
  let category = await client.fetch(categoryBySlugQuery, { slug: categorySlug });
  if (!category) {
    const categories = (await client.fetch(categoriesQuery)) as { title: string; slug: string }[];
    const wanted = normalizeSlug(categorySlug);
    category = categories.find((c) => normalizeSlug(c.slug) === wanted) ?? null;
  }
  if (!category) return { title: "Not found" };
  return {
    title: category.seoTitle || category.title,
    description: category.seoDescription || category.description,
  };
}

export default async function CategoryHubPage({ params }: Props) {
  const { categorySlug } = await params;
  const client = getPublicSanityClient();
  if (!client) notFound();

  let category = await client.fetch(categoryBySlugQuery, { slug: categorySlug });
  if (!category) {
    const categories = (await client.fetch(categoriesQuery)) as {
      _id: string;
      title: string;
      slug: string;
      description?: string | null;
      coverImage?: SanityImageSource | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
    }[];
    const wanted = normalizeSlug(categorySlug);
    category = categories.find((c) => normalizeSlug(c.slug) === wanted) ?? null;
  }
  if (!category) notFound();

  const exams = await client.fetch(examsByCategorySlugQuery, { categorySlug });
  type ExamRow = {
    _id: string;
    title: string;
    slug: string;
    description?: string | null;
    productCount?: number | null;
  };
  const examList = exams as ExamRow[];

  const hero = categoryCoverUrl(category.coverImage);

  return (
    <div>
      <section
        className={`relative overflow-hidden border-b border-border/80 ${hero ? "" : "bg-muted/35"}`}
      >
        {hero ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={hero}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25" />
            </div>
          </>
        ) : null}
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.title }]} />
          <h1 className="mt-4 font-heading text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
            {category.title}
          </h1>
          {category.description ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {category.description}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-heading text-2xl tracking-tight">Exams</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose an exam to browse PDF packs and previews.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {examList.length === 0 ? (
            <li className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-5">
              <p className="text-sm text-muted-foreground">No exams in this category yet.</p>
              <Link href="/browse" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                Browse all packs
              </Link>
            </li>
          ) : (
            examList.map((e) => (
              <li key={e._id}>
                <Link
                  href={`/${categorySlug}/${e.slug}`}
                  className="block rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="font-heading text-lg text-foreground">{e.title}</span>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {(e.productCount ?? 0) === 1 ? "1 PDF pack" : `${e.productCount ?? 0} PDF packs`}
                  </p>
                  {e.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
