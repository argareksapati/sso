import Link from "next/link";

import { Wordmark } from "./wordmark";
import styles from "./public-shell.module.css";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Wordmark />
          <Link className={styles.help} href="/bantuan">Bantuan</Link>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Lingkungan pengembangan SSO baru</span>
          <nav aria-label="Tautan informasi">
            <Link href="/bantuan">Bantuan</Link>
            <span aria-hidden="true">·</span>
            <span>Privasi: TBD</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
