import { Resend } from "resend";

type ConfirmationEmailInput = {
  to: string;
  productTitle: string;
  amountPaise: number;
  downloadUrl: string;
  bundleZipUrl?: string;
  bundleItemLinks?: Array<{ title: string; url: string }>;
  orderId: string;
};

type SendEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

function formatInrFromPaise(amountPaise: number): string {
  const inr = Math.max(0, Number(amountPaise || 0)) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(inr);
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendOrderConfirmationEmail(
  input: ConfirmationEmailInput,
): Promise<SendEmailResult> {
  const from = process.env.EMAIL_FROM?.trim();
  if (!from) {
    return { ok: false, error: "Missing EMAIL_FROM" };
  }

  const templateId = process.env.RESEND_ORDER_TEMPLATE_ID?.trim();
  if (!templateId) {
    return { ok: false, error: "Missing RESEND_ORDER_TEMPLATE_ID" };
  }

  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "Missing RESEND_API_KEY" };
  }

  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || process.env.EMAIL_REPLY_TO?.trim() || "";
  const replyTo = process.env.EMAIL_REPLY_TO?.trim() || undefined;
  const amountLabel = formatInrFromPaise(input.amountPaise);
  const invoiceDate = new Date().toISOString().slice(0, 10);
  const invoiceId = `INV-${input.orderId}`;
  const bundleLinksHtml = (input.bundleItemLinks ?? [])
    .map(
      (item) =>
        `<li style="margin:0 0 6px"><a href="${item.url}" style="color:#1f5c50;text-decoration:underline">${item.title}</a></li>`,
    )
    .join("");

  try {
    const response = await resend.emails.send({
      from,
      to: input.to,
      replyTo,
      template: {
        id: templateId,
        variables: {
          BRAND: "PrepareUp",
          COMPANY: "Exami Labs India",
          PRODUCT: input.productTitle,
          PRICE: amountLabel,
          ORDER_ID: input.orderId,
          INVOICE_ID: invoiceId,
          INVOICE_DATE: invoiceDate,
          DOWNLOAD_URL: input.downloadUrl,
          BUNDLE_ZIP_URL: input.bundleZipUrl || "",
          BUNDLE_LINKS_HTML: bundleLinksHtml,
          SUPPORT_EMAIL: supportEmail || "support@exami.co.in",
        },
      },
    });
    if (response.error) {
      return { ok: false, error: response.error.message || "Resend API error" };
    }
    return { ok: true, id: response.data?.id ?? null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email send error",
    };
  }
}
