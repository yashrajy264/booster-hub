import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableBody } from "@/components/portable-body";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { formatInrFromPaise } from "@/lib/format-inr";
import { getPublicSanityClient } from "@/sanity/client";
import { productBySlugPublicQuery } from "@/sanity/queries";

export const revalidate = 60;

type Props = { params: Promise<{ productSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { productSlug } = await params;
  const client = getPublicSanityClient();
  if (!client) return { title: "Product" };
  const product = await client.fetch(productBySlugPublicQuery, { slug: productSlug });
  if (!product) return { title: "Not found" };
  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { productSlug } = await params;
  const client = getPublicSanityClient();
  if (!client) notFound();

  const product = await client.fetch(productBySlugPublicQuery, { slug: productSlug });
  if (!product) notFound();

  const listHref = `/${product.categorySlug}/${product.examSlug}`;
  const priceLabel =
    product.accessMode === "free"
      ? "Free"
      : formatInrFromPaise(Math.max(0, Number(product.pricePaise ?? 0)));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/browse" className="hover:text-foreground">
          Browse
        </Link>
        <span className="mx-2">/</span>
        <Link href={listHref} className="hover:text-foreground">
          {product.examTitle}
        </Link>
      </nav>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">{product.title}</h1>
          <p className="text-sm text-muted-foreground">
            {product.categoryTitle} · {product.examTitle}
          </p>
          {product.shortDescription ? (
            <p className="text-muted-foreground">{product.shortDescription}</p>
          ) : null}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 border border-border p-4 lg:w-72">
          <p className="font-heading text-2xl tracking-tight">{priceLabel}</p>
          <Separator />
          {product.accessMode === "paid" ? (
            <Link
              href={`/checkout/${product.slug}`}
              className={cn(buttonVariants(), "rounded-none")}
            >
              Buy with Razorpay
            </Link>
          ) : (
            <a
              href={`/api/download?slug=${encodeURIComponent(product.slug)}`}
              className={cn(buttonVariants(), "rounded-none")}
            >
              Download full PDF
            </a>
          )}
          {product.accessMode === "paid" ? (
            <p className="text-xs text-muted-foreground">
              No account. Pay once, download instantly after payment.
            </p>
          ) : null}
        </div>
      </div>

      <section className="mt-12 space-y-4">
        <h2 className="font-heading text-xl tracking-tight">Sample preview</h2>
        <div className="aspect-[3/4] w-full max-w-3xl border border-border bg-muted/30">
          <iframe
            title="PDF preview"
            src={`${product.previewPdfUrl}#view=FitH`}
            className="h-full min-h-[480px] w-full"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          <a href={product.previewPdfUrl} className="underline">
            Open preview in new tab
          </a>
        </p>
      </section>

      {product.body ? (
        <section className="mt-16">
          <h2 className="font-heading text-xl tracking-tight">About this pack</h2>
          <div className="mt-6">
            <PortableBody value={product.body} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
