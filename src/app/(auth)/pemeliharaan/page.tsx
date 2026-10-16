import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";

export const metadata: Metadata = { title: "Pemeliharaan" };

export default function MaintenancePage() {
  return <AuthFrame compact><StatusContent icon="build" eyebrow="Pemeliharaan layanan" title="Layanan sementara tidak tersedia" description="Tim pengelola sedang melakukan pemeliharaan. Silakan coba kembali setelah beberapa saat." /></AuthFrame>;
}
