import type { Metadata, Viewport } from "next";
import { connection } from "next/server";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SSO Layanan Kota Bandung", template: "%s | SSO Layanan Kota Bandung" },
  description: "Portal masuk untuk layanan Kota Bandung yang terintegrasi.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // A fresh CSP nonce is attached by proxy.ts for every request. Dynamic
  // rendering lets Next.js propagate that nonce to its framework scripts.
  await connection();

  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
