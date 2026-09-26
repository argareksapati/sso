import type { Metadata } from "next";
import { ShieldX } from "lucide-react";

import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";

export const metadata: Metadata = { title: "Akses tidak tersedia" };

export default function ForbiddenPage() {
  return <AuthFrame compact><StatusContent icon={ShieldX} eyebrow="Akses dibatasi" title="Anda belum dapat membuka halaman ini" description="Akun Anda tidak memiliki akses yang diperlukan. Hubungi pengelola layanan jika menurut Anda akses ini seharusnya tersedia." primaryHref="/portal" primaryLabel="Kembali ke portal" /></AuthFrame>;
}
