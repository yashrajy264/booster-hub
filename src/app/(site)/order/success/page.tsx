import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { getMaxDownloadsPerOrder } from "@/lib/download-limits";
import { cn } from "@/lib/utils";
import { getPublicSanityClient } from "@/sanity/client";
import { productBySlugPublicQuery } from "@/sanity/queries";

type Props = {
  searchParams: Promise<{ token?: string; slug?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { token, slug } = await searchParams;
  if (!token || !slug) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="font-heading text-2xl tracking-tight">Order</h1>
        <p className="mt-4 text-muted-foreground">
          Missing download token. If you completed a payment, check your email or contact support with
          your Razorpay payment id.
        </p>
        <Link
          href="/browse"
          className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
        >
          Browse PDFs
        </Link>
      </div>
    );
  }

  const client = getPublicSanityClient();
  const product = client ? await client.fetch(productBySlugPublicQuery, { slug }) : null;
  const deliveryMode = product?.deliveryMode === "bundle" ? "bundle" : "single";
  const bundleItemCount =
    deliveryMode === "bundle" ? Math.max(0, Number(product?.bundleItemCount ?? 0)) : 0;
  const itemLinks = Array.from({ length: bundleItemCount }).map((_, index) => ({
    title: `Download PDF ${index + 1}`,
    href: `/api/download?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}&item=${index}`,
  }));

  const singleHref = `/api/download?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}`;
  const bundleZipHref = `/api/download/bundle?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}`;
  const maxDownloads = getMaxDownloadsPerOrder();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-heading text-2xl tracking-tight">Payment successful</h1>
      <p className="mt-4 text-muted-foreground">
        {deliveryMode === "bundle"
          ? `Your kit is ready. Download links stay valid for 24 hours and allow up to ${maxDownloads} download${maxDownloads > 1 ? "s" : ""}.`
          : `Your download is ready. This link is valid for 24 hours and allows up to ${maxDownloads} download${maxDownloads > 1 ? "s" : ""}.`}
      </p>
      <div className="mt-10 flex flex-col gap-3">
        {deliveryMode === "bundle" ? (
          <>
            <a href={bundleZipHref} className={cn(buttonVariants())}>
              Download kit (.zip)
            </a>
            {itemLinks.map((item) => (
              <a key={item.href} href={item.href} className={cn(buttonVariants({ variant: "outline" }))}>
                {item.title}
              </a>
            ))}
          </>
        ) : (
          <a href={singleHref} className={cn(buttonVariants())}>
            Download full PDF
          </a>
        )}
        <Link
          href={`/p/${slug}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to product
        </Link>
      </div>
    </div>
  );
}
