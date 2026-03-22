import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublicSanityClient } from "@/sanity/client";
import { categoriesQuery } from "@/sanity/queries";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = getPublicSanityClient();
  const categories = client
    ? ((await client.fetch(categoriesQuery)) as { title: string; slug: string }[])
    : [];

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
