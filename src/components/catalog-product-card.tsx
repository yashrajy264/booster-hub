import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { Badge } from "@/components/ui/badge";
import { formatInrFromPaise } from "@/lib/format-inr";
import { urlForImage } from "@/sanity/image";

export type CatalogProductItem = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  pricePaise?: number | null;
  accessMode: string;
  categorySlug?: string | null;
  examSlug?: string | null;
  categoryTitle?: string | null;
  examTitle?: string | null;
  coverImage?: SanityImageSource | null;
};

function coverUrl(cover: SanityImageSource | null | undefined) {
  if (!cover) return null;
  return urlForImage(cover)?.width(640).height(400).fit("crop").auto("format").url() ?? null;
}

export function CatalogProductCard({ product }: { product: CatalogProductItem }) {
  const href =
    product.categorySlug && product.examSlug
      ? `/${product.categorySlug}/${product.examSlug}/${product.slug}`
      : `/p/${product.slug}`;
  const priceLabel =
    product.accessMode === "free"
      ? "Free"
      : formatInrFromPaise(Math.max(0, Number(product.pricePaise ?? 0)));
  const img = coverUrl(product.coverImage ?? undefined);
  const meta =
    product.categoryTitle && product.examTitle
      ? `${product.categoryTitle} · ${product.examTitle}`
      : product.examTitle || product.categoryTitle || "";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-border/50 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={href}
        className="relative block aspect-[16/10] overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {img ? (
          <Image
            src={img}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
            <span className="font-heading text-2xl tracking-tight text-primary/40">PDF</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {meta ? (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{meta}</p>
        ) : null}
        <h3 className="mt-2 font-heading text-lg leading-snug text-foreground">
          <Link href={href} className="hover:text-primary">
            {product.title}
          </Link>
        </h3>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-4">
          <Badge variant="secondary" className="border-0 bg-primary/10 font-normal text-primary">
            {priceLabel}
          </Badge>
          <Link href={href} className="text-sm font-medium text-primary hover:underline">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
