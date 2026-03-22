import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

type Props = {
  /** Path without query string, e.g. `/ssc/cgl` */
  pathname: string;
  page: number;
  totalPages: number;
};

export function CatalogPagination({ pathname, page, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) => (p <= 1 ? pathname : `${pathname}?page=${p}`);
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <nav
      className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
      aria-label="Pagination"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href={href(prev)}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            page <= 1 && "pointer-events-none opacity-40",
          )}
          rel={page > 1 ? "prev" : undefined}
          aria-disabled={page <= 1}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </Link>
        <p className="min-w-[10rem] px-2 text-center text-sm tabular-nums text-muted-foreground">
          Page <span className="font-medium text-foreground">{page}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </p>
        <Link
          href={href(next)}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            page >= totalPages && "pointer-events-none opacity-40",
          )}
          rel={page < totalPages ? "next" : undefined}
          aria-disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
    </nav>
  );
}
