import { NextResponse } from "next/server";
import { signDownloadToken } from "@/lib/download-token";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { getServerSanityClient, getWriteSanityClient } from "@/sanity/server";

type ResendBody = {
  orderId?: string;
};

const orderByIdForResendQuery = `
  *[_type == "order" && _id == $orderId][0]{
    _id,
    email,
    status,
    amountPaise,
    "productId": product->_id,
    "productTitle": product->title,
    "productSlug": product->slug.current,
    "deliveryMode": coalesce(product->deliveryMode, "single"),
    "bundleItems": coalesce(product->bundleItems, [])[]{
      title,
      "fullPdfUrl": coalesce(fullPdfFile.asset->url, fullPdfUrl)
    }
  }
`;

export async function POST(request: Request) {
  const expectedKey = process.env.ORDER_RESEND_API_KEY?.trim();
  if (!expectedKey) {
    return NextResponse.json({ error: "ORDER_RESEND_API_KEY is missing" }, { status: 503 });
  }
  const providedKey = request.headers.get("x-order-resend-key")?.trim();
  if (!providedKey || providedKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ResendBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = body.orderId?.trim();
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const readClient = getServerSanityClient();
  const writeClient = getWriteSanityClient();
  if (!readClient || !writeClient) {
    return NextResponse.json({ error: "CMS not configured" }, { status: 503 });
  }

  const order = await readClient.fetch(orderByIdForResendQuery, { orderId });
  if (!order?._id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json({ error: "Only paid orders can be resent" }, { status: 400 });
  }
  if (!order.email || !order.productId || !order.productSlug || !order.productTitle) {
    return NextResponse.json({ error: "Order is missing email/product details" }, { status: 400 });
  }

  const downloadToken = await signDownloadToken({
    orderId: order._id,
    productId: order.productId,
  });
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const downloadUrl = `${baseUrl}/api/download?slug=${encodeURIComponent(order.productSlug)}&token=${encodeURIComponent(downloadToken)}`;
  const bundleItems = Array.isArray(order.bundleItems)
    ? order.bundleItems.filter((entry: { fullPdfUrl?: string }) => Boolean(entry?.fullPdfUrl))
    : [];
  const deliveryMode = order.deliveryMode === "bundle" ? "bundle" : "single";
  const bundleZipUrl =
    deliveryMode === "bundle"
      ? `${baseUrl}/api/download/bundle?slug=${encodeURIComponent(order.productSlug)}&token=${encodeURIComponent(downloadToken)}`
      : undefined;
  const bundleItemLinks =
    deliveryMode === "bundle"
      ? bundleItems.map((item: { title?: string }, index: number) => ({
          title: item.title ?? `PDF ${index + 1}`,
          url: `${baseUrl}/api/download?slug=${encodeURIComponent(order.productSlug)}&token=${encodeURIComponent(downloadToken)}&item=${index}`,
        }))
      : undefined;

  const emailResult = await sendOrderConfirmationEmail({
    to: order.email,
    productTitle: order.productTitle,
    amountPaise: Number(order.amountPaise ?? 0),
    downloadUrl,
    bundleZipUrl,
    bundleItemLinks,
    orderId: order._id,
  });
  if (!emailResult.ok) {
    return NextResponse.json({ error: `Email failed: ${emailResult.error}` }, { status: 502 });
  }

  await writeClient
    .patch(order._id)
    .set({
      confirmationEmailSentAt: new Date().toISOString(),
      confirmationEmailId: emailResult.id ?? undefined,
    })
    .commit();

  return NextResponse.json({
    ok: true,
    orderId: order._id,
    confirmationEmailId: emailResult.id ?? null,
  });
}
