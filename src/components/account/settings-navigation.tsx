"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./account-ui.module.css";

const items = [
  { href: "/portal/pengaturan/profil", label: "Profil Saya", icon: "person" },
  { href: "/portal/pengaturan/password", label: "Kata Sandi", icon: "lock" },
  { href: "/portal/pengaturan/aktivitas", label: "Log Aktivitas", icon: "history" },
  { href: "/portal/pengaturan/sesi", label: "Sesi Perangkat", icon: "devices" },
  { href: "/portal/pengaturan/aplikasi", label: "Aplikasi Terkoneksi", icon: "extension" },
  { href: "/portal/pengaturan/notifikasi", label: "Notifikasi", icon: "notifications" },
] as const;

export function SettingsNavigation() {
  const pathname = usePathname();
  const activeItem = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    activeItem.current?.scrollIntoView({ behavior: "instant", block: "nearest", inline: "nearest" });
  }, [pathname]);

  return (
    <aside className={styles.settingsNav}>
      <div className={styles.settingsNavHeader}>
        <p><b>Pengaturan</b><i>Pengaturan akun</i></p>
        <span>Geser <MaterialIcon name="chevron_right" size={13} /></span>
      </div>
      <nav aria-label="Pengaturan akun">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link ref={active ? activeItem : undefined} href={href} key={href} aria-current={active ? "page" : undefined}>
              <MaterialIcon name={icon} size={19} />
              <span>{label}</span>
              {active && <MaterialIcon name="chevron_right" size={17} />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

