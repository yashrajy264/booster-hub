import { NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/download-token";
import { productBySlugFullQuery } from "@/sanity/queries";
import { getServerSanityClient } from "@/sanity/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const token = searchParams.get("token")?.trim();

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const client = getServerSanityClient();
  if (!client) {
    return NextResponse.json({ error: "CMS not configured" }, { status: 503 });
  }

  const product = await client.fetch(productBySlugFullQuery, { slug });
  if (!product?.fullPdfUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (product.accessMode === "free") {
    return proxyPdf(product.fullPdfUrl, product.slug ?? slug);
  }

  if (!token) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  let claims;
  try {
    claims = await verifyDownloadToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  if (claims.productId !== product._id) {
    return NextResponse.json({ error: "Token does not match product" }, { status: 403 });
  }

  const order = await client.fetch(
    `*[_type == "order" && _id == $orderId && status == "paid" && product._ref == $productId][0]{ _id }`,
    { orderId: claims.orderId, productId: claims.productId },
  );
  if (!order) {
    return NextResponse.json({ error: "Order not found or unpaid" }, { status: 403 });
  }

  return proxyPdf(product.fullPdfUrl, product.slug ?? slug);
}

async function proxyPdf(url: string, filenameBase: string) {
  const upstream = await fetch(url, { next: { revalidate: 0 } });
  if (!upstream.ok) {
    return NextResponse.json({ error: "Could not fetch PDF" }, { status: 502 });
  }
  const buf = await upstream.arrayBuffer();
  const safe = filenameBase.replace(/[^a-zA-Z0-9-_]/g, "_") || "document";
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safe}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
