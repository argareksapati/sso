import Image from "next/image";
import Link from "next/link";

import styles from "./wordmark.module.css";

export function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={styles.wordmark} data-inverse={inverse} href="/login" aria-label="Single Sign On Kota Bandung, halaman masuk">
      <span className={styles.logoTile}>
        <Image src="/services/sso-bandung.png" alt="" width={46} height={46} priority />
        <strong>BANDUNG</strong>
      </span>
      <span className={styles.copy}>
        <span className={styles.title}>Single Sign On <small>KOTA BANDUNG</small></span>
        <span className={styles.subtitle}>Masuk Sekali Untuk Semua Layanan Kota Bandung</span>
      </span>
    </Link>
  );
}
