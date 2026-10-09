import type { Metadata } from "next";
import { MailCheck } from "lucide-react";

import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";

export const metadata: Metadata = { title: "Periksa email" };

export default function RegistrationSuccessPage() {
  return (
    <AuthFrame compact>
      <StatusContent
        icon={MailCheck}
        eyebrow="Pendaftaran akun"
        title="Periksa email Anda"
        description="Jika alamat tersebut dapat didaftarkan, kami mengirim tautan verifikasi. Buka tautan itu untuk mengaktifkan akun, lalu masuk ke SSO Kota Bandung."
      />
    </AuthFrame>
  );
}
