import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { FolderOpen, Home, Info, LayoutGrid, Menu } from "lucide-react";

import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const THIN_STROKE = 1.25;

const coreLinks: readonly { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/browse", label: "Browse", Icon: LayoutGrid },
  { href: "/about", label: "About", Icon: Info },
];

export type NavCategory = { title: string; slug: string };

const MAX_CATEGORY_LINKS = 4;

export function SiteHeader({ categories = [] }: { categories?: NavCategory[] }) {
  const categoryLinks = categories.slice(0, MAX_CATEGORY_LINKS);

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6" data-site-header>
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 rounded-full border border-border/80 bg-background/90 px-4 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:px-6">
        <Link
          href="/"
          aria-label="PrepareUp home"
          className="flex h-full min-h-0 min-w-0 shrink items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
        >
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {coreLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {l.label}
            </Link>
          ))}
          {categoryLinks.length > 0 ? (
            <span className="mx-2 h-4 w-px shrink-0 bg-border" aria-hidden />
          ) : null}
          {categoryLinks.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="max-w-[8rem] truncate rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title={c.title}
            >
              {c.title}
            </Link>
          ))}
          {categories.length > MAX_CATEGORY_LINKS ? (
            <Link
              href="/browse"
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-primary hover:underline"
            >
              More
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/browse"
            className={cn(buttonVariants({ variant: "default", size: "sm" }), "hidden sm:inline-flex rounded-full px-5")}
          >
            Get Started
          </Link>
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "lg:hidden rounded-full")}
              aria-label="Open menu"
            >
              <Menu className="size-4" strokeWidth={THIN_STROKE} aria-hidden />
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[85vh] overflow-y-auto rounded-t-3xl border-border border-t bg-background/85 p-6 pb-10 pt-8 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
            >
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {coreLinks.map((l) => {
                  const ItemIcon = l.Icon;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-lg text-foreground transition-colors hover:bg-accent/60"
                    >
                      <ItemIcon
                        className="size-[1.125rem] shrink-0 text-muted-foreground"
                        strokeWidth={THIN_STROKE}
                        aria-hidden
                      />
                      {l.label}
                    </Link>
                  );
                })}
                {categoryLinks.length > 0 ? (
                  <p className="mt-4 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Categories
                  </p>
                ) : null}
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base text-foreground transition-colors hover:bg-accent/60"
                  >
                    <FolderOpen
                      className="size-[1.125rem] shrink-0 text-muted-foreground"
                      strokeWidth={THIN_STROKE}
                      aria-hidden
                    />
                    {c.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
