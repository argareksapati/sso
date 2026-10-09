import type { Metadata } from "next";

import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Syarat & Ketentuan" };

const sections = [
  {
    title: "Penggunaan akun",
    paragraphs: ["Pengguna bertanggung jawab memberikan informasi yang benar, menjaga kerahasiaan kata sandi, dan mengamankan perangkat yang digunakan untuk masuk. Satu akun tidak boleh dipakai untuk menyamar sebagai orang lain atau mengakses layanan tanpa kewenangan."],
  },
  {
    title: "Akses ke layanan terintegrasi",
    paragraphs: ["SSO menyediakan autentikasi terpusat. Hak akses, ketersediaan fitur, dan keputusan pelayanan tetap mengikuti aturan masing-masing aplikasi atau instansi pengelola."],
  },
  {
    title: "Aktivitas yang dilarang",
    items: ["Menguji, mengganggu, atau melewati kontrol keamanan tanpa izin tertulis.", "Menggunakan otomatisasi untuk membuat akun massal atau membebani layanan.", "Menyalahgunakan data pribadi, token, sesi, atau akses milik pengguna lain."],
  },
  {
    title: "Keamanan akun",
    paragraphs: ["Kami dapat membatasi, menangguhkan, atau mengakhiri sesi ketika terdeteksi risiko keamanan, pelanggaran ketentuan, atau permintaan yang sah dari pengelola layanan. Pengguna harus segera mencabut sesi yang tidak dikenal dan mengganti kredensialnya."],
  },
  {
    title: "Perubahan dan kontak",
    paragraphs: ["Fitur dan ketentuan dapat diperbarui mengikuti tahap pengembangan serta kebijakan Pemerintah Kota Bandung. Pertanyaan, koreksi data, atau laporan masalah dapat disampaikan melalui Pusat Bantuan."],
  },
] as const;

export default function TermsPage() {
  return <LegalPage eyebrow="Ketentuan layanan" title="Syarat & Ketentuan" summary="Aturan dasar penggunaan akun dan akses layanan melalui Single Sign On Kota Bandung." sections={sections} />;
}
