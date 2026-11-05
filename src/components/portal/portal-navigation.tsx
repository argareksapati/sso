"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./portal-shell.module.css";

const baseItems = [
  { href: "/portal", label: "Beranda", shortLabel: "Beranda", icon: "home", match: "exact" },
  { href: "/portal/layanan", label: "Daftar Layanan", shortLabel: "Layanan", icon: "grid_view", match: "prefix" },
  { href: "/portal/pengaturan/profil", label: "Pengaturan", shortLabel: "Pengaturan", icon: "settings", match: "settings" },
] as const;

const adminItem = { href: "/portal/admin/layanan", label: "Kelola Layanan", shortLabel: "Admin", icon: "admin_panel_settings", match: "prefix" } as const;

export function PortalNavigation({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...baseItems, adminItem] : baseItems;

  function isActive(match: "exact" | "prefix" | "settings", href: string) {
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

      <nav className={styles.mobileNav} data-admin={isAdmin} aria-label="Navigasi portal seluler">
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
