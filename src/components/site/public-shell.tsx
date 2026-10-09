import Link from "next/link";
import { LogIn } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";
import styles from "./public-shell.module.css";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Wordmark inverse />
          <div className={styles.actions}>
            <ThemeToggle />
            <Link className={styles.loginLink} href="/login"><LogIn size={20} aria-hidden="true" /> Masuk</Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Single Sign On Kota Bandung · Versi 1.1.0</span>
          <nav aria-label="Tautan informasi">
            <Link href="/bantuan">Pusat Bantuan</Link>
            <span aria-hidden="true">·</span>
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <span aria-hidden="true">·</span>
            <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
