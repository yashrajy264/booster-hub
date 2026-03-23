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

function buildFallbackHtml(input: ConfirmationEmailInput, amountLabel: string): string {
  const bundleLinksHtml = (input.bundleItemLinks ?? [])
    .map((item) => `<li><a href="${item.url}">${item.title}</a></li>`)
    .join("");
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2 style="margin:0 0 12px">Order confirmed</h2>
      <p style="margin:0 0 12px">Your payment was successful for <strong>${input.productTitle}</strong>.</p>
      <p style="margin:0 0 6px"><strong>Amount:</strong> ${amountLabel}</p>
      <p style="margin:0 0 16px"><strong>Order ID:</strong> ${input.orderId}</p>
      <p style="margin:0 0 8px"><a href="${input.downloadUrl}">Download your PDF</a></p>
      ${
        input.bundleZipUrl
          ? `<p style="margin:0 0 8px"><a href="${input.bundleZipUrl}">Download full kit (.zip)</a></p>`
          : ""
      }
      ${
        bundleLinksHtml
          ? `<div style="margin-top:8px"><p style="margin:0 0 6px"><strong>Individual PDFs</strong></p><ul style="margin:0;padding-left:18px">${bundleLinksHtml}</ul></div>`
          : ""
      }
    </div>
  `;
}

function buildFallbackText(input: ConfirmationEmailInput, amountLabel: string): string {
  const bundleLinks = (input.bundleItemLinks ?? []).map((item) => `- ${item.title}: ${item.url}`).join("\n");
  return [
    "Order confirmed",
    "",
    `Product: ${input.productTitle}`,
    `Amount: ${amountLabel}`,
    `Order ID: ${input.orderId}`,
    "",
    `Download: ${input.downloadUrl}`,
    input.bundleZipUrl ? `Download full kit (.zip): ${input.bundleZipUrl}` : "",
    bundleLinks ? ["", "Individual PDFs:", bundleLinks].join("\n") : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendOrderConfirmationEmail(
  input: ConfirmationEmailInput,
): Promise<SendEmailResult> {
  const from = process.env.EMAIL_FROM?.trim();
  if (!from) {
    return { ok: false, error: "Missing EMAIL_FROM" };
  }

  const templateId = process.env.RESEND_ORDER_TEMPLATE_ID?.trim() || null;

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

  if (templateId) {
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
      if (!response.error) {
        return { ok: true, id: response.data?.id ?? null };
      }
      console.error("[email] template send failed, falling back", {
        orderId: input.orderId,
        templateId,
        error: response.error.message,
      });
    } catch (error) {
      console.error("[email] template send threw, falling back", {
        orderId: input.orderId,
        templateId,
        error: error instanceof Error ? error.message : "unknown error",
      });
    }
  }

  try {
    const fallback = await resend.emails.send({
      from,
      to: input.to,
      replyTo,
      subject: `Order confirmed: ${input.productTitle}`,
      text: buildFallbackText(input, amountLabel),
      html: buildFallbackHtml(input, amountLabel),
    });
    if (fallback.error) {
      return { ok: false, error: fallback.error.message || "Resend API error" };
    }
    return { ok: true, id: fallback.data?.id ?? null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email send error",
    };
  }
}
