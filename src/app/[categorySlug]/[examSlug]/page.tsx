import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard, type ProductCardItem } from "@/components/product-card";
import { getPublicSanityClient } from "@/sanity/client";
import { examBySlugsQuery, productsByExamQuery } from "@/sanity/queries";

export const revalidate = 60;

type Props = {
  params: Promise<{ categorySlug: string; examSlug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { categorySlug, examSlug } = await params;
  const client = getPublicSanityClient();
  if (!client) return { title: "Exam" };
  const exam = await client.fetch(examBySlugsQuery, { categorySlug, examSlug });
  if (!exam) return { title: "Not found" };
  return {
    title: exam.seoTitle || exam.title,
    description: exam.seoDescription || exam.description,
  };
}

export default async function ExamPage({ params }: Props) {
  const { categorySlug, examSlug } = await params;
  const client = getPublicSanityClient();
  if (!client) notFound();

  const exam = await client.fetch(examBySlugsQuery, { categorySlug, examSlug });
  if (!exam) notFound();

  const products = await client.fetch(productsByExamQuery, { examId: exam._id });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/browse" className="hover:text-foreground">
          Browse
        </Link>
        <span className="mx-2">/</span>
        <span>{exam.categoryTitle}</span>
      </nav>
      <h1 className="mt-4 font-heading text-3xl tracking-tight">{exam.title}</h1>
      {exam.description ? (
        <p className="mt-4 max-w-2xl text-muted-foreground">{exam.description}</p>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {(products as ProductCardItem[]).length === 0 ? (
          <p className="text-sm text-muted-foreground">No PDFs listed for this exam yet.</p>
        ) : (
          (products as ProductCardItem[]).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))
        )}
      </div>
    </div>
  );
}
