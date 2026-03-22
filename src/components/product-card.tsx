import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInrFromPaise } from "@/lib/format-inr";

export type ProductCardItem = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  pricePaise?: number | null;
  accessMode: string;
  categorySlug?: string | null;
  examSlug?: string | null;
};

export function ProductCard({ product }: { product: ProductCardItem }) {
  const href = `/p/${product.slug}`;
  const priceLabel =
    product.accessMode === "free"
      ? "Free"
      : formatInrFromPaise(Math.max(0, Number(product.pricePaise ?? 0)));

  return (
    <Card className="rounded-none border-border shadow-none ring-1 ring-border">
      <CardHeader className="gap-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="font-heading text-lg leading-snug">
            <Link href={href} className="hover:underline">
              {product.title}
            </Link>
          </CardTitle>
          <Badge variant="secondary" className="rounded-none font-normal">
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
