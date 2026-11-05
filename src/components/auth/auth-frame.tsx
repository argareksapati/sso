import Image from "next/image";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./auth-frame.module.css";

export function AuthFrame({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <section className={`${styles.frame} ${compact ? styles.compact : ""}`} aria-label="Akses SSO Bandung">
      {compact ? (
        <div className={styles.compactCard}>{children}</div>
      ) : (
        <div className={styles.authCard}>
          <aside className={styles.hero} aria-labelledby="sso-hero-title">
            <Image
              className={styles.heroImage}
              src="/images/balai-kota-bandung.jpg"
              alt="Balai Kota Bandung"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 58vw"
            />
            <div className={styles.heroOverlay} aria-hidden="true" />
            <div className={styles.bandungRibbon} aria-hidden="true"><span /><span /><span /></div>
            <div className={styles.heroCopy}>
              <span className={styles.cityBadge}><MaterialIcon name="location_city" size={16} /> Pemerintah Kota Bandung</span>
              <h1 id="sso-hero-title">Pusat Pelayanan Digital Terpadu</h1>
              <p>Mengintegrasikan seluruh sistem informasi publik dan internal Pemkot Bandung dalam satu pintu SSO yang aman, cepat, dan handal.</p>
            </div>
          </aside>
          <div className={styles.formArea}>{children}</div>
        </div>
      )}
    </section>
  );
}
