"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2X2, Settings, UserRound } from "lucide-react";

import styles from "./portal-shell.module.css";

const items = [
  { href: "/portal", label: "Profil Saya", shortLabel: "Profil", icon: UserRound, match: "exact" },
  { href: "/portal/layanan", label: "Daftar Layanan", shortLabel: "Layanan", icon: Grid2X2, match: "prefix" },
  { href: "/portal/pengaturan/profil", label: "Pengaturan", shortLabel: "Pengaturan", icon: Settings, match: "settings" },
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
            {items.map(({ href, label, icon: Icon, match }) => {
              const active = isActive(match, href);
              return (
                <Link href={href} key={href} aria-current={active ? "page" : undefined}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
          <Link className={styles.backLink} href="/login">Kembali ke Portal Publik</Link>
        </div>
      </nav>

      <nav className={styles.mobileNav} aria-label="Navigasi portal seluler">
        {items.map(({ href, shortLabel, icon: Icon, match }) => {
          const active = isActive(match, href);
          return (
            <Link href={href} key={href} aria-current={active ? "page" : undefined}>
              <Icon size={21} aria-hidden="true" />
              <span>{shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
