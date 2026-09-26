"use client";

import Link from "next/link";
import { Activity, AppWindow, Bell, ChevronRight, KeyRound, MonitorSmartphone, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

import styles from "./account-ui.module.css";

const items = [
  { href: "/portal/pengaturan/profil", label: "Profil Saya", icon: UserRound },
  { href: "/portal/pengaturan/password", label: "Kata Sandi", icon: KeyRound },
  { href: "/portal/pengaturan/aktivitas", label: "Log Aktivitas", icon: Activity },
  { href: "/portal/pengaturan/sesi", label: "Sesi Perangkat", icon: MonitorSmartphone },
  { href: "/portal/pengaturan/aplikasi", label: "Aplikasi Terkoneksi", icon: AppWindow },
  { href: "/portal/pengaturan/notifikasi", label: "Notifikasi", icon: Bell },
] as const;

export function SettingsNavigation() {
  const pathname = usePathname();
  return (
    <aside className={styles.settingsNav}>
      <p>Pengaturan</p>
      <nav aria-label="Pengaturan akun">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link href={href} key={href} aria-current={active ? "page" : undefined}>
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
              {active && <ChevronRight size={17} aria-hidden="true" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

