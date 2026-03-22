import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { orderByPaymentIdQuery, productByIdFullQuery } from "@/sanity/queries";
import { getServerSanityClient, getWriteSanityClient } from "@/sanity/server";

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!webhookSecret || !keyId || !keySecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  const rawBody = await request.text();

  if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let body: { event?: string; payload?: { payment?: { entity?: Record<string, unknown> } } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  if (event !== "payment.captured") {
    return NextResponse.json({ received: true, ignored: event });
  }

  const paymentEntity = body.payload?.payment?.entity as
    | {
        id?: string;
        order_id?: string;
        amount?: number;
        notes?: { email?: string; productId?: string };
      }
    | undefined;

  if (!paymentEntity?.id || !paymentEntity.order_id) {
    return NextResponse.json({ received: true, ignored: "missing payment" });
  }

  const readClient = getServerSanityClient();
  const writeClient = getWriteSanityClient();
  if (!readClient || !writeClient) {
    return NextResponse.json({ error: "CMS not configured" }, { status: 503 });
  }

  const existing = await readClient.fetch(orderByPaymentIdQuery, {
    paymentId: paymentEntity.id,
  });
  if (existing?._id) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const productId = paymentEntity.notes?.productId;
  const email = paymentEntity.notes?.email;
  if (!productId || !email) {
    return NextResponse.json({ received: true, ignored: "missing notes" });
  }

  const product = await readClient.fetch(productByIdFullQuery, { id: productId });
  if (!product || product.accessMode !== "paid") {
    return NextResponse.json({ received: true, ignored: "bad product" });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const payment = await razorpay.payments.fetch(paymentEntity.id);
  const expectedAmount = Math.round(Number(product.pricePaise));
  if (Number(payment.amount) !== expectedAmount) {
    return NextResponse.json({ received: true, ignored: "amount mismatch" });
  }

  await writeClient.create({
    _type: "order",
    email,
    product: { _type: "reference", _ref: product._id },
    amountPaise: expectedAmount,
    razorpayOrderId: paymentEntity.order_id,
    razorpayPaymentId: paymentEntity.id,
    status: "paid",
    fulfilledAt: new Date().toISOString(),
  });

  return NextResponse.json({ received: true });
}
