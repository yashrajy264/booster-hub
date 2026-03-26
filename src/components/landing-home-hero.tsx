"use client";

import Link from "next/link";

import { GlobalSearch } from "@/components/global-search";
import { AnimatedHeading } from "@/components/ui/animated-text";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export function LandingHomeHero({ showSearch }: { showSearch: boolean }) {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-10 pb-4 text-center sm:px-6 sm:pt-14 sm:pb-8">
      <AnimatedHeading
        text="Find your next study pack"
        className="text-4xl leading-[1.15] sm:text-5xl lg:text-[3.25rem]"
      />
      <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        Focused PDF packs for government and competitive exams. Search by category, exam, or pack name.
      </p>

      {showSearch ? (
        <div className="mx-auto mt-10 w-full max-w-2xl">
          <GlobalSearch variant="light" size="lg" />
        </div>
      ) : (
        <p className="mx-auto mt-10 max-w-md rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          Connect Sanity (see <code className="font-mono text-xs text-foreground">.env.example</code>) to
          enable search.
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/browse" className={cn(buttonVariants({ size: "lg" }), "min-w-[9rem] rounded-full")}>
          Browse catalog
        </Link>
        <Link
          href="/about"
          className="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          About us
        </Link>
      </div>

      <p className="mt-10 text-xs font-medium tracking-wide text-muted-foreground">
        SSC · UPSC · Banking · State exams · Railways
      </p>
    </section>
  );
}
