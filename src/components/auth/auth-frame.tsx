import Image from "next/image";
import {
  ArrowRight,
  Landmark,
  MapPinned,
  Megaphone,
  Network,
  ShieldCheck,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

import styles from "./auth-frame.module.css";

type Service = {
  id: string;
  name: string;
  detail: string;
  logo?: string;
  icon?: LucideIcon;
  iconTone?: "blue" | "red" | "teal";
};

const services: ReadonlyArray<Service> = [
  { id: "sadayana", name: "Sadayana", detail: "Portal Layanan Publik Kota Bandung", logo: "/services/sadayana.png" },
  { id: "salaman", name: "Salaman", detail: "Sistem Layanan Administrasi Kependudukan", logo: "/services/salaman-logo.png" },
  { id: "new-bimma", name: "New Bimma", detail: "Aplikasi Bimbingan & Manajemen", logo: "/services/new-bimma.png" },
  { id: "ai-asisten", name: "AI Asisten Bandung", detail: "Layanan Kecerdasan Buatan Pemkot", logo: "/services/teh-ai-logo.png" },
  { id: "management-pemdi", name: "Management Pemdi", detail: "Manajemen Pembangunan Daerah", icon: Landmark, iconTone: "blue" },
  { id: "arimbi", name: "Arimbi", detail: "Aplikasi Real-Time Informasi Pangan", logo: "/services/arimbi-logo.png" },
  { id: "open-data", name: "Open Data Kota Bandung", detail: "Portal Satu Data & Data Terbuka", logo: "/services/bandung-opendata-logo.png" },
  { id: "dpmptsp-investasi", name: "DPMPTSP Kota Bandung", detail: "Layanan Perizinan & Investasi Kota Bandung", logo: "/services/dpmptsp-logo.png" },
  { id: "gercep-asik", name: "Gercep Asik", detail: "Sistem Penanganan Aduan Cepat", logo: "/services/gercep.png" },
  { id: "bcj", name: "BCJ", detail: "Bandung Citizen Journalism", logo: "/services/bcj.png" },
  { id: "bandung-kita", name: "Bandung Kita", detail: "Media & Informasi Komunitas", icon: Megaphone, iconTone: "red" },
  { id: "smart-map-plus", name: "Bandung Smart Map Plus", detail: "Peta Geospasial Interaktif", icon: MapPinned, iconTone: "teal" },
  { id: "dpmptsp", name: "DPMPTSP Kota Bandung", detail: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu", logo: "/services/dpmptsp-logo.png" },
  { id: "bsm-pro", name: "BSM PRO", detail: "Bandung Smart Maps Professional", logo: "/services/bsm-pro-logo.png" },
];

function ServiceSet({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className={`${styles.serviceSet} ${duplicate ? styles.duplicateSet : ""}`}
      role={duplicate ? undefined : "list"}
      aria-hidden={duplicate || undefined}
    >
      {services.map((service) => {
        const ServiceIcon = service.icon;
        const iconTone = service.iconTone === "red"
          ? styles.serviceLogoRed
          : service.iconTone === "teal"
            ? styles.serviceLogoTeal
            : styles.serviceLogoBlue;

        return (
          <div className={styles.service} role={duplicate ? undefined : "listitem"} key={`${duplicate ? "duplicate" : "primary"}-${service.id}`}>
            <span className={`${styles.serviceLogo} ${ServiceIcon ? iconTone : ""}`}>
              {service.logo
                ? <Image src={service.logo} alt="" width={48} height={48} sizes="48px" loading="eager" />
                : ServiceIcon && <ServiceIcon size={23} aria-hidden="true" />}
            </span>
            <span className={styles.serviceCopy}><strong>{service.name}</strong><small>{service.detail}</small></span>
            <span className={styles.catalogBadge}>Referensi katalog</span>
            <ArrowRight size={20} aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}

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
          <div
            className={styles.serviceViewport}
            role="region"
            aria-label="Daftar 14 layanan terintegrasi yang bergerak otomatis. Arahkan pointer atau fokuskan daftar untuk menjeda."
            tabIndex={0}
          >
            <div className={styles.serviceTrack}>
              <ServiceSet />
              <ServiceSet duplicate />
            </div>
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
