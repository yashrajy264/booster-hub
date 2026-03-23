import { NextResponse } from "next/server";

import { clipPdfToRange, parsePreviewRange } from "@/lib/pdf-preview";
import { productBySlugPreviewQuery } from "@/sanity/queries";
import { getServerSanityClient } from "@/sanity/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const client = getServerSanityClient();
  if (!client) {
    return NextResponse.json({ error: "CMS not configured" }, { status: 503 });
  }

  const product = await client.fetch(productBySlugPreviewQuery, { slug });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (product.manualPreviewPdfUrl) {
    return proxyPreviewPdf(product.manualPreviewPdfUrl, `${product.slug ?? slug}-preview`);
  }

  if (!product.fullPdfUrl) {
    return NextResponse.json({ error: "Full PDF not available" }, { status: 404 });
  }

  const range = parsePreviewRange(product.previewStartPage, product.previewEndPage);
  if (!range) {
    return NextResponse.json({ error: "Preview range is missing or invalid" }, { status: 400 });
  }

  const upstream = await fetch(product.fullPdfUrl, { next: { revalidate: 0 } });
  if (!upstream.ok) {
    return NextResponse.json({ error: "Could not fetch full PDF" }, { status: 502 });
  }

  const fullPdf = await upstream.arrayBuffer();
  let clipped: Uint8Array;
  try {
    clipped = await clipPdfToRange(fullPdf, range);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid preview range" },
      { status: 400 },
    );
  }

  const safe = (product.slug ?? slug).replace(/[^a-zA-Z0-9-_]/g, "_") || "document";
  const clippedBuffer = new ArrayBuffer(clipped.byteLength);
  new Uint8Array(clippedBuffer).set(clipped);
  return new NextResponse(clippedBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${safe}-preview.pdf"`,
      "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}

async function proxyPreviewPdf(url: string, filenameBase: string) {
  const upstream = await fetch(url, { next: { revalidate: 0 } });
  if (!upstream.ok) {
    return NextResponse.json({ error: "Could not fetch preview PDF" }, { status: 502 });
  }
  const buf = await upstream.arrayBuffer();
  const safe = filenameBase.replace(/[^a-zA-Z0-9-_]/g, "_") || "document";
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${safe}.pdf"`,
      "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
