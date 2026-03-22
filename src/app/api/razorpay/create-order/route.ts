import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { productBySlugPublicQuery } from "@/sanity/queries";
import { getServerSanityClient } from "@/sanity/server";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  let body: { productSlug?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const productSlug = body.productSlug?.trim();
  const email = body.email?.trim();
  if (!productSlug || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid product slug and email required" }, { status: 400 });
  }

  const client = getServerSanityClient();
  if (!client) {
    return NextResponse.json({ error: "CMS not configured" }, { status: 503 });
  }

  const product = await client.fetch(productBySlugPublicQuery, { slug: productSlug });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (product.accessMode !== "paid") {
    return NextResponse.json({ error: "Product is not a paid purchase" }, { status: 400 });
  }

  const amountPaise = Math.round(Number(product.pricePaise));
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    return NextResponse.json({ error: "Invalid product price" }, { status: 400 });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const receipt = `bh_${Date.now()}`.slice(0, 40);
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes: {
      productId: String(product._id),
      productSlug: String(productSlug),
      email: String(email),
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
    productName: product.title,
  });
}
