import { Bell, CircleHelp, Search } from "lucide-react";

import { Wordmark } from "@/components/site/wordmark";
import { LogoutButton } from "./logout-button";
import { PortalNavigation } from "./portal-navigation";
import styles from "./portal-shell.module.css";

export function PortalShell({ displayName, children }: { displayName: string; children: React.ReactNode }) {
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Wordmark />
          <form className={styles.search} action="/portal/layanan" method="get" role="search">
            <Search size={18} aria-hidden="true" />
            <input name="q" type="search" placeholder="Cari layanan Kota Bandung" aria-label="Cari layanan Kota Bandung" />
          </form>
          <div className={styles.account}>
            <a className={styles.iconLink} href="/bantuan" aria-label="Bantuan">
              <CircleHelp size={20} aria-hidden="true" />
            </a>
            <button className={styles.notification} type="button" aria-label="Notifikasi" disabled>
              <Bell size={20} aria-hidden="true" />
            </button>
            <span className={styles.avatar} aria-hidden="true">{initials}</span>
            <span className={styles.name}>{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <PortalNavigation />
          <div className={styles.environment}>
            <strong>Lingkungan pengembangan</strong>
            <span>Belum terhubung ke production</span>
          </div>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
      <footer className={styles.footer}>
        <span>SSO Layanan Kota Bandung</span>
        <span>Dinas Komunikasi dan Informatika Kota Bandung</span>
      </footer>
    </div>
  );
}
