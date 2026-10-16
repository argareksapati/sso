import Link from "next/link";

import { MaterialIcon } from "@/components/ui/material-icon";
import styles from "./status-content.module.css";

export function StatusContent({
  icon,
  eyebrow,
  title,
  description,
  primaryHref = "/login",
  primaryLabel = "Kembali ke halaman masuk",
  children,
}: {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.status}>
      <span className={styles.icon}><MaterialIcon name={icon} size={27} /></span>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
      {children}
      <Link className={styles.primary} href={primaryHref}>{primaryLabel}</Link>
    </div>
  );
}
