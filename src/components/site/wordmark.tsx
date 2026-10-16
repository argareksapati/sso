import Image from "next/image";
import Link from "next/link";

import styles from "./wordmark.module.css";

export function Wordmark({
  inverse = false,
  href = "/login",
  variant = "default",
}: {
  inverse?: boolean;
  href?: string;
  variant?: "default" | "portal" | "auth";
}) {
  return (
    <Link className={styles.wordmark} data-inverse={inverse} data-variant={variant} href={href} aria-label="Single Sign On Kota Bandung">
      <span className={styles.logoTile}>
        <Image src="/services/sso-bandung.png" alt="" width={46} height={46} priority />
        <strong>BANDUNG</strong>
      </span>
      <span className={styles.copy}>
        <span className={styles.title}>Single Sign On <small>KOTA BANDUNG</small></span>
        {variant === "default" ? <span className={styles.subtitle}>Masuk Sekali Untuk Semua Layanan Kota Bandung</span> : null}
      </span>
    </Link>
  );
}
