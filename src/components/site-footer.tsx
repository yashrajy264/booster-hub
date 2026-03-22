import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border" data-site-footer>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. Study PDFs for government and competitive exams.
        </p>
        <nav className="flex flex-wrap gap-6 text-sm" aria-label="Footer">
          <Link href="/browse" className="text-muted-foreground transition-colors hover:text-foreground">
            Browse
          </Link>
          <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/legal" className="text-muted-foreground transition-colors hover:text-foreground">
            Legal
          </Link>
        </nav>
      </div>
    </footer>
  );
}
