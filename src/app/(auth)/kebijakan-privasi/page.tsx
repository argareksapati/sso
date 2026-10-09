import type { Metadata } from "next";

import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Kebijakan Privasi" };

const sections = [
  {
    title: "Data yang diproses",
    paragraphs: ["SSO Kota Bandung memproses data yang diperlukan untuk membuat akun, memverifikasi identitas, menjaga sesi masuk, dan menghubungkan pengguna ke layanan yang disetujui."],
    items: ["Nama dan alamat email.", "Identitas akun dari Google atau penyedia identitas yang dipilih.", "Catatan keamanan seperti waktu masuk, perangkat, alamat IP yang disingkat, dan hasil autentikasi.", "Preferensi akun serta daftar aplikasi yang diizinkan pengguna."],
  },
  {
    title: "Tujuan penggunaan",
    paragraphs: ["Data digunakan untuk autentikasi, pencegahan penyalahgunaan, pemulihan akun, audit keamanan, serta pemberian akses ke layanan Kota Bandung yang telah terintegrasi."],
  },
  {
    title: "Penyedia layanan",
    paragraphs: ["Autentikasi dan penyimpanan identitas menggunakan Supabase. Login Google diproses melalui Google OAuth. Hosting aplikasi dapat menggunakan Vercel. Masing-masing penyedia memproses data sesuai kebijakan dan pengaturan layanan mereka."],
  },
  {
    title: "Kendali pengguna",
    paragraphs: ["Pengguna dapat keluar dari sesi, mencabut akses aplikasi terkoneksi, dan meminta koreksi atau penghapusan akun melalui Pusat Bantuan. Catatan tertentu dapat dipertahankan selama diperlukan untuk keamanan, audit, dan kewajiban hukum."],
  },
  {
    title: "Keamanan dan perubahan kebijakan",
    paragraphs: ["Kami memakai koneksi terenkripsi, kontrol sesi, pembatasan percobaan autentikasi, dan pencatatan kejadian keamanan. Kebijakan ini dapat diperbarui ketika integrasi atau kebutuhan layanan berubah; tanggal pembaruan akan dicantumkan pada halaman ini."],
  },
] as const;

export default function PrivacyPolicyPage() {
  return <LegalPage eyebrow="Informasi layanan" title="Kebijakan Privasi" summary="Penjelasan mengenai data yang digunakan oleh Single Sign On Kota Bandung dan cara pengguna mengendalikan aksesnya." sections={sections} />;
}
