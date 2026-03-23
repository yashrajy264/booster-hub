"use client";

import { useState } from "react";
import type { DocumentActionComponent } from "sanity";

export const ResendOrderEmailAction: DocumentActionComponent = (props) => {
  const [busy, setBusy] = useState(false);
  const orderId = props.published?._id || props.draft?._id || props.id;
  const status = props.published?.status || props.draft?.status;
  const email = props.published?.email || props.draft?.email;
  const isPaid = status === "paid";
  const hasEmail = typeof email === "string" && email.trim().length > 0;

  return {
    label: busy ? "Resending..." : "Resend confirmation email",
    disabled: busy || !isPaid || !hasEmail,
    title: !isPaid ? "Only paid orders can be resent" : !hasEmail ? "Customer email is missing" : undefined,
    onHandle: async () => {
      const ok = window.confirm(
        `Resend confirmation email to ${email || "customer"} for this order?\n\nOrder ID: ${orderId}`,
      );
      if (!ok) {
        props.onComplete();
        return;
      }

      setBusy(true);
      try {
        const response = await fetch("/api/admin/orders/resend-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ orderId }),
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          window.alert(data.error ?? "Failed to resend email.");
          return;
        }
        window.alert("Confirmation email resent successfully.");
      } catch {
        window.alert("Request failed. Please try again.");
      } finally {
        setBusy(false);
        props.onComplete();
      }
    },
  };
};
