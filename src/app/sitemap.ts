import type { MetadataRoute } from "next";
import { getPublicSanityClient } from "@/sanity/client";
import { categoriesQuery } from "@/sanity/queries";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date() },
    { url: `${base}/browse`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/legal`, lastModified: new Date() },
  ];

  const client = getPublicSanityClient();
  if (!client) {
    return staticRoutes;
  }

  const categories = (await client.fetch(categoriesQuery)) as { slug: string }[];
  const categoryUrls = categories.map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryUrls];
}
