import { MaterialIcon } from "@/components/ui/material-icon";
import { SettingsNavigation } from "./settings-navigation";
import styles from "./account-ui.module.css";

export function AccountPage({ eyebrow, title, description, action, settings = false, children }: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  settings?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action && <div className={styles.headerAction}>{action}</div>}
      </header>
      {settings ? <div className={styles.settingsLayout}><SettingsNavigation /><div className={styles.settingsContent}>{children}</div></div> : children}
    </div>
  );
}

export function AccountHero({ eyebrow, title, description, materialIcon, stat, children, className = "" }: {
  eyebrow: string;
  title: string;
  description?: string;
  materialIcon?: string;
  stat?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.hero} ${className}`}>
      <span className={styles.accentLine} aria-hidden="true"><i /><i /><i /></span>
      <div className={styles.heroCopy}>
        <span className={styles.heroEyebrow}>{materialIcon ? <MaterialIcon name={materialIcon} size={17} /> : null}{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {children}
      </div>
      {stat && <div className={styles.heroStat}>{stat}</div>}
    </section>
  );
}

export function Panel({ title, description, materialIcon, children, className = "" }: {
  title?: string;
  description?: string;
  materialIcon?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.panel} ${className}`}>
      {(title || description) && (
        <header className={styles.panelHeader}>
          {title && <h2>{materialIcon ? <span className={styles.panelIcon}><MaterialIcon name={materialIcon} size={19} /></span> : null}{title}</h2>}
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
