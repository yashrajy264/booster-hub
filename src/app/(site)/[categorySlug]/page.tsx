import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { SanityImageSource } from "@sanity/image-url";

import { getPublicSanityClient } from "@/sanity/client";
import { categoryBySlugQuery, examsByCategorySlugQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

export const revalidate = 60;

type Props = { params: Promise<{ categorySlug: string }> };

function categoryCoverUrl(cover: SanityImageSource | null | undefined) {
  if (!cover) return null;
  return urlForImage(cover)?.width(1200).height(560).fit("crop").auto("format").url() ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const client = getPublicSanityClient();
  if (!client) return { title: "Category" };
  const category = await client.fetch(categoryBySlugQuery, { slug: categorySlug });
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

  const category = await client.fetch(categoryBySlugQuery, { slug: categorySlug });
  if (!category) notFound();

  const exams = await client.fetch(examsByCategorySlugQuery, { categorySlug });
  type ExamRow = {
    _id: string;
    title: string;
    slug: string;
    description?: string | null;
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
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{category.title}</span>
          </nav>
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
            <li className="text-sm text-muted-foreground">No exams in this category yet.</li>
          ) : (
            examList.map((e) => (
              <li key={e._id}>
                <Link
                  href={`/${categorySlug}/${e.slug}`}
                  className="block rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="font-heading text-lg text-foreground">{e.title}</span>
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
