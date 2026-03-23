import { notFound, redirect } from "next/navigation";

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
  redirect(`/${product.categorySlug}/${product.examSlug}/${product.slug}`);
}
