import type { Metadata } from "next";
import { Clock3 } from "lucide-react";

import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";

export const metadata: Metadata = { title: "Session berakhir" };

export default function SessionExpiredPage() {
  return <AuthFrame compact><StatusContent icon={Clock3} eyebrow="Session berakhir" title="Silakan masuk kembali" description="Session Anda telah berakhir untuk melindungi akun. Masuk kembali untuk melanjutkan." /></AuthFrame>;
}
