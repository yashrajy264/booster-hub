"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "How do I access a PDF after purchase?",
    a: "After payment succeeds, you can download the pack from the order confirmation page and from the email we send. Free packs are available to download directly from the product page.",
  },
  {
    q: "Do I need an account?",
    a: "No account is required. Checkout uses your email for delivery and support. You will receive download links by email when applicable.",
  },
  {
    q: "What is your refund policy?",
    a: "Digital products are generally non-refundable once files are available or downloaded. If you were charged incorrectly or cannot access a file after payment, contact support with your payment reference and we will help.",
  },
  {
    q: "What payment methods do you support?",
    a: "Payments are processed securely. Supported methods depend on our payment provider at checkout (e.g. cards, UPI where available).",
  },
];

export function LandingFaq() {
  return (
    <section className="mx-auto mt-24 max-w-2xl px-4 sm:mt-28 sm:px-6">
      <h2 className="text-center font-heading text-2xl tracking-tight text-foreground sm:text-3xl">
        Frequently asked questions
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-[15px] leading-relaxed text-muted-foreground">
        Quick answers about downloads, checkout, and support.
      </p>
      <Accordion className="mt-10 w-full border-t border-border">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-border">
            <AccordionTrigger className="py-4 text-left text-[15px] font-medium text-foreground hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
