import styles from "./account-ui.module.css";

export function AccountPage({ eyebrow = "Pengaturan akun", title, description, action, children }: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action && <div className={styles.headerAction}>{action}</div>}
      </header>
      {children}
    </div>
  );
}

export function Panel({ title, description, children, className = "" }: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.panel} ${className}`}>
      {(title || description) && (
        <header className={styles.panelHeader}>
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </header>
      )}
      <div className={styles.panelBody}>{children}</div>
    </section>
  );
}

export function Status({ children, tone = "neutral" }: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "info";
}) {
  return <span className={styles.status} data-tone={tone}>{children}</span>;
}

export { styles as accountStyles };
