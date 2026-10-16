import Image from "next/image";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./auth-frame.module.css";

export function AuthFrame({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <section className={`${styles.frame} ${compact ? styles.compact : ""}`} aria-label="Akses SSO Bandung">
      {!compact && (
        <aside className={styles.hero} aria-labelledby="sso-welcome-title">
          <Image
            className={styles.heroImage}
            src="/images/gedung-sate-bandung-large.jpg"
            alt="Gedung Sate, pusat pemerintahan Provinsi Jawa Barat di Kota Bandung"
            fill
            priority
            sizes="(max-width: 1040px) 100vw, 58vw"
          />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={styles.heroShimmer} aria-hidden="true" />

          <div className={styles.heroTop}>
            <div className={styles.serviceBadge}>
              <span className={styles.badgeIcon}><MaterialIcon name="apps" size={18} /></span>
              <span><small>Terhubung</small><strong>14+ portal layanan</strong></span>
            </div>
          </div>

          <div className={styles.heroCopy}>
            <div className={styles.mobileBadge}><MaterialIcon name="verified" size={17} /> Satu akses terpadu SSO</div>
            <h1 id="sso-welcome-title">Selamat Datang di Portal Single Sign On Kota Bandung</h1>
            <p>Kemudahan akses layanan informasi, pengaduan publik, serta aplikasi operasional pemerintah dalam satu genggaman terintegrasi.</p>
            <div className={styles.heroMeta}>
              <span className={styles.cityMark}>
                <i className={styles.blueDot} /><i className={styles.yellowDot} /><i className={styles.greenDot} />
                <strong>Pemkot Bandung</strong>
              </span>
              <span className={styles.securityBadge}><MaterialIcon name="lock" size={16} /> Enkripsi Aman</span>
            </div>
          </div>
        </aside>
      )}

      <div className={styles.formArea}>
        {!compact && <div className={styles.bandungRibbon} aria-hidden="true"><span /><span /><span /></div>}
        {children}
      </div>
    </section>
  );
}
