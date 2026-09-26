import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";

export const metadata: Metadata = { title: "Reset kata sandi" };

export default function ResetPasswordPage() {
  return (
    <AuthFrame compact>
      <StatusContent
        icon={KeyRound}
        eyebrow="Reset kata sandi"
        title="Tautan reset belum dapat digunakan"
        description="Alur reset akan diaktifkan setelah penyedia identitas dan channel pemulihan disetujui. Tidak ada kata sandi produksi yang diproses pada lingkungan ini."
      />
    </AuthFrame>
  );
}
