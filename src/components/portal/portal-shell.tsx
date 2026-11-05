import Link from "next/link";

import { ThemeToggle } from "@/components/site/theme-toggle";
import { Wordmark } from "@/components/site/wordmark";
import { MaterialIcon } from "@/components/ui/material-icon";
import { LogoutButton } from "./logout-button";
import { PortalNavigation } from "./portal-navigation";
import styles from "./portal-shell.module.css";

export function PortalShell({ children, isAdmin = false }: { displayName: string; isAdmin?: boolean; children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandGroup}>
            <Wordmark inverse href="/portal" variant="portal" />
            {isAdmin && <span className={styles.adminMode}><MaterialIcon name="admin_panel_settings" size={12} /> Mode Admin</span>}
          </div>
          <div className={styles.account}>
            <ThemeToggle compact />
            <LogoutButton />
          </div>
        </div>
      </header>

      <PortalNavigation />

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>Sistem SSO Kota Bandung Aktif &amp; Aman <i aria-hidden="true">|</i> Versi 1.1.0</span>
        <span className={styles.footerLinks}>
          <Link href="/bantuan">Bantuan</Link>
          <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
          <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
        </span>
      </footer>
    </div>
  );
}
