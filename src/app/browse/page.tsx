import Link from "next/link";
import { getPublicSanityClient } from "@/sanity/client";
import { categoriesQuery, examsByCategorySlugQuery } from "@/sanity/queries";

export const revalidate = 60;

export default async function BrowsePage() {
  const client = getPublicSanityClient();
  if (!client) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="font-heading text-3xl tracking-tight">Browse</h1>
        <p className="mt-4 text-muted-foreground">
          Configure <code className="font-mono text-sm">NEXT_PUBLIC_SANITY_PROJECT_ID</code> to load
          the catalog.
        </p>
      </div>
    );
  }

  type CategoryRow = {
    _id: string;
    title: string;
    slug: string;
    description?: string | null;
  };
  type ExamRow = {
    _id: string;
    title: string;
    slug: string;
    description?: string | null;
  };
  const categories = (await client.fetch(categoriesQuery)) as CategoryRow[];

  const examsByCategory = await Promise.all(
    categories.map(async (cat) => {
      const exams = (await client.fetch(examsByCategorySlugQuery, {
        categorySlug: cat.slug,
      })) as ExamRow[];
      return { ...cat, exams };
    }),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl tracking-tight">Browse</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Pick a category, then an exam to see available PDF packs.
      </p>

      <div className="mt-12 space-y-16">
        {examsByCategory.map((row) => (
            <section key={row._id} id={row.slug}>
              <h2 className="font-heading text-2xl tracking-tight">{row.title}</h2>
              {row.description ? (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{row.description}</p>
              ) : null}
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {row.exams.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No exams yet.</li>
                ) : (
                  row.exams.map((e) => (
                    <li key={e._id} className="border border-border p-4">
                      <Link
                        href={`/${row.slug}/${e.slug}`}
                        className="font-medium hover:underline"
                      >
                        {e.title}
                      </Link>
                      {e.description ? (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {e.description}
                        </p>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}
