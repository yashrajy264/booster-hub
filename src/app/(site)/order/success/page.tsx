import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ token?: string; slug?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { token, slug } = await searchParams;
  if (!token || !slug) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="font-heading text-2xl tracking-tight">Order</h1>
        <p className="mt-4 text-muted-foreground">
          Missing download token. If you completed a payment, check your email or contact support with
          your Razorpay payment id.
        </p>
        <Link
          href="/browse"
          className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
        >
          Browse PDFs
        </Link>
      </div>
    );
  }

  const href = `/api/download?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}`;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-heading text-2xl tracking-tight">Payment successful</h1>
      <p className="mt-4 text-muted-foreground">
        Your download is ready. The link expires in about 30 minutes for security.
      </p>
      <div className="mt-10 flex flex-col gap-3">
        <a href={href} className={cn(buttonVariants())}>
          Download full PDF
        </a>
        <Link
          href={`/p/${slug}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to product
        </Link>
      </div>
    </div>
  );
}
