"use client";

import { TriangleAlert } from "lucide-react";

import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";
import { PublicShell } from "@/components/site/public-shell";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicShell>
      <AuthFrame compact>
        <StatusContent icon={TriangleAlert} eyebrow="Gangguan layanan" title="Halaman belum dapat dimuat" description="Terjadi gangguan saat memuat halaman. Coba sekali lagi atau kembali ke halaman masuk.">
          <button type="button" onClick={reset}>Coba lagi</button>
        </StatusContent>
      </AuthFrame>
    </PublicShell>
  );
}
