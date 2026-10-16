import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import { connection } from "next/server";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "SSO Layanan Kota Bandung", template: "%s | SSO Layanan Kota Bandung" },
  description: "Portal masuk untuk layanan Kota Bandung yang terintegrasi.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark" };

const themeBootstrap = `(()=>{try{const k="sso-theme";const s=localStorage.getItem(k);const t=s==="dark"||s==="light"?s:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch{document.documentElement.dataset.theme="light";document.documentElement.style.colorScheme="light"}})()`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // A fresh CSP nonce is attached by proxy.ts for every request. Dynamic
  // rendering lets Next.js propagate that nonce to its framework scripts.
  await connection();
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html lang="id" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
