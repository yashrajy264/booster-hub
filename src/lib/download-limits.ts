import { getWriteSanityClient } from "@/sanity/server";

type ConsumeDownloadResult =
  | { ok: true; remaining: number }
  | { ok: false; status: number; error: string };

const DEFAULT_MAX_DOWNLOADS = 2;

export function getMaxDownloadsPerOrder(): number {
  const raw = Number.parseInt(process.env.DOWNLOAD_MAX_DOWNLOADS ?? "", 10);
  if (raw === 1 || raw === 2) return raw;
  return DEFAULT_MAX_DOWNLOADS;
}

export async function consumeDownloadAllowance({
  orderId,
  productId,
}: {
  orderId: string;
  productId: string;
}): Promise<ConsumeDownloadResult> {
  const writeClient = getWriteSanityClient();
  if (!writeClient) {
    return { ok: false, status: 503, error: "CMS write not configured" };
  }

  const maxDownloads = getMaxDownloadsPerOrder();
  const now = new Date().toISOString();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const order = await writeClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        _rev,
        status,
        "productId": product._ref,
        downloadCount
      }`,
      { orderId },
    );

    if (!order?._id || typeof order._rev !== "string") {
      return { ok: false, status: 403, error: "Order not found or unpaid" };
    }
    if (order.status !== "paid") {
      return { ok: false, status: 403, error: "Order not found or unpaid" };
    }
    if (order.productId !== productId) {
      return { ok: false, status: 403, error: "Token does not match product" };
    }

    const currentCount = Math.max(0, Number(order.downloadCount ?? 0));
    if (currentCount >= maxDownloads) {
      return {
        ok: false,
        status: 429,
        error: "Download limit reached for this link. Contact support for a fresh link.",
      };
    }

    try {
      await writeClient
        .patch(orderId)
        .ifRevisionId(order._rev)
        .set({
          downloadCount: currentCount + 1,
          lastDownloadedAt: now,
        })
        .commit();
      return { ok: true, remaining: Math.max(0, maxDownloads - (currentCount + 1)) };
    } catch {
      // Retry on optimistic concurrency conflict.
    }
  }

  return { ok: false, status: 409, error: "Please retry download." };
}
