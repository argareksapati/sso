import Link from "next/link";

import { MaterialIcon } from "@/components/ui/material-icon";
import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";
import styles from "./public-shell.module.css";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.network} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glow} />
        <svg className={styles.connections} viewBox="0 0 1000 700" preserveAspectRatio="none">
          <g>
            <line x1="100" y1="140" x2="250" y2="280" /><line x1="250" y1="280" x2="150" y2="490" />
            <line x1="250" y1="280" x2="400" y2="175" /><line x1="850" y1="126" x2="750" y2="315" />
            <line x1="750" y1="315" x2="880" y2="525" /><line x1="750" y1="315" x2="600" y2="210" />
            <line x1="150" y1="490" x2="350" y2="595" /><line x1="880" y1="525" x2="650" y2="560" />
          </g>
          <g className={styles.dataStreams}>
            <line x1="100" y1="140" x2="250" y2="280" /><line x1="750" y1="315" x2="600" y2="210" />
            <line x1="850" y1="126" x2="750" y2="315" />
          </g>
        </svg>
        <span className={`${styles.node} ${styles.nodeCloud}`}><MaterialIcon name="cloud_done" size={24} /></span>
        <span className={`${styles.node} ${styles.nodeKey}`}><MaterialIcon name="vpn_key" size={24} /></span>
        <span className={`${styles.node} ${styles.nodeHub}`}><MaterialIcon name="hub" size={24} /></span>
        <span className={`${styles.node} ${styles.nodeShield}`}><MaterialIcon name="admin_panel_settings" size={24} /></span>
        <span className={`${styles.ring} ${styles.ringTop}`} />
        <span className={`${styles.ring} ${styles.ringBottom}`} />
      </div>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Wordmark inverse variant="auth" />
          <div className={styles.actions}>
            <ThemeToggle auth />
            <Link className={styles.loginLink} href="/login"><MaterialIcon name="login" size={20} /> Masuk</Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Sistem SSO Kota Bandung Online <b aria-hidden="true">|</b> Versi 1.1.0</span>
          <nav aria-label="Tautan informasi">
            <Link href="/bantuan">Bantuan</Link>
            <span aria-hidden="true">|</span>
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <span aria-hidden="true">|</span>
            <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
