import Link from "next/link";
import { Bell, Grid2X2, LayoutDashboard, Settings } from "lucide-react";

import { Wordmark } from "@/components/site/wordmark";
import { LogoutButton } from "./logout-button";
import styles from "./portal-shell.module.css";

export function PortalShell({ displayName, children }: { displayName: string; children: React.ReactNode }) {
  const initials = displayName.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Wordmark inverse />
          <nav className={styles.topNav} aria-label="Navigasi utama">
            <Link href="/portal"><LayoutDashboard size={18} aria-hidden="true" /> Beranda</Link>
            <Link href="/portal/layanan"><Grid2X2 size={18} aria-hidden="true" /> Layanan</Link>
            <Link href="/portal/pengaturan/profil"><Settings size={18} aria-hidden="true" /> Pengaturan</Link>
          </nav>
          <div className={styles.account}>
            <button className={styles.notification} type="button" aria-label="Notifikasi belum aktif" disabled><Bell size={19} aria-hidden="true" /></button>
            <span className={styles.avatar} aria-hidden="true">{initials}</span>
            <span className={styles.name}>{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <span>Single Sign On Kota Bandung</span>
        <span>Dinas Komunikasi dan Informatika Kota Bandung · Lingkungan pengembangan</span>
      </footer>
    </div>
  );
}
