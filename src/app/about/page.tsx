import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Target, Users, Zap } from "lucide-react";

import { buttonVariants } from "@/lib/button-variants";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE_NAME} is and how we help students prepare with affordable PDF study packs.`,
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0">
          <Image
            src="/about-hero.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">About us</p>
          <h1 className="mt-3 max-w-2xl font-heading text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
            Study materials that respect your time and budget
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {SITE_NAME} lists focused PDF packs for government jobs and competitive exams — so you can
            preview, pay once, and download without friction.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/browse" className={cn(buttonVariants({ size: "lg" }), "px-6")}>
              Browse catalog
            </Link>
            <Link
              href="/legal"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}
            >
              Policies & support
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-2xl text-foreground">Why we built {SITE_NAME}</h2>
          <p>
            Exam prep shouldn’t mean hunting scattered PDFs or overpaying for bloated bundles. We built
            this storefront to put <strong className="font-medium text-foreground">clear previews</strong>,{" "}
            <strong className="font-medium text-foreground">simple checkout</strong>, and{" "}
            <strong className="font-medium text-foreground">instant delivery</strong> in one place —
            whether you’re revising current affairs or drilling MCQs the night before.
          </p>
          <p>
            Content is managed in our CMS: categories, exams, cover art, and PDFs stay organized so
            the site stays fast to browse and easy to trust.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-3">
          <li className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Target className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-heading text-lg text-foreground">Focused packs</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Materials aimed at real exam formats — not generic filler.
            </p>
          </li>
          <li className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Zap className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-heading text-lg text-foreground">Pay once</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Razorpay checkout; free items download straight away.
            </p>
          </li>
          <li className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Users className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-heading text-lg text-foreground">Built for students</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No forced accounts — just email at checkout when you buy.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
