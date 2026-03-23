"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatInrFromPaise } from "@/lib/format-inr";

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function CheckoutForm({
  productSlug,
  title,
  pricePaise,
}: {
  productSlug: string;
  title: string;
  pricePaise: number;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pay = useCallback(async () => {
    setMessage(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage("Enter a valid email.");
      return;
    }
    if (!scriptReady || !window.Razorpay) {
      setMessage("Payment script is still loading. Try again.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, email: trimmed }),
      });
      const data = (await res.json()) as {
        error?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        productName?: string;
      };
      if (!res.ok) {
        setMessage(data.error ?? "Could not start checkout.");
        return;
      }
      const { orderId, amount, currency, keyId } = data;
      if (!orderId || amount == null || !keyId) {
        setMessage("Invalid response from server.");
        return;
      }

      const options: Record<string, unknown> = {
        key: keyId,
        amount,
        currency: currency ?? "INR",
        name: "PrepareUp",
        image: "https://res.cloudinary.com/dxagqdmxy/image/upload/v1774288117/PrepareUp_2_qavdvp.png",
        description: title,
        order_id: orderId,
        prefill: { email: trimmed },
        handler: async (response: RazorpaySuccess) => {
          setBusy(true);
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productSlug,
                email: trimmed,
              }),
            });
            const out = (await v.json()) as { error?: string; downloadToken?: string };
            if (!v.ok || !out.downloadToken) {
              setMessage(out.error ?? "Verification failed. Contact support with your payment id.");
              setBusy(false);
              return;
            }
            router.push(`/order/success?token=${encodeURIComponent(out.downloadToken)}&slug=${encodeURIComponent(productSlug)}`);
          } catch {
            setMessage("Verification request failed.");
            setBusy(false);
          }
        },
        theme: { color: "#3d9a82" },
        modal: { ondismiss: () => setBusy(false) },
      };

      const rzp = new window.Razorpay!(options);
      rzp.open();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }, [email, productSlug, router, scriptReady, title]);

  return (
    <div className="space-y-6">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Amount due</p>
        <p className="font-heading text-2xl tracking-tight">{formatInrFromPaise(pricePaise)}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="border-border"
        />
        <p className="text-xs text-muted-foreground">Used for your receipt and support only. No account is created.</p>
      </div>
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
      <Button
        type="button"
        className="w-full"
        disabled={busy}
        onClick={() => void pay()}
      >
        {busy ? "Please wait…" : "Pay with Razorpay"}
      </Button>
    </div>
  );
}
