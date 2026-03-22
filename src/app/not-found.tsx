import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 sm:px-6">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 font-heading text-2xl tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        That page does not exist or the catalog has not been published yet.
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-8 inline-flex rounded-none")}>
        Back home
      </Link>
    </div>
  );
}
