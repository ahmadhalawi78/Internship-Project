import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "LoopLebanon",
  description: "Community bartering and food sharing platform for Lebanon.",
  openGraph: {
    title: "LoopLebanon",
    description: "Community bartering and food sharing platform for Lebanon.",
    url: "https://loop-lebanon.vercel.app",
    siteName: "LoopLebanon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoopLebanon",
    description: "Community bartering and food sharing platform for Lebanon.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
