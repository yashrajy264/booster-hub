import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { signDownloadToken } from "@/lib/download-token";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { orderByPaymentIdQuery, productBySlugPublicQuery } from "@/sanity/queries";
import { getServerSanityClient, getWriteSanityClient } from "@/sanity/server";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    productSlug?: string;
    email?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productSlug, email: emailFromBody } =
    body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !productSlug) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const ok = verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    keySecret,
  );
  if (!ok) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const readClient = getServerSanityClient();
  if (!readClient) {
    return NextResponse.json({ error: "CMS not configured" }, { status: 503 });
  }

  const product = await readClient.fetch(productBySlugPublicQuery, { slug: productSlug.trim() });
  if (!product || product.accessMode !== "paid") {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  const expectedAmount = Math.round(Number(product.pricePaise));
  if (Number(payment.amount) !== expectedAmount) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  const writeClient = getWriteSanityClient();
  if (!writeClient) {
    return NextResponse.json({ error: "CMS write not configured" }, { status: 503 });
  }

  const existing = await readClient.fetch(orderByPaymentIdQuery, {
    paymentId: razorpay_payment_id,
  });

  let orderId: string;
  if (existing?._id) {
    orderId = existing._id;
  } else {
    const notes = payment.notes as Record<string, string> | undefined;
    const email =
      (typeof notes?.email === "string" && notes.email) ||
      (typeof emailFromBody === "string" && emailFromBody.trim()) ||
      "";
    if (!email) {
      return NextResponse.json({ error: "Missing payment metadata" }, { status: 400 });
    }
    const created = await writeClient.create({
      _type: "order",
      email,
      product: { _type: "reference", _ref: product._id },
      amountPaise: expectedAmount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "paid",
      fulfilledAt: new Date().toISOString(),
    });
    orderId = created._id as string;
  }

  const downloadToken = await signDownloadToken({
    orderId,
    productId: product._id,
  });

  return NextResponse.json({ downloadToken, orderId });
}
