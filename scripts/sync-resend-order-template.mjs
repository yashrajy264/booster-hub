import { Resend } from "resend";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM;

if (!apiKey) {
  throw new Error("Missing RESEND_API_KEY");
}

if (!from) {
  throw new Error("Missing EMAIL_FROM");
}

const resend = new Resend(apiKey);
const alias = "order-confirmation";
const payload = {
  name: "order-confirmation",
  alias,
  from,
  subject: "Order confirmed: {{{PRODUCT}}}",
  html: `
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
                      <img src="https://res.cloudinary.com/dxagqdmxy/image/upload/v1774288643/PrepareUp_3_ad5zb8.png" alt="PrepUp" style="height:108px;width:auto;display:block" />
                    </td>
                    <td align="right" style="font-size:16px;font-weight:700;opacity:0.95">PrepUp by Exami Labs India</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px">
                <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#163a33">Order Confirmed</h1>
                <p style="margin:0 0 18px;color:#365e55;font-size:15px">Your payment was successful. Your PrepareUp PDF is ready to download.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#effcf6;border:1px solid #cceedd;border-radius:10px;padding:14px">
                  <tr><td style="font-size:14px;color:#163a33"><strong>Product:</strong> {{{PRODUCT}}}</td></tr>
                  <tr><td style="font-size:14px;color:#163a33;padding-top:6px"><strong>Amount:</strong> {{{PRICE}}}</td></tr>
                  <tr><td style="font-size:14px;color:#163a33;padding-top:6px"><strong>Order ID:</strong> {{{ORDER_ID}}}</td></tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:14px;background:#ffffff;border:1px dashed #b8e6d5;border-radius:10px;padding:14px">
                  <tr><td style="font-size:14px;color:#163a33"><strong>Invoice No:</strong> {{{INVOICE_ID}}}</td></tr>
                  <tr><td style="font-size:14px;color:#163a33;padding-top:6px"><strong>Invoice Date:</strong> {{{INVOICE_DATE}}}</td></tr>
                </table>
                <div style="padding-top:20px">
                  <a href="{{{DOWNLOAD_URL}}}" style="display:inline-block;background:#9deacb;color:#163a33;text-decoration:none;padding:12px 16px;border-radius:8px;font-size:14px;font-weight:700;border:1px solid #7ddfba">
                    Download your PDF
                  </a>
                </div>
                {{#if BUNDLE_ZIP_URL}}
                <div style="padding-top:10px">
                  <a href="{{{BUNDLE_ZIP_URL}}}" style="display:inline-block;background:#ffffff;color:#163a33;text-decoration:none;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid #7ddfba">
                    Download full kit (.zip)
                  </a>
                </div>
                {{/if}}
                {{#if BUNDLE_LINKS_HTML}}
                <div style="margin-top:12px;background:#f6fffb;border:1px solid #d5f3ea;border-radius:8px;padding:12px">
                  <p style="margin:0 0 8px;color:#365e55;font-size:13px"><strong>Individual PDFs:</strong></p>
                  <ul style="margin:0;padding-left:18px;font-size:13px;color:#1f5c50">
                    {{{BUNDLE_LINKS_HTML}}}
                  </ul>
                </div>
                {{/if}}
                <p style="margin:18px 0 6px;color:#4e7168;font-size:13px">If the button does not work, use this link:</p>
                <p style="margin:0 0 16px;word-break:break-all;font-size:12px"><a href="{{{DOWNLOAD_URL}}}" style="color:#1f5c50">{{{DOWNLOAD_URL}}}</a></p>
                <p style="margin:0;color:#4e7168;font-size:13px">Need help? Contact us at <a href="mailto:{{{SUPPORT_EMAIL}}}" style="color:#1f5c50">{{{SUPPORT_EMAIL}}}</a>.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `,
  variables: [
    { key: "BRAND", type: "string", fallbackValue: "PrepareUp" },
    { key: "COMPANY", type: "string", fallbackValue: "Exami Labs India" },
    { key: "PRODUCT", type: "string", fallbackValue: "PDF Pack" },
    { key: "PRICE", type: "string", fallbackValue: "INR 0.00" },
    { key: "ORDER_ID", type: "string", fallbackValue: "ORDER_ID" },
    { key: "INVOICE_ID", type: "string", fallbackValue: "INV-ORDER_ID" },
    { key: "INVOICE_DATE", type: "string", fallbackValue: "1970-01-01" },
    { key: "DOWNLOAD_URL", type: "string", fallbackValue: "https://example.com/download" },
    { key: "BUNDLE_ZIP_URL", type: "string", fallbackValue: "" },
    { key: "BUNDLE_LINKS_HTML", type: "string", fallbackValue: "" },
    { key: "SUPPORT_EMAIL", type: "string", fallbackValue: "support@example.com" },
    { key: "LOGO_URL", type: "string", fallbackValue: "https://res.cloudinary.com/dxagqdmxy/image/upload/v1774288643/PrepareUp_3_ad5zb8.png" },
  ],
};

const list = await resend.templates.list();
if (list.error) {
  throw new Error(`Could not list templates: ${list.error.message}`);
}

const existing = list.data?.data?.find((template) => template.alias === alias);

if (existing) {
  const update = await resend.templates.update(existing.id, payload);
  if (update.error) {
    throw new Error(`Could not update template: ${update.error.message}`);
  }
  const publish = await resend.templates.publish(existing.id);
  if (publish.error) {
    throw new Error(`Could not publish template: ${publish.error.message}`);
  }
  console.log(`Updated and published template. ID: ${existing.id}`);
  console.log(`Set RESEND_ORDER_TEMPLATE_ID=${existing.id}`);
} else {
  const created = await resend.templates.create(payload);
  if (created.error) {
    throw new Error(`Could not create template: ${created.error.message}`);
  }
  const templateId = created.data.id;
  const publish = await resend.templates.publish(templateId);
  if (publish.error) {
    throw new Error(`Could not publish template: ${publish.error.message}`);
  }
  console.log(`Created and published template. ID: ${templateId}`);
  console.log(`Set RESEND_ORDER_TEMPLATE_ID=${templateId}`);
}
