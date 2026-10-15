import Link from "next/link";

import { ThemeToggle } from "@/components/site/theme-toggle";
import { Wordmark } from "@/components/site/wordmark";
import { LogoutButton } from "./logout-button";
import { PortalNavigation } from "./portal-navigation";
import styles from "./portal-shell.module.css";

export function PortalShell({ children }: { displayName: string; children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Wordmark inverse href="/portal" />
          <div className={styles.account}>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <PortalNavigation />

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>© 2026 Pemerintah Kota Bandung · Single Sign On</span>
        <span className={styles.footerLinks}>
          <Link href="/bantuan">Bantuan</Link>
          <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
          <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
        </span>
      </footer>
    </div>
  );
}
