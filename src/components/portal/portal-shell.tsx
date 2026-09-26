import Link from "next/link";

import { Wordmark } from "@/components/site/wordmark";
import { LogoutButton } from "./logout-button";
import styles from "./portal-shell.module.css";

export function PortalShell({ displayName, children }: { displayName: string; children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Wordmark />
          <div className={styles.account}>
            <span className={styles.name}>{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <nav className={styles.nav} aria-label="Navigasi portal">
        <div className={styles.navInner}>
          <Link href="/portal">Beranda</Link>
          <Link href="/portal/layanan">Semua layanan</Link>
          <span className={styles.disabled} aria-disabled="true">Akun (milestone berikutnya)</span>
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>Lingkungan pengembangan — kandidat aplikasi belum terhubung ke production.</footer>
    </div>
  );
}
