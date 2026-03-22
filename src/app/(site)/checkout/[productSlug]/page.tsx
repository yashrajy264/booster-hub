import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { getPublicSanityClient } from "@/sanity/client";
import { productBySlugPublicQuery } from "@/sanity/queries";

export const revalidate = 60;

type Props = { params: Promise<{ productSlug: string }> };

export default async function CheckoutPage({ params }: Props) {
  const { productSlug } = await params;
  const client = getPublicSanityClient();
  if (!client) notFound();

  const product = await client.fetch(productBySlugPublicQuery, { slug: productSlug });
  if (!product || product.accessMode !== "paid") {
    notFound();
  }

  const pricePaise = Math.round(Number(product.pricePaise ?? 0));
  if (pricePaise < 100) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Link href={`/p/${product.slug}`} className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to {product.title}
      </Link>
      <h1 className="mt-6 font-heading text-2xl tracking-tight">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You are buying{" "}
        <span className="text-foreground">{product.title}</span>. Pay securely with Razorpay.
      </p>
      <div className="mt-10 border border-border p-6">
        <CheckoutForm productSlug={product.slug} title={product.title} pricePaise={pricePaise} />
      </div>
    </div>
  );
}
