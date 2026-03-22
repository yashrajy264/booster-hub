import { NextResponse } from "next/server";

import { productsSearchQuery } from "@/sanity/queries";
import { getPublicSanityClient } from "@/sanity/client";

function toMatchPattern(q: string): string {
  const t = q.trim().toLowerCase();
  if (!t) return "*";
  const safe = t.replace(/[*"]/g, " ").replace(/\s+/g, " ").trim();
  if (!safe) return "*";
  const parts = safe.split(" ").filter(Boolean);
  if (parts.length === 0) return "*";
  return `*${parts.join("*")}*`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("q")?.trim() ?? "";
  if (raw.length < 2) {
    return NextResponse.json({ results: [] satisfies unknown[] });
  }

  const client = getPublicSanityClient();
  if (!client) {
    return NextResponse.json({ error: "CMS not configured" }, { status: 503 });
  }

  const pattern = toMatchPattern(raw);
  try {
    const results = await client.fetch(productsSearchQuery, { pattern });
    return NextResponse.json({ results: results ?? [] });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
