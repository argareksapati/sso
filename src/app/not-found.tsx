import { AuthFrame } from "@/components/auth/auth-frame";
import { StatusContent } from "@/components/auth/status-content";
import { PublicShell } from "@/components/site/public-shell";

export default function NotFound() {
  return <PublicShell><AuthFrame compact><StatusContent icon="help" eyebrow="404" title="Halaman tidak ditemukan" description="Alamat yang dibuka tidak tersedia atau sudah berubah." /></AuthFrame></PublicShell>;
}
