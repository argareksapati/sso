"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Activity, AppWindow, Bell, Grid2X2, KeyRound, LayoutDashboard, MonitorSmartphone, UserRound } from "lucide-react";

import styles from "./portal-shell.module.css";

const primary = [
  { href: "/portal", label: "Beranda", icon: LayoutDashboard, exact: true },
  { href: "/portal/layanan", label: "Semua layanan", icon: Grid2X2 },
] as const;

const account = [
  { href: "/portal/pengaturan/profil", label: "Profil saya", icon: UserRound },
  { href: "/portal/pengaturan/password", label: "Kata sandi", icon: KeyRound },
  { href: "/portal/pengaturan/sesi", label: "Sesi perangkat", icon: MonitorSmartphone },
  { href: "/portal/pengaturan/aplikasi", label: "Aplikasi terkoneksi", icon: AppWindow },
  { href: "/portal/pengaturan/notifikasi", label: "Notifikasi", icon: Bell },
  { href: "/portal/pengaturan/aktivitas", label: "Log aktivitas", icon: Activity },
] as const;

function NavigationLink({ href, label, icon: Icon, exact = false }: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (active && window.matchMedia("(max-width: 760px)").matches) {
      linkRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }, [active]);

  return (
    <Link ref={linkRef} href={href} aria-current={active ? "page" : undefined}>
      <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

export function PortalNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Navigasi portal">
      <div className={styles.navGroup}>
        <p className={styles.navLabel}>Portal</p>
        {primary.map((item) => <NavigationLink key={item.href} {...item} />)}
      </div>
      <div className={styles.navGroup}>
        <p className={styles.navLabel}>Pengaturan akun</p>
        {account.map((item) => <NavigationLink key={item.href} {...item} />)}
      </div>
    </nav>
  );
}
