"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./portal-shell.module.css";

const items = [
  { href: "/portal", label: "Beranda", shortLabel: "Beranda", icon: "home", match: "exact" },
  { href: "/portal/layanan", label: "Daftar Layanan", shortLabel: "Layanan", icon: "grid_view", match: "prefix" },
  { href: "/portal/pengaturan/profil", label: "Pengaturan", shortLabel: "Pengaturan", icon: "settings", match: "settings" },
] as const;

export function PortalNavigation() {
  const pathname = usePathname();

  function isActive(match: (typeof items)[number]["match"], href: string) {
    if (match === "exact") return pathname === href;
    if (match === "settings") return pathname.startsWith("/portal/pengaturan");
    return pathname.startsWith(href);
  }

  return (
    <>
      <nav className={styles.subNav} aria-label="Navigasi portal">
        <div className={styles.subNavInner}>
          <div className={styles.subNavLinks}>
            {items.map(({ href, label, icon, match }) => {
              const active = isActive(match, href);
              return (
                <Link href={href} key={href} aria-current={active ? "page" : undefined}>
                  <MaterialIcon name={icon} size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
          <Link className={styles.backLink} href="/login"><MaterialIcon name="arrow_back" size={16} />{pathname === "/portal/pengaturan/password" ? "Kembali ke Portal Publik" : "Kembali ke Portal Utama"}</Link>
        </div>
      </nav>

      <nav className={styles.mobileNav} aria-label="Navigasi portal seluler">
        {items.map(({ href, shortLabel, icon, match }) => {
          const active = isActive(match, href);
          return (
            <Link href={href} key={href} aria-current={active ? "page" : undefined}>
              <MaterialIcon name={icon} size={22} />
              <span>{shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
