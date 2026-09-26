import type { Metadata } from "next";
import { CircleHelp } from "lucide-react";

import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";

export const metadata: Metadata = { title: "Bantuan" };

export default function HelpPage() {
  return (
    <AuthFrame compact>
      <StatusContent icon={CircleHelp} eyebrow="Bantuan" title="Informasi bantuan sedang disiapkan" description="Kontak, jam layanan, dan prosedur bantuan resmi menunggu konfirmasi PIC. Halaman ini tidak menampilkan kontak sementara agar pengguna tidak diarahkan ke pihak yang salah." />
    </AuthFrame>
  );
}
