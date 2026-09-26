import styles from "./auth-frame.module.css";

const steps = [
  ["01", "Masuk", "Gunakan identitas akun yang sudah terdaftar."],
  ["02", "Pilih layanan", "Layanan yang berhak Anda akses akan ditampilkan."],
  ["03", "Lanjutkan", "Buka layanan terintegrasi tanpa mengulang login."],
] as const;

export function AuthFrame({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <section className={`${styles.frame} ${compact ? styles.compact : ""}`} aria-label="Akses SSO Bandung">
      {!compact && (
        <aside className={styles.context}>
          <p className={styles.eyebrow}>Akses layanan terintegrasi</p>
          <h1>Satu proses masuk untuk layanan yang terhubung.</h1>
          <p className={styles.lead}>
            Gunakan akun yang telah terdaftar. Daftar layanan akan tampil setelah identitas Anda diverifikasi.
          </p>
          <ol className={styles.steps}>
            {steps.map(([number, title, description]) => (
              <li key={number}>
                <span className={styles.number}>{number}</span>
                <span><strong>{title}</strong><small>{description}</small></span>
              </li>
            ))}
          </ol>
          <p className={styles.notice}>Sistem baru ini masih dikembangkan terpisah dari SSO produksi.</p>
        </aside>
      )}
      <div className={styles.formArea}>{children}</div>
    </section>
  );
}
