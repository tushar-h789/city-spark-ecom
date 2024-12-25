import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { EdgeStoreProvider } from "../lib/edgestore";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import NextAuthSessionProvider from "@/providers/session-provider";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title:
    "City Spark | Plumbing Supplies, Heating Merchants & Bathroom Stores UK",
  description:
    "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title:
      "City Spark | Plumbing Supplies, Heating Merchants & Bathroom Stores UK",
    description:
      "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "City Spark | Plumbing Supplies, Heating Merchants & Bathroom Stores UK",
    description:
      "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
        <QueryProvider>
          <NextAuthSessionProvider>
            <EdgeStoreProvider>
              <ThemeProvider attribute="class" defaultTheme="light">
                {children}
                <Toaster />
              </ThemeProvider>
            </EdgeStoreProvider>
          </NextAuthSessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
