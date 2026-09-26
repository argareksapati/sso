import type { Metadata } from "next";
import { MailCheck } from "lucide-react";

import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";

export const metadata: Metadata = { title: "Petunjuk pemulihan" };

export default function RecoverySentPage() {
  return (
    <AuthFrame compact>
      <StatusContent
        icon={MailCheck}
        eyebrow="Pemulihan akun"
        title="Periksa petunjuk pemulihan"
        description="Jika akun dapat dipulihkan, petunjuk berikutnya akan dikirim melalui channel yang terdaftar. Pesan dapat memerlukan beberapa menit untuk diterima."
      />
    </AuthFrame>
  );
}
