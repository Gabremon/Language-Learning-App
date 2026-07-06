import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { VercelAnalyticsProvider } from "@/components/analytics/VercelAnalyticsProvider";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ori — Learn Mandarin",
  description: "Bite-sized Mandarin lessons, spaced review, and a visual HSK 1 learning path",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <VercelAnalyticsProvider />
      </body>
    </html>
  );
}
