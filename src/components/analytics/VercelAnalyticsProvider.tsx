"use client";

import dynamic from "next/dynamic";

const VercelAnalytics = dynamic(
  () => import("@/components/analytics/VercelAnalytics").then((mod) => mod.VercelAnalytics),
  { ssr: false }
);

export function VercelAnalyticsProvider() {
  if (!process.env.NEXT_PUBLIC_VERCEL_ENV) return null;
  return <VercelAnalytics />;
}
