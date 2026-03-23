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
    .map(
      (item) =>
        `<li style="margin:0 0 6px"><a href="${item.url}" style="color:#1f5c50;text-decoration:underline">${item.title}</a></li>`,
    )
    .join("");
  return `
    <div style="margin:0;padding:0;background:#f2fbf8;font-family:Arial,sans-serif;color:#163a33">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:24px 0">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" width="620" style="width:620px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #d5f3ea">
              <tr>
                <td style="padding:24px 28px;background:linear-gradient(135deg,#0b0f1a 0%,#10192e 55%,#153a31 100%);color:#ffffff">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="vertical-align:middle">
                        <img src="https://res.cloudinary.com/dxagqdmxy/image/upload/v1774288643/PrepareUp_3_ad5zb8.png" alt="PrepareUp" style="height:108px;width:auto;display:block" />
                      </td>
                      <td align="right" style="font-size:16px;font-weight:700;opacity:0.95">PrepareUp by Exami Labs</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:28px">
                  <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#163a33">Order confirmed</h1>
                  <p style="margin:0 0 18px;color:#365e55;font-size:15px">Your payment was successful for <strong>${input.productTitle}</strong>.</p>
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#effcf6;border:1px solid #cceedd;border-radius:10px;padding:14px">
                    <tr><td style="font-size:14px;color:#163a33"><strong>Amount:</strong> ${amountLabel}</td></tr>
                    <tr><td style="font-size:14px;color:#163a33;padding-top:6px"><strong>Order ID:</strong> ${input.orderId}</td></tr>
                  </table>
                  <div style="padding-top:20px">
                    <a href="${input.downloadUrl}" style="display:inline-block;background:#9deacb;color:#163a33;text-decoration:none;padding:12px 16px;border-radius:8px;font-size:14px;font-weight:700;border:1px solid #7ddfba">
                      Download your PDF
                    </a>
                  </div>
      ${
        input.bundleZipUrl
          ? `<div style="padding-top:10px"><a href="${input.bundleZipUrl}" style="display:inline-block;background:#ffffff;color:#163a33;text-decoration:none;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid #7ddfba">Download full kit (.zip)</a></div>`
          : ""
      }
      ${
        bundleLinksHtml
          ? `<div style="margin-top:12px;background:#f6fffb;border:1px solid #d5f3ea;border-radius:8px;padding:12px"><p style="margin:0 0 8px;color:#365e55;font-size:13px"><strong>Individual PDFs</strong></p><ul style="margin:0;padding-left:18px;font-size:13px;color:#1f5c50">${bundleLinksHtml}</ul></div>`
          : ""
      }
                  <p style="margin:18px 0 6px;color:#4e7168;font-size:13px">If the button does not work, use this link:</p>
                  <p style="margin:0 0 16px;word-break:break-all;font-size:12px"><a href="${input.downloadUrl}" style="color:#1f5c50">${input.downloadUrl}</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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
  const templateAlias = "order-confirmation";

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

  if (!templateId || templateId !== templateAlias) {
    try {
      const aliasResponse = await resend.emails.send({
        from,
        to: input.to,
        replyTo,
        template: {
          id: templateAlias,
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
      if (!aliasResponse.error) {
        return { ok: true, id: aliasResponse.data?.id ?? null };
      }
      console.error("[email] template alias send failed, using branded html fallback", {
        orderId: input.orderId,
        templateAlias,
        error: aliasResponse.error.message,
      });
    } catch (error) {
      console.error("[email] template alias send threw, using branded html fallback", {
        orderId: input.orderId,
        templateAlias,
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
