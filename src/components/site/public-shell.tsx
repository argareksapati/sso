import Link from "next/link";
import { LogIn, Moon, Sun } from "lucide-react";

import { Wordmark } from "./wordmark";
import styles from "./public-shell.module.css";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Wordmark inverse />
          <div className={styles.actions}>
            <span className={styles.theme} role="img" aria-label="Tema terang aktif">
              <Sun size={17} aria-hidden="true" />
              <Moon size={17} aria-hidden="true" />
            </span>
            <Link className={styles.loginLink} href="/login"><LogIn size={20} aria-hidden="true" /> Masuk</Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Single Sign On Kota Bandung · Lingkungan pengembangan</span>
          <nav aria-label="Tautan informasi"><Link href="/bantuan">Pusat Bantuan</Link><span aria-hidden="true">·</span><span>Integrasi IdP menunggu keputusan</span></nav>
        </div>
      </footer>
    </div>
  );
}
