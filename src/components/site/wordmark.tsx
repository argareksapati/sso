import Link from "next/link";

import styles from "./wordmark.module.css";

export function Wordmark() {
  return (
    <Link className={styles.wordmark} href="/login" aria-label="SSO Layanan Kota Bandung, halaman masuk">
      <span className={styles.primary}>SSO Layanan Kota Bandung</span>
      <span className={styles.secondary}>Dinas Komunikasi dan Informatika</span>
    </Link>
  );
}
