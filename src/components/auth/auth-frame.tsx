import styles from "./auth-frame.module.css";

export function AuthFrame({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <section className={`${styles.frame} ${compact ? styles.compact : ""}`} aria-label="Akses SSO Bandung">
      <div className={styles.formArea}>
        <div className={styles.bandungRibbon} aria-hidden="true"><span /><span /><span /></div>
        {children}
      </div>
    </section>
  );
}
