import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal & support",
  description: `Refund policy, contact, and terms for ${SITE_NAME}.`,
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl tracking-tight">Legal & support</h1>
      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg text-foreground">Delivery</h2>
          <p className="mt-2">
            Digital PDFs are delivered instantly after successful payment. Free items are available
            for download immediately from the product page.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">Refunds</h2>
          <p className="mt-2">
            Because products are digital, all sales are generally final once the file has been made
            available or downloaded. If you were charged incorrectly or cannot access a file after
            payment, contact support with your Razorpay payment id and we will help.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">Privacy</h2>
          <p className="mt-2">
            We collect only what is needed to process your order (such as email at checkout) and
            operate the site. We do not require an account or password.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">Contact</h2>
          <p className="mt-2">
            {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ? (
              <>
                Email:{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                  className="text-foreground underline"
                >
                  {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
                </a>
              </>
            ) : (
              <>
                Set <code className="font-mono text-foreground">NEXT_PUBLIC_SUPPORT_EMAIL</code> in
                your environment to show a public support address.
              </>
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
