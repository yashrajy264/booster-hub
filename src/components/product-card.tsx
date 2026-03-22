import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInrFromPaise } from "@/lib/format-inr";
import { urlForImage } from "@/sanity/image";

export type ProductCardItem = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  pricePaise?: number | null;
  accessMode: string;
  categorySlug?: string | null;
  examSlug?: string | null;
  coverImage?: SanityImageSource | null;
};

function coverUrl(cover: SanityImageSource | null | undefined) {
  if (!cover) return null;
  return urlForImage(cover)?.width(640).height(400).fit("crop").auto("format").url() ?? null;
}

export function ProductCard({ product }: { product: ProductCardItem }) {
  const href = `/p/${product.slug}`;
  const priceLabel =
    product.accessMode === "free"
      ? "Free"
      : formatInrFromPaise(Math.max(0, Number(product.pricePaise ?? 0)));
  const img = coverUrl(product.coverImage ?? undefined);

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md">
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="relative aspect-[16/10] bg-muted">
          {img ? (
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-accent/30">
              <span className="font-heading text-2xl tracking-tight text-primary/40">PDF</span>
            </div>
          )}
        </div>
      </Link>
      <CardHeader className="gap-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="font-heading text-lg leading-snug">
            <Link href={href} className="hover:underline">
              {product.title}
            </Link>
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 font-normal">
            {priceLabel}
          </Badge>
        </div>
        {product.categorySlug && product.examSlug ? (
          <p className="text-xs text-muted-foreground">
            <Link
              href={`/${product.categorySlug}/${product.examSlug}`}
              className="hover:text-foreground"
            >
              {product.categorySlug.replace(/-/g, " ")} · {product.examSlug.replace(/-/g, " ")}
            </Link>
          </p>
        ) : null}
      </CardHeader>
      {product.shortDescription ? (
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">{product.shortDescription}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
