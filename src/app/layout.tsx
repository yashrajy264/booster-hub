import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description:
    "Affordable PDF study packs for government jobs and competitive exams — current affairs, MCQs, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background font-sans text-foreground"
      >
        {children}
      </body>
    </html>
  );
}
