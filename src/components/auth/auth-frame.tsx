import Image from "next/image";
import { ArrowRight, Network, ShieldCheck, UserRoundCheck } from "lucide-react";

import styles from "./auth-frame.module.css";

const services: ReadonlyArray<{ name: string; detail: string; logo?: string }> = [
  { name: "Sadayana", detail: "Portal Layanan Publik Kota Bandung", logo: "/services/sso-bandung.png" },
  { name: "Salaman", detail: "Sistem Layanan Administrasi Kependudukan", logo: "/services/salaman.jpg" },
  { name: "New Bimma", detail: "Aplikasi Bimbingan & Manajemen" },
  { name: "AI Asisten Bandung", detail: "Layanan Kecerdasan Buatan Pemkot", logo: "/services/teh-ai.png" },
];

export function AuthFrame({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <section className={`${styles.frame} ${compact ? styles.compact : ""}`} aria-label="Akses SSO Bandung">
      {!compact && (
        <aside className={styles.context}>
          <h1>Masuk sekali, akses semua layanan Kota Bandung.</h1>
          <p className={styles.lead}>Gunakan satu akun untuk terhubung ke layanan digital, dashboard, dan aplikasi internal yang terdaftar.</p>

          <div className={styles.sectionTitle}>
            <strong>Layanan terintegrasi</strong>
            <span>14 layanan</span>
          </div>
          <div className={styles.serviceList}>
            {services.map((service) => (
              <div className={styles.service} key={service.name}>
                <span className={styles.serviceLogo}>
                  {service.logo ? <Image src={service.logo} alt="" width={44} height={44} /> : <Network size={22} aria-hidden="true" />}
                </span>
                <span className={styles.serviceCopy}><strong>{service.name}</strong><small>{service.detail}</small></span>
                <span className={styles.catalogBadge}>Referensi katalog</span>
                <ArrowRight size={20} aria-hidden="true" />
              </div>
            ))}
          </div>

          <div className={styles.features}>
            <div><ShieldCheck size={22} aria-hidden="true" /><strong>Keamanan</strong><span>Login terpusat dengan kontrol sesi yang jelas.</span></div>
            <div><UserRoundCheck size={22} aria-hidden="true" /><strong>Satu akun</strong><span>Akses lintas layanan tanpa mengulang proses masuk.</span></div>
            <div><Network size={22} aria-hidden="true" /><strong>Terintegrasi</strong><span>Siap untuk layanan publik dan aplikasi internal ASN.</span></div>
          </div>
          <p className={styles.notice}>Katalog ini adalah referensi migrasi. Koneksi production diaktifkan setelah IdP dan client disetujui.</p>
        </aside>
      )}
      <div className={styles.formArea}>{children}</div>
    </section>
  );
}
