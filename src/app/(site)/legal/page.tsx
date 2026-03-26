import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal & support",
  description: `Terms, refunds, delivery, and contact for ${SITE_NAME}.`,
};

export default function LegalPage() {
  const support = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl tracking-tight text-foreground">Legal & support</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        These terms apply to your use of {SITE_NAME} and purchases of digital products. For how we handle personal data,
        see our{" "}
        <Link href="/privacy" className="text-foreground underline underline-offset-2">
          Privacy policy
        </Link>
        .
      </p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg text-foreground">Agreement</h2>
          <p className="mt-2">
            By accessing or using this website, you agree to these terms. If you do not agree, do not use the site. We
            may update these terms; continued use after changes constitutes acceptance where permitted by law.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Products and license</h2>
          <p className="mt-2">
            {SITE_NAME} offers digital study materials (e.g. PDF packs). Unless stated otherwise on the product page,
            purchase grants you a personal, non-exclusive, non-transferable license to download and use the files for your
            own study. You may not redistribute, resell, publicly share, or use the materials to compete with our
            business. Free items are subject to the same restrictions unless we specify otherwise.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Delivery</h2>
          <p className="mt-2">
            Digital PDFs are delivered electronically. After successful payment, download access is provided on the order
            flow and/or by email. Free items are available from the product page without payment. Delivery is considered
            complete when the file is made available for download.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Pricing and taxes</h2>
          <p className="mt-2">
            Prices are shown on product and checkout pages and may change. Applicable taxes or fees depend on your
            location and our payment provider’s rules. You are responsible for any taxes required by law in your
            jurisdiction unless we state otherwise.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Payments</h2>
          <p className="mt-2">
            Payments are processed by third-party providers. You authorize us and our payment partners to charge your
            chosen payment method for the total amount shown at checkout. If a payment fails or is reversed, access to
            paid content may be withheld until resolved.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Refunds and chargebacks</h2>
          <p className="mt-2">
            Because products are digital, all sales are generally final once the file has been made available or
            downloaded. We may make exceptions where required by law or where there was a billing error, duplicate
            charge, or you cannot access the file after payment despite contacting support. To request help, email us with
            your order or payment reference (e.g. Razorpay payment id).
          </p>
          <p className="mt-3">
            Initiating a chargeback or payment dispute without first contacting us may result in suspension of access
            while the dispute is investigated.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Disclaimer</h2>
          <p className="mt-2">
            Materials are provided for educational preparation. We do not guarantee exam results or that content will
            match every syllabus change. To the maximum extent permitted by law, the site and products are provided “as
            is” without warranties of any kind, express or implied.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Limitation of liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by applicable law, {SITE_NAME} and its operators shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or
            goodwill, arising from your use of the site or products. Our total liability for any claim relating to a
            purchase is generally limited to the amount you paid for that purchase.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Acceptable use</h2>
          <p className="mt-2">
            You agree not to misuse the site: no unlawful activity, no attempt to disrupt or gain unauthorized access,
            no scraping or automated access that overloads our systems, and no violation of others’ rights. We may suspend
            or terminate access for violations.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Intellectual property</h2>
          <p className="mt-2">
            The site, branding, and content we provide are protected by intellectual property laws. Except for the
            limited license to downloaded materials as described above, no rights are granted to you.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws applicable in India, without regard to conflict-of-law rules, unless
            mandatory consumer protections in your country require otherwise.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Contact</h2>
          <p className="mt-2">
            {support ? (
              <>
                Email:{" "}
                <a href={`mailto:${support}`} className="text-foreground underline underline-offset-2">
                  {support}
                </a>
              </>
            ) : (
              <>
                Set <code className="font-mono text-foreground">NEXT_PUBLIC_SUPPORT_EMAIL</code> in your environment to
                show a public support address.
              </>
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
