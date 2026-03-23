import JSZip from "jszip";
import { NextResponse } from "next/server";
import { consumeDownloadAllowance } from "@/lib/download-limits";
import { verifyDownloadToken } from "@/lib/download-token";
import { productBySlugFullQuery } from "@/sanity/queries";
import { getServerSanityClient } from "@/sanity/server";

type BundleItem = {
  title?: string;
  fullPdfUrl?: string;
};

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
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (product.deliveryMode !== "bundle") {
    return NextResponse.json({ error: "This product is not a bundle" }, { status: 400 });
  }

  if (product.accessMode === "paid") {
    const auth = await authorizePaidDownload({
      client,
      token,
      productId: product._id,
    });
    if ("error" in auth) return auth.error;
    const consume = await consumeDownloadAllowance({
      orderId: auth.claims.orderId,
      productId: auth.claims.productId,
    });
    if (!consume.ok) {
      return NextResponse.json({ error: consume.error }, { status: consume.status });
    }
  }

  const bundleItems = Array.isArray(product.bundleItems)
    ? product.bundleItems.filter((entry: BundleItem) => Boolean(entry?.fullPdfUrl))
    : [];
  if (bundleItems.length === 0) {
    return NextResponse.json({ error: "Bundle items not found" }, { status: 404 });
  }

  const zip = new JSZip();
  for (let i = 0; i < bundleItems.length; i += 1) {
    const item = bundleItems[i];
    const url = item?.fullPdfUrl;
    if (!url) continue;
    const upstream = await fetch(url, { next: { revalidate: 0 } });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Could not fetch bundle item ${i + 1}` },
        { status: 502 },
      );
    }
    const buffer = await upstream.arrayBuffer();
    const base = sanitizeFilename(item?.title || `bundle-item-${i + 1}`);
    zip.file(`${String(i + 1).padStart(2, "0")}-${base}.pdf`, buffer);
  }

  const bundleBuffer = await zip.generateAsync({ type: "arraybuffer", compression: "DEFLATE" });
  const safe = sanitizeFilename(product.slug ?? slug) || "bundle";
  return new NextResponse(bundleBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safe}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]/g, "_");
}

async function authorizePaidDownload({
  client,
  token,
  productId,
}: {
  client: NonNullable<ReturnType<typeof getServerSanityClient>>;
  token: string | undefined;
  productId: string;
}) {
  if (!token) return { error: NextResponse.json({ error: "Payment required" }, { status: 402 }) };
  let claims;
  try {
    claims = await verifyDownloadToken(token);
  } catch {
    return { error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }) };
  }
  if (claims.productId !== productId) {
    return { error: NextResponse.json({ error: "Token does not match product" }, { status: 403 }) };
  }
  const order = await client.fetch(
    `*[_type == "order" && _id == $orderId && status == "paid" && product._ref == $productId][0]{ _id }`,
    { orderId: claims.orderId, productId: claims.productId },
  );
  if (!order) {
    return { error: NextResponse.json({ error: "Order not found or unpaid" }, { status: 403 }) };
  }
  return { claims };
}
