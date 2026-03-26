import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${SITE_NAME} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  const support = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl tracking-tight text-foreground">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg text-foreground">Introduction</h2>
          <p className="mt-2">
            This policy describes how {SITE_NAME} (“we”, “us”) handles personal information when you use our website,
            purchase digital study materials, or contact us. We aim to collect only what we need to operate the service
            and fulfill orders.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Information we collect</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <span className="text-foreground">Contact and order details:</span> such as email address and information
              you provide at checkout (for example, name or phone if required by our payment or delivery flow).
            </li>
            <li>
              <span className="text-foreground">Transaction data:</span> payment status and identifiers from our payment
              provider (we do not store full card numbers on our servers).
            </li>
            <li>
              <span className="text-foreground">Technical data:</span> standard server and analytics information such as
              IP address, browser type, device type, and pages visited, where enabled.
            </li>
            <li>
              <span className="text-foreground">Communications:</span> content of emails or messages you send to support.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">How we use information</h2>
          <p className="mt-2">We use personal information to:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Process payments and deliver digital products (e.g. download links and order emails).</li>
            <li>Provide customer support and respond to requests.</li>
            <li>Detect and prevent fraud, abuse, or illegal activity.</li>
            <li>Improve the site and understand aggregate usage, where permitted.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Legal bases (where applicable)</h2>
          <p className="mt-2">
            Depending on your region, we may rely on performance of a contract (processing your order), legitimate
            interests (security and service improvement, balanced against your rights), or consent where required (for
            example, certain cookies or marketing, if offered).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Cookies and similar technologies</h2>
          <p className="mt-2">
            We may use cookies or local storage as needed for site functionality, preferences, analytics, or fraud
            prevention. You can control cookies through your browser settings; disabling some cookies may limit certain
            features.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Third-party services</h2>
          <p className="mt-2">
            We use service providers to host the site, process payments, send email, and similar functions. Those
            providers process information on our behalf under contractual safeguards. Their use of data is governed by
            their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Retention</h2>
          <p className="mt-2">
            We retain information only as long as needed for the purposes above, including legal, tax, and accounting
            requirements. Order and billing records may be kept for a defined period consistent with applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Security</h2>
          <p className="mt-2">
            We use reasonable technical and organizational measures to protect personal information. No method of
            transmission or storage is completely secure; we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Your rights</h2>
          <p className="mt-2">
            Depending on where you live, you may have rights to access, correct, delete, or restrict processing of your
            personal information, or to object to certain processing. To exercise these rights, contact us using the
            details below. You may also have the right to lodge a complaint with a supervisory authority.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Children</h2>
          <p className="mt-2">
            Our services are not directed at children under the age required by applicable law. We do not knowingly
            collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">International transfers</h2>
          <p className="mt-2">
            If we transfer personal information across borders, we do so with appropriate safeguards as required by
            applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Changes to this policy</h2>
          <p className="mt-2">
            We may update this policy from time to time. The “Last updated” date at the top will change when we do.
            Continued use of the site after changes constitutes acceptance of the updated policy where permitted by law.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg text-foreground">Contact</h2>
          <p className="mt-2">
            For privacy questions or requests, contact us at{" "}
            {support ? (
              <a href={`mailto:${support}`} className="text-foreground underline underline-offset-2">
                {support}
              </a>
            ) : (
              <>
                the support email shown on our site once{" "}
                <code className="font-mono text-xs text-foreground">NEXT_PUBLIC_SUPPORT_EMAIL</code> is configured.
              </>
            )}
            .
          </p>
        </section>
      </div>
    </div>
  );
}
