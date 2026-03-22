import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BoosterHub. Study PDFs for government and competitive exams.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/legal" className="text-muted-foreground hover:text-foreground">
            Legal
          </Link>
          <span className="text-muted-foreground">
            CMS: <code className="font-mono text-xs text-foreground">npm run studio</code>
          </span>
        </div>
      </div>
    </footer>
  );
}
