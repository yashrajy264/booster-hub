import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Customer email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      weak: true,
      to: [{ type: "product" }],
      description:
        "Weak reference: you can delete or replace the product document without breaking the order. If the product was removed, this link may show as broken in Studio.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountPaise",
      title: "Amount (paise)",
      type: "number",
    }),
    defineField({
      name: "razorpayOrderId",
      title: "Razorpay order id",
      type: "string",
    }),
    defineField({
      name: "razorpayPaymentId",
      title: "Razorpay payment id",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "fulfilledAt",
      title: "Fulfilled at",
      type: "datetime",
    }),
    defineField({
      name: "downloadCount",
      title: "Download count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "lastDownloadedAt",
      title: "Last downloaded at",
      type: "datetime",
    }),
    defineField({
      name: "confirmationEmailSentAt",
      title: "Confirmation email sent at",
      type: "datetime",
    }),
    defineField({
      name: "confirmationEmailId",
      title: "Confirmation email provider id",
      type: "string",
    }),
  ],
});
