import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { SanityImageSource } from "@sanity/image-url";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PdfSamplePreview } from "@/components/pdf-preview";
import { PortableBody } from "@/components/portable-body";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { formatInrFromPaise } from "@/lib/format-inr";
import { Separator } from "@/components/ui/separator";
import { getPublicSanityClient } from "@/sanity/client";
import { productByHierarchySlugsQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

export const revalidate = 60;

type Props = { params: Promise<{ categorySlug: string; examSlug: string; productSlug: string }> };

function coverUrl(cover: SanityImageSource | null | undefined) {
  if (!cover) return null;
  return urlForImage(cover)?.width(1200).height(640).fit("crop").auto("format").url() ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug, examSlug, productSlug } = await params;
  const client = getPublicSanityClient();
  if (!client) return { title: "Product" };
  const product = await client.fetch(productByHierarchySlugsQuery, {
    categorySlug,
    examSlug,
    productSlug,
  });
  if (!product) return { title: "Not found" };
  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { categorySlug, examSlug, productSlug } = await params;
  const client = getPublicSanityClient();
  if (!client) notFound();

  const product = await client.fetch(productByHierarchySlugsQuery, {
    categorySlug,
    examSlug,
    productSlug,
  });
  if (!product) notFound();

  const listHref = `/${product.categorySlug}/${product.examSlug}`;
  const priceLabel =
    product.accessMode === "free"
      ? "Free"
      : formatInrFromPaise(Math.max(0, Number(product.pricePaise ?? 0)));
  const hero = coverUrl(product.coverImage);
  const hasManualPreview = Boolean(product.previewPdfUrl);
  const hasDerivedRange =
    Number.isInteger(product.previewStartPage) &&
    Number.isInteger(product.previewEndPage) &&
    Number(product.previewStartPage) > 0 &&
    Number(product.previewEndPage) >= Number(product.previewStartPage);
  const previewUrl = hasManualPreview
    ? product.previewPdfUrl
    : hasDerivedRange
      ? `/api/preview?slug=${encodeURIComponent(product.slug)}`
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: product.categoryTitle, href: `/${product.categorySlug}` },
          { label: product.examTitle, href: listHref },
          { label: product.title },
        ]}
      />

      {hero ? (
        <div className="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border/80 shadow-md">
          <Image
            src={hero}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        </div>
      ) : null}

      <div
        className={cn(
          "mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12",
          !hero && "mt-8",
        )}
      >
        <div className="max-w-2xl space-y-4">
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">{product.title}</h1>
          <p className="text-sm text-muted-foreground">
            {product.categoryTitle} · {product.examTitle}
          </p>
          {product.shortDescription ? (
            <p className="text-lg leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          ) : null}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm lg:w-80">
          <p className="font-heading text-3xl tracking-tight text-foreground">{priceLabel}</p>
          <Separator />
          {product.accessMode === "paid" ? (
            <Link
              href={`/checkout/${product.slug}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
            >
              Buy with Razorpay
            </Link>
          ) : (
            <a
              href={`/api/download?slug=${encodeURIComponent(product.slug)}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
            >
              Download full PDF
            </a>
          )}
          {product.accessMode === "paid" ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              No account. Pay once, download instantly after payment.
            </p>
          ) : null}
        </div>
      </div>

      {previewUrl ? (
        <section className="mt-14 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-xl tracking-tight sm:text-2xl">Sample preview</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                If the preview does not load, open it in a new tab - some browsers block embedded PDFs.
              </p>
              {!hasManualPreview && hasDerivedRange ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Preview pages: {product.previewStartPage}-{product.previewEndPage}
                </p>
              ) : null}
            </div>
          </div>
          <PdfSamplePreview previewUrl={previewUrl} productTitle={product.title} />
        </section>
      ) : null}

      {product.body ? (
        <section className="mt-16 border-t border-border/60 pt-12">
          <h2 className="font-heading text-xl tracking-tight sm:text-2xl">About this pack</h2>
          <div className="mt-6 max-w-3xl">
            <PortableBody value={product.body} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
